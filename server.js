
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { MongoClient, ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// ==========================================
// MONGODB CONNECTION
// ==========================================

let clientPromise;

async function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
}

async function getCollection(collectionName) {
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || "batra_accessories");

  return db.collection(collectionName);
}

async function getProductsCollection() {
  return getCollection("products");
}

async function getOrdersCollection() {
  return getCollection("orders");
}

// ==========================================
// ADMIN ACCOUNTS
// ==========================================

function getAdminUsers() {
  try {
    const users = JSON.parse(process.env.ADMIN_USERS_JSON || "[]");

    if (!Array.isArray(users)) {
      throw new Error("Admin users must be an array");
    }

    return users;
  } catch {
    throw new Error("ADMIN_USERS_JSON is not valid JSON");
  }
}

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

// ==========================================
// LOGIN RATE LIMIT
// ==========================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Try again later.",
  },
});

// ==========================================
// IMAGE UPLOAD
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"));
    }

    callback(null, true);
  },
});

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    configureCloudinary();

    cloudinary.uploader
      .upload_stream(
        {
          folder: "batra-mobile-accessories",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
}

// ==========================================
// DASHBOARD HELPER FUNCTIONS
// ==========================================

function getNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[₹,\s]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function getOrderAmount(order) {
  return getNumber(
    order.totalAmount ??
    order.total ??
    order.grandTotal ??
    order.amount ??
    order.totalPrice ??
    0
  );
}

function getOrderStatus(order) {
  return String(
    order.orderStatus ??
    order.status ??
    "pending"
  ).toLowerCase().trim();
}

function getPaymentStatus(order) {
  return String(
    order.paymentStatus ??
    order.payment_status ??
    ""
  ).toLowerCase().trim();
}

function isOrderPaid(order) {
  const paymentStatus = getPaymentStatus(order);

  return (
    order.isPaid === true ||
    order.paid === true ||
    ["paid", "success", "successful", "verified"].includes(paymentStatus)
  );
}

function getOrderItems(order) {
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.products)) return order.products;

  return [];
}

function getItemQuantity(item) {
  return getNumber(item.quantity ?? item.qty ?? 1);
}

function getItemName(item) {
  return String(
    item.name ??
    item.productName ??
    item.title ??
    "Unknown Product"
  );
}

function getItemPrice(item) {
  return getNumber(
    item.price ??
    item.sellingPrice ??
    item.unitPrice ??
    0
  );
}

function getItemCost(item) {
  return getNumber(
    item.costPrice ??
    item.purchasePrice ??
    item.cost ??
    0
  );
}

function getOrderDate(order) {
  const date =
    order.createdAt ??
    order.orderDate ??
    order.date ??
    null;

  if (!date) return null;

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function calculateOrderProfit(order) {
  // Use explicitly saved profit if available.
  if (order.profit !== undefined) {
    return getNumber(order.profit);
  }

  // Otherwise calculate from item selling price and cost price.
  const items = getOrderItems(order);

  return items.reduce((total, item) => {
    const quantity = getItemQuantity(item);
    const sellingPrice = getItemPrice(item);
    const costPrice = getItemCost(item);

    return total + (sellingPrice - costPrice) * quantity;
  }, 0);
}

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", async (req, res) => {
  try {
    const client = await getMongoClient();

    await client
      .db(process.env.MONGODB_DB || "batra_accessories")
      .command({ ping: 1 });

    res.json({
      status: "ok",
      message: "Batra backend and MongoDB are connected",
      database: "connected",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    res.status(500).json({
      status: "error",
      message: "MongoDB connection failed",
      details: error.message,
    });
  }
});

// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    const admin = getAdminUsers().find(
      (user) =>
        typeof user.email === "string" &&
        user.email.trim().toLowerCase() === email
    );

    if (
      !admin ||
      !admin.passwordHash ||
      !(await bcrypt.compare(password, admin.passwordHash))
    ) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        error: "Server authentication is not configured",
      });
    }

    const token = jwt.sign(
      {
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      token,
      email: admin.email,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

// ==========================================
// ADMIN DASHBOARD API
// ==========================================

app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const ordersCollection = await getOrdersCollection();

    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    const now = new Date();

    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalSalesCount = 0;
    let unitsSold = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let newOrders = 0;
    let paidPayments = 0;

    const bestSellerMap = new Map();

    for (const order of orders) {
      const status = getOrderStatus(order);
      const paid = isOrderPaid(order);
      const orderDate = getOrderDate(order);

      if (
        ["pending", "processing", "confirmed"].includes(status)
      ) {
        pendingOrders++;
      }

      if (
        ["completed", "delivered"].includes(status)
      ) {
        completedOrders++;
      }

      if (orderDate && orderDate >= sevenDaysAgo) {
        newOrders++;
      }

      if (paid) {
        totalRevenue += getOrderAmount(order);
        totalProfit += calculateOrderProfit(order);
        totalSalesCount++;
        paidPayments++;
      }

      if (paid) {
        const items = getOrderItems(order);

        for (const item of items) {
          const name = getItemName(item);
          const quantity = getItemQuantity(item);

          unitsSold += quantity;

          const previous = bestSellerMap.get(name) || {
            name,
            productName: name,
            unitsSold: 0,
            quantity: 0,
            totalSales: 0,
          };

          previous.unitsSold += quantity;
          previous.quantity += quantity;
          previous.totalSales += getItemPrice(item) * quantity;

          bestSellerMap.set(name, previous);
        }
      }
    }

    const bestSellers = Array.from(bestSellerMap.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 10).map((order) => ({
      ...order,
      _id: String(order._id),
      orderId: String(
        order.orderId ||
        order._id
      ),
      totalAmount: getOrderAmount(order),
      status: getOrderStatus(order),
      paymentStatus: getPaymentStatus(order),
    }));

    res.json({
      stats: {
        totalRevenue,
        totalProfit,
        totalSalesCount,
        unitsSold,
        pendingOrders,
        completedOrders,
        newOrders,
        paidPayments,
      },
      recentOrders,
      bestSellers,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      error: "Could not load dashboard data",
    });
  }
});

// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await getProductsCollection();

    const result = await products
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    console.error("Products error:", error);

    res.status(500).json({
      error: "Could not load products",
    });
  }
});

// ==========================================
// ADD PRODUCT
// ==========================================

app.post(
  "/api/products",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const products = await getProductsCollection();
      const product = { ...req.body };

      delete product._id;
      delete product.createdAt;

      if (req.file) {
        const image = await uploadImage(req.file.buffer);

        product.imageUrl = image.secure_url;
        product.imagePublicId = image.public_id;
      }

      product.createdAt = new Date();
      product.updatedAt = new Date();

      const result = await products.insertOne(product);

      res.status(201).json({
        ...product,
        _id: result.insertedId,
      });
    } catch (error) {
      console.error("Add product error:", error);

      res.status(500).json({
        error: "Could not add product",
      });
    }
  }
);

// ==========================================
// EDIT PRODUCT
// ==========================================

app.put(
  "/api/products/:id",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          error: "Invalid product ID",
        });
      }

      const products = await getProductsCollection();
      const product = { ...req.body };

      delete product._id;
      delete product.createdAt;

      if (req.file) {
        const image = await uploadImage(req.file.buffer);

        product.imageUrl = image.secure_url;
        product.imagePublicId = image.public_id;
      }

      product.updatedAt = new Date();

      const result = await products.updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $set: product,
        }
      );

      if (!result.matchedCount) {
        return res.status(404).json({
          error: "Product not found",
        });
      }

      res.json({
        message: "Product updated",
      });
    } catch (error) {
      console.error("Edit product error:", error);

      res.status(500).json({
        error: "Could not update product",
      });
    }
  }
);

// ==========================================
// DELETE PRODUCT
// ==========================================

app.delete(
  "/api/products/:id",
  requireAdmin,
  async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          error: "Invalid product ID",
        });
      }

      const products = await getProductsCollection();

      const result = await products.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      if (!result.deletedCount) {
        return res.status(404).json({
          error: "Product not found",
        });
      }

      res.json({
        message: "Product deleted",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        error: "Could not delete product",
      });
    }
  }
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(400).json({
    error: error.message || "Request failed",
  });
});

// ==========================================
// START BACKEND
// ==========================================

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Batra backend running at http://localhost:${PORT}`);
    console.log("Health check: http://localhost:" + PORT + "/api/health");
  });
}

export default app;

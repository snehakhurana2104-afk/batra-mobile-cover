
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

// Middleware
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// MongoDB connection
let clientPromise;

async function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env");
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

async function getProductsCollection() {
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || "batra_accessories");

  return db.collection("products");
}

// Admin accounts
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

// JWT authentication
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
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

// Login rate limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Try again later.",
  },
});

// Image upload setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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
        { folder: "batra-mobile-accessories" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
}

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const client = await getMongoClient();

    // Verify that MongoDB responds to a ping
    await client.db(
      process.env.MONGODB_DB || "batra_accessories"
    ).command({ ping: 1 });

    res.json({
      status: "ok",
      message: "Batra backend and MongoDB are connected",
      database: "connected",
    });
  } catch (error) {
    // Detailed error stays in the server terminal
    console.error("MongoDB health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "MongoDB connection failed",
      hint: "Check the server terminal for the exact error.",
    });
  }
});

// Admin login
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
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        error: "Server authentication is not configured",
      });
    }

    const token = jwt.sign(
      { email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
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

// Get all products
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

// Add product
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

// Edit product
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
        { _id: new ObjectId(req.params.id) },
        { $set: product }
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

// Delete product
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

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(400).json({
    error: error.message || "Request failed",
  });
});

// Start backend
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Batra backend running at http://localhost:${PORT}`);
    console.log("MongoDB connection will be checked at /api/health");
  });
}

export default app;

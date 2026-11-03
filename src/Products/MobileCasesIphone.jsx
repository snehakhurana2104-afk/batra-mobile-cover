
import React, { useEffect, useMemo, useState } from "react";
import "./MobileCasesIphone.css";
import paymentScanner from "../images/Payment Scanner.png";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const iphoneModels = [
  "iPhone 7 & iPhone 8",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "iPhone 17",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max",
  "iPhone Air",
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function getProductId(product) {
  return String(product._id || product.id || "");
}

function normalizeProduct(product) {
  return {
    ...product,
    id: getProductId(product),
    name: product.name || "",
    price: Number(product.price) || 0,
    image:
      product.imageUrl ||
      product.image ||
      "",
    imageName: product.imageName || "",
    category: product.category || "Mobile Cases",
    model: product.model || "",
    quantity: 1,
  };
}

export function MobileCasesIphone({
  isAdmin = false,
  adminToken = "",
  onBack = () => {},
  onAddToCart = () => {},
  onBuyNow,
}) {
  const [selectedModel, setSelectedModel] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Admin form states
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Checkout states
  const [checkoutPage, setCheckoutPage] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState(null);

  const [messageTimer, setMessageTimer] = useState(null);

  // API request helper
  const apiRequest = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(adminToken
          ? { Authorization: `Bearer ${adminToken}` }
          : {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.message ||
        `Request failed (${response.status})`
      );
    }

    return data;
  };

  // Load products from MongoDB
  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/api/products");

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : [];

      setAllProducts(productList.map(normalizeProduct));
    } catch (error) {
      console.error("Products loading error:", error);
      showMessage(error.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Refresh products when this page becomes visible again
    const handleFocus = () => loadProducts();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimer) {
        window.clearTimeout(messageTimer);
      }
    };
  }, [messageTimer]);

  function showMessage(text) {
    setMessage(text);

    if (messageTimer) {
      window.clearTimeout(messageTimer);
    }

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3500);

    setMessageTimer(timer);
  }

  function resetForm() {
    setProductName("");
    setProductPrice("");
    setProductImage(null);
    setImagePreview("");
    setImageName("");
    setEditingId(null);
  }

  // Customer cannot access admin form
  useEffect(() => {
    if (!isAdmin) {
      setShowProductForm(false);
      resetForm();
    }
  }, [isAdmin]);

  const filteredModels = useMemo(() => {
    const query = search.trim().toLowerCase();

    return iphoneModels.filter((model) =>
      model.toLowerCase().includes(query)
    );
  }, [search]);

  const products = allProducts.filter(
    (product) => product.model === selectedModel
  );

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSearch("");
    resetForm();
    setShowProductForm(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select image file
  const handleImageUpload = (event) => {
    if (!isAdmin) return;

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setProductImage(file);
    setImageName(file.name);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Add or update product in MongoDB and upload image to Cloudinary
  const saveProduct = async (event) => {
    event.preventDefault();

    if (!isAdmin || !adminToken) {
      showMessage("Admin login required. Please login again.");
      return;
    }

    if (!selectedModel) {
      showMessage("Please select an iPhone model first.");
      return;
    }

    if (
      !productName.trim() ||
      !productPrice ||
      Number(productPrice) <= 0
    ) {
      showMessage("Please enter a valid product name and price.");
      return;
    }

    if (!productImage && !editingId) {
      showMessage("Please upload a product image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", productName.trim());
      formData.append("price", String(Number(productPrice)));
      formData.append("category", "Mobile Cases");
      formData.append("model", selectedModel);

      if (productImage) {
        formData.append("image", productImage);
      }

      const path = editingId
        ? `/api/products/${encodeURIComponent(editingId)}`
        : "/api/products";

      await apiRequest(path, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      await loadProducts();

      showMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      setShowProductForm(false);
    } catch (error) {
      console.error("Product save error:", error);
      showMessage(error.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  // Edit product
  const editProduct = (product) => {
    if (!isAdmin) return;

    setEditingId(getProductId(product));
    setProductName(product.name);
    setProductPrice(String(product.price));
    setProductImage(null);
    setImagePreview(product.image || "");
    setImageName(product.imageName || "");
    setShowProductForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product from MongoDB
  const deleteProduct = async (productId) => {
    if (!isAdmin || !adminToken) {
      showMessage("Admin login required.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/api/products/${encodeURIComponent(productId)}`,
        { method: "DELETE" }
      );

      setAllProducts((current) =>
        current.filter(
          (product) => getProductId(product) !== String(productId)
        )
      );

      if (editingId === productId) {
        resetForm();
        setShowProductForm(false);
      }

      showMessage("Product deleted successfully.");
    } catch (error) {
      console.error("Product delete error:", error);
      showMessage(error.message || "Unable to delete product.");
    }
  };

  // Add to cart
  const handleAddToCart = (product) => {
    onAddToCart({
      ...product,
      id: getProductId(product),
      name: `${product.name} (${product.model})`,
      price: Number(product.price),
      quantity: 1,
      image: product.image,
    });

    showMessage("Product added to cart!");
  };

  // Buy now
  const handleBuyNow = (product) => {
    const selectedProduct = {
      ...product,
      id: getProductId(product),
      name: `${product.name} (${product.model})`,
      price: Number(product.price),
      image: product.image,
    };

    if (onBuyNow) {
      onBuyNow(selectedProduct);
      return;
    }

    setPurchaseProduct(selectedProduct);
    setCheckoutPage("options");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackToProducts = () => {
    setCheckoutPage("");
    setPurchaseProduct(null);
  };

  // CHECKOUT OPTIONS
  if (checkoutPage === "options" && purchaseProduct) {
    return (
      <main className="mc2-checkout-page">
        <button className="mc2-back-button" onClick={goBackToProducts}>
          ← Back to Products
        </button>

        <section className="mc2-checkout-panel">
          <span className="mc2-eyebrow">BATRA MOBILE ACCESSORIES</span>
          <h1>Purchase</h1>

          <img
            src={purchaseProduct.image}
            alt={purchaseProduct.name}
            className="mc2-checkout-product-image"
          />

          <h2>{purchaseProduct.name}</h2>
          <p>{purchaseProduct.model}</p>
          <h2>{formatPrice(purchaseProduct.price)}</h2>

          <p>Choose how you would like to continue.</p>

          <div className="mc2-checkout-actions">
            <button
              className="mc2-primary-button"
              onClick={() => setCheckoutPage("payment")}
            >
              Order
            </button>

            <button
              className="mc2-secondary-button"
              onClick={() => setCheckoutPage("enquiry")}
            >
              Enquiry
            </button>
          </div>
        </section>
      </main>
    );
  }

  // PAYMENT PAGE
  if (checkoutPage === "payment" && purchaseProduct) {
    return (
      <main className="mc2-checkout-page">
        <button
          className="mc2-back-button"
          onClick={() => setCheckoutPage("options")}
        >
          ← Back
        </button>

        <section className="mc2-checkout-panel">
          <span className="mc2-eyebrow">SECURE PAYMENT</span>
          <h1>Scan & Pay</h1>
          <h2>{formatPrice(purchaseProduct.price)}</h2>
          <p>{purchaseProduct.name}</p>

          <img
            src={paymentScanner}
            alt="Batra Payment QR Code"
            className="mc2-payment-image"
          />

          <p>Scan the QR code using your UPI app.</p>

          <button
            className="mc2-primary-button"
            onClick={() => setCheckoutPage("success")}
          >
            I Have Completed Payment
          </button>

          <p className="mc2-payment-note">
            Payment is not automatically verified by this website.
            Please confirm the payment in your UPI app.
          </p>
        </section>
      </main>
    );
  }

  // ENQUIRY PAGE
  if (checkoutPage === "enquiry" && purchaseProduct) {
    return (
      <main className="mc2-checkout-page">
        <section className="mc2-checkout-panel">
          <span className="mc2-eyebrow">BATRA MOBILE ACCESSORIES</span>
          <h1>Product Enquiry</h1>
          <h2>{purchaseProduct.name}</h2>
          <p>{purchaseProduct.model}</p>
          <h2>{formatPrice(purchaseProduct.price)}</h2>

          <p>Thank you for your enquiry!</p>
          <p>
            Please contact our shop for product availability and
            delivery details.
          </p>

          <button
            className="mc2-primary-button"
            onClick={goBackToProducts}
          >
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  // ORDER CONFIRMATION
  if (checkoutPage === "success" && purchaseProduct) {
    return (
      <main className="mc2-checkout-page">
        <section className="mc2-checkout-panel">
          <span className="mc2-eyebrow">BATRA MOBILE ACCESSORIES</span>
          <h1>Order Confirmation</h1>
          <h2>{purchaseProduct.name}</h2>
          <p>{purchaseProduct.model}</p>
          <h2>{formatPrice(purchaseProduct.price)}</h2>

          <p>Please confirm payment and delivery with the shop.</p>

          <button
            className="mc2-primary-button"
            onClick={goBackToProducts}
          >
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="mc2-page">
      {message && (
        <div className="mc2-toast" role="status">
          {message}
        </div>
      )}

      {/* BREADCRUMB */}
      <div className="mc2-breadcrumb">
        <button onClick={onBack}>Home</button>
        <span>/</span>
        <span>Mobile Cases</span>

        {selectedModel && (
          <>
            <span>/</span>
            <strong>{selectedModel}</strong>
          </>
        )}
      </div>

      {/* MODEL SELECTION */}
      {!selectedModel ? (
        <>
          <div className="mc2-heading">
            <span className="mc2-eyebrow">BATRA MOBILE ACCESSORIES</span>
            <h1>Apple iPhone Models</h1>
            <p>
              Select your exact mobile model to explore available products.
            </p>
          </div>

          <div className="mc2-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search Apple models..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="mc2-model-grid">
            {filteredModels.map((model) => (
              <button
                type="button"
                key={model}
                className="mc2-model-card"
                onClick={() => handleModelSelect(model)}
              >
                <span className="mc2-model-icon">▣</span>
                <span>{model}</span>
                <span className="mc2-arrow">›</span>
              </button>
            ))}

            {filteredModels.length === 0 && (
              <div className="mc2-no-results">
                No matching iPhone models found.
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* SELECTED MODEL HEADER */}
          <div className="mc2-product-heading">
            <button
              type="button"
              className="mc2-back-button"
              onClick={() => {
                setSelectedModel("");
                resetForm();
                setShowProductForm(false);
              }}
            >
              ← All iPhone Models
            </button>

            <span className="mc2-eyebrow">BATRA MOBILE ACCESSORIES</span>
            <h1>{selectedModel} Covers</h1>
            <p>Explore the available collection for your iPhone.</p>
          </div>

          {/* ADMIN PRODUCT MANAGEMENT */}
          {isAdmin && (
            <section className="mc2-form-section">
              <div className="mc2-form-heading">
                <div>
                  <span className="mc2-eyebrow">ADMIN PANEL</span>
                  <h2>
                    {editingId ? "Edit Product" : "Product Management"}
                  </h2>
                  <p>
                    Add a new product or update an existing product.
                  </p>
                </div>

                <button
                  type="button"
                  className="mc2-primary-button"
                  onClick={() => {
                    if (showProductForm) {
                      resetForm();
                      setShowProductForm(false);
                    } else {
                      resetForm();
                      setShowProductForm(true);
                    }
                  }}
                >
                  {showProductForm ? "Close Form" : "+ Add Product"}
                </button>
              </div>

              {showProductForm && (
                <form className="mc2-form" onSubmit={saveProduct}>
                  <div className="mc2-form-grid">
                    <label className="mc2-form-group">
                      <span>Product Name</span>
                      <input
                        type="text"
                        value={productName}
                        onChange={(event) =>
                          setProductName(event.target.value)
                        }
                        placeholder="Enter product name"
                        required
                      />
                    </label>

                    <label className="mc2-form-group">
                      <span>Product Price (₹)</span>
                      <input
                        type="number"
                        min="1"
                        value={productPrice}
                        onChange={(event) =>
                          setProductPrice(event.target.value)
                        }
                        placeholder="Enter product price"
                        required
                      />
                    </label>

                    <label className="mc2-form-group mc2-form-full">
                      <span>Upload Product Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required={!editingId}
                      />
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="mc2-image-preview">
                      <img src={imagePreview} alt="Product preview" />
                      <span>{imageName || "Product image"}</span>
                    </div>
                  )}

                  <div className="mc2-form-actions">
                    <button
                      type="submit"
                      className="mc2-primary-button"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Product"
                        : "Save Product"}
                    </button>

                    <button
                      type="button"
                      className="mc2-secondary-button"
                      disabled={saving}
                      onClick={() => {
                        resetForm();
                        setShowProductForm(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* PRODUCT COLLECTION */}
          <div className="mc2-product-toolbar">
            <div>
              <span className="mc2-eyebrow">OUR COLLECTION</span>
              <h2>{selectedModel} Collection</h2>
              {isAdmin && <p>{products.length} products added</p>}
            </div>
          </div>

          {loading ? (
            <div className="mc2-no-results">
              Loading products...
            </div>
          ) : products.length > 0 ? (
            <div className="mc2-product-grid">
              {products.map((product) => (
                <article
                  className="mc2-product-card"
                  key={getProductId(product)}
                >
                  <div className="mc2-product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mc2-product-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="mc2-product-info">
                    <span className="mc2-product-model">
                      {selectedModel}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="mc2-price">
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                  </div>

                  <div className="mc2-product-actions">
                    <button
                      type="button"
                      className="mc2-cart-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      className="mc2-buy-button"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="mc2-admin-actions">
                      <button
                        type="button"
                        onClick={() => editProduct(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="mc2-delete-button"
                        onClick={() => deleteProduct(getProductId(product))}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mc2-no-results">
              <span className="mc2-empty-icon">▣</span>
              <h3>No products available</h3>
              <p>
                {isAdmin
                  ? "Use Add Product to upload the first product for this model."
                  : "Products for this model will be available soon."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MobileCasesIphone;


import React, { useEffect, useMemo, useState } from "react";
import "./MobileCasesIphone.css";
import paymentScanner from "../images/Payment Scanner.png";

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

const STORAGE_KEY = "batra_iphone_model_products_v1";

const readProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

export function MobileCasesIphone({
  isAdmin = false,
  onBack = () => {},
  onAddToCart = () => {},
  onBuyNow,
}) {
  const [selectedModel, setSelectedModel] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [allProducts, setAllProducts] = useState(readProducts);

  // Admin product form states
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Checkout states
  const [checkoutPage, setCheckoutPage] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState(null);

  // Save products in browser storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
    } catch {
      setMessage("Storage full. Please upload a smaller image.");
    }
  }, [allProducts]);

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

  const products = allProducts[selectedModel] || [];

  function showMessage(text) {
    setMessage(text);

    window.clearTimeout(window.batraIphoneMessageTimer);

    window.batraIphoneMessageTimer = window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function resetForm() {
    setProductName("");
    setProductPrice("");
    setProductImage("");
    setImageName("");
    setEditingId(null);
  }

  // Select iPhone model
  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSearch("");
    resetForm();
    setShowProductForm(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Upload and resize product image
  const handleImageUpload = (event) => {
    if (!isAdmin) return;

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 1000;

        let width = image.width;
        let height = image.height;

        if (width > maxSize || height > maxSize) {
          const scale = Math.min(
            maxSize / width,
            maxSize / height
          );

          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          showMessage("Unable to process this image.");
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        const resizedImage = canvas.toDataURL(
          "image/jpeg",
          0.75
        );

        setProductImage(resizedImage);
        setImageName(file.name);
      };

      image.onerror = () => {
        showMessage("Unable to load this image.");
      };

      image.src = loadEvent.target.result;
    };

    reader.onerror = () => {
      showMessage("Image upload failed.");
    };

    reader.readAsDataURL(file);
  };

  // Add or update product - Admin only
  const saveProduct = (event) => {
    event.preventDefault();

    if (!isAdmin) {
      showMessage("Admin access required.");
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

    const existingProducts = allProducts[selectedModel] || [];

    let updatedProducts;

    if (editingId) {
      updatedProducts = existingProducts.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: productName.trim(),
              price: Number(productPrice),
              image: productImage || product.image,
              imageName: imageName || product.imageName,
            }
          : product
      );

      showMessage("Product updated successfully!");
    } else {
      const newProduct = {
        id: `iphone-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        name: productName.trim(),
        price: Number(productPrice),
        image: productImage,
        imageName,
        category: "Mobile Cases",
        model: selectedModel,
        quantity: 1,
      };

      updatedProducts = [...existingProducts, newProduct];

      showMessage("New product added successfully!");
    }

    setAllProducts((current) => ({
      ...current,
      [selectedModel]: updatedProducts,
    }));

    resetForm();
    setShowProductForm(false);
  };

  // Edit product - Admin only
  const editProduct = (product) => {
    if (!isAdmin) return;

    setEditingId(product.id);
    setProductName(product.name);
    setProductPrice(String(product.price));
    setProductImage(product.image);
    setImageName(product.imageName || "");
    setShowProductForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product - Admin only
  const deleteProduct = (productId) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setAllProducts((current) => ({
      ...current,
      [selectedModel]: (current[selectedModel] || []).filter(
        (product) => product.id !== productId
      ),
    }));

    if (editingId === productId) {
      resetForm();
      setShowProductForm(false);
    }

    showMessage("Product deleted successfully.");
  };

  // Add to cart - Customer and Admin
  const handleAddToCart = (product) => {
    onAddToCart({
      ...product,
      id: product.id,
      name: `${product.name} (${product.model})`,
      price: Number(product.price),
      quantity: 1,
    });

    showMessage("Product added to cart!");
  };

  // Buy now
  const handleBuyNow = (product) => {
    if (onBuyNow) {
      onBuyNow({
        ...product,
        name: `${product.name} (${product.model})`,
        price: Number(product.price),
      });

      return;
    }

    setPurchaseProduct(product);
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
        <button
          className="mc2-back-button"
          onClick={goBackToProducts}
        >
          ← Back to Products
        </button>

        <section className="mc2-checkout-panel">
          <span className="mc2-eyebrow">
            BATRA MOBILE ACCESSORIES
          </span>

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
          <span className="mc2-eyebrow">
            BATRA MOBILE ACCESSORIES
          </span>

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
          <span className="mc2-eyebrow">
            BATRA MOBILE ACCESSORIES
          </span>

          <h1>Order Confirmation</h1>
          <h2>{purchaseProduct.name}</h2>
          <p>{purchaseProduct.model}</p>
          <h2>{formatPrice(purchaseProduct.price)}</h2>

          <p>
            Please confirm payment and delivery with the shop.
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
            <span className="mc2-eyebrow">
              BATRA MOBILE ACCESSORIES
            </span>

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

            <span className="mc2-eyebrow">
              BATRA MOBILE ACCESSORIES
            </span>

            <h1>{selectedModel} Covers</h1>

            <p>
              Explore the available collection for your iPhone.
            </p>
          </div>

          {/* ADMIN PRODUCT MANAGEMENT - OWNER ONLY */}
          {isAdmin && (
            <section className="mc2-form-section">
              <div className="mc2-form-heading">
                <div>
                  <span className="mc2-eyebrow">
                    ADMIN PANEL
                  </span>

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
                  {showProductForm
                    ? "Close Form"
                    : "+ Add Product"}
                </button>
              </div>

              {showProductForm && (
                <form
                  className="mc2-form"
                  onSubmit={saveProduct}
                >
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
                      />
                    </label>
                  </div>

                  {productImage && (
                    <div className="mc2-image-preview">
                      <img
                        src={productImage}
                        alt="Product preview"
                      />

                      <span>
                        {imageName || "Selected product image"}
                      </span>
                    </div>
                  )}

                  <div className="mc2-form-actions">
                    <button
                      type="submit"
                      className="mc2-primary-button"
                    >
                      {editingId
                        ? "Update Product"
                        : "Save Product"}
                    </button>

                    <button
                      type="button"
                      className="mc2-secondary-button"
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

          {/* PRODUCT COLLECTION - BOTH OWNER AND CUSTOMER */}
          <div className="mc2-product-toolbar">
            <div>
              <span className="mc2-eyebrow">
                OUR COLLECTION
              </span>

              <h2>{selectedModel} Collection</h2>

              {isAdmin && (
                <p>{products.length} products added</p>
              )}
            </div>
          </div>

          {products.length > 0 ? (
            <div className="mc2-product-grid">
              {products.map((product) => (
                <article
                  className="mc2-product-card"
                  key={product.id}
                >
                  {/* PRODUCT IMAGE - VISIBLE TO EVERYONE */}
                  <div className="mc2-product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mc2-product-image"
                      loading="lazy"
                    />
                  </div>

                  {/* PRODUCT NAME AND PRICE - VISIBLE TO EVERYONE */}
                  <div className="mc2-product-info">
                    <span className="mc2-product-model">
                      {selectedModel}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="mc2-price">
                      <strong>
                        {formatPrice(product.price)}
                      </strong>
                    </div>
                  </div>

                  {/* SHOPPING OPTIONS - VISIBLE TO EVERYONE */}
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

                  {/* EDIT AND DELETE - OWNER ONLY */}
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
                        onClick={() => deleteProduct(product.id)}
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

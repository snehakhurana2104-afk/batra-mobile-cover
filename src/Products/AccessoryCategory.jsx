import React, { useEffect, useState } from "react";
import "./AccessoryCategory.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

export default function AccessoryCategory({
  category,
  title,
  subtitle = "Explore our collection and find the right accessory for you.",
  icon = "✦",
  isAdmin = false,
  adminToken = "",
  onBack = () => {},
  onAddToCart = () => {},
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageName, setImageName] = useState("");

  const apiRequest = async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data.message || data.error || `Request failed (${response.status})`
      );
    }
    return data;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/products");
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(
        list
          .filter((product) => product.category === category)
          .map((product) => ({
            ...product,
            id: String(product._id || product.id || ""),
            image: product.imageUrl || product.image || product.image_url || "",
            price: Number(product.price) || 0,
          }))
      );
      setMessage("");
    } catch (error) {
      console.error("Load products error:", error);
      setMessage(error.message || "Products load nahi hue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // Reload when the category changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (!isAdmin) {
      setShowForm(false);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function resetForm() {
    setName("");
    setPrice("");
    setImage(null);
    setPreview("");
    setImageName("");
    setEditingId("");
  }

  function notify(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("Image size 5 MB se kam honi chahiye.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setImageName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  async function saveProduct(event) {
    event.preventDefault();

    if (!isAdmin || !adminToken) {
      notify("Admin login required. Please login again.");
      return;
    }

    if (!name.trim() || !price || Number(price) <= 0) {
      notify("Product name aur valid price enter karein.");
      return;
    }

    if (!editingId && !image) {
      notify("Product image upload karein.");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", String(Number(price)));
      formData.append("category", category);
      if (image) formData.append("image", image);

      const path = editingId
        ? `/api/products/${encodeURIComponent(editingId)}`
        : "/api/products";

      await apiRequest(path, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const wasEditing = Boolean(editingId);
      await loadProducts();
      resetForm();
      setShowForm(false);
      notify(wasEditing ? "Product updated successfully!" : "Product added successfully!");
    } catch (error) {
      console.error("Save product error:", error);
      notify(error.message || "Product save nahi hua.");
    } finally {
      setSaving(false);
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setName(product.name || "");
    setPrice(String(product.price || ""));
    setImage(null);
    setPreview(product.image || "");
    setImageName("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    if (!isAdmin || !adminToken) {
      notify("Admin login required.");
      return;
    }

    if (!window.confirm("Kya aap ye product delete karna chahte hain?")) return;

    try {
      await apiRequest(`/api/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setProducts((current) => current.filter((product) => product.id !== id));
      notify("Product deleted successfully!");
    } catch (error) {
      console.error("Delete product error:", error);
      notify(error.message || "Product delete nahi hua.");
    }
  }

  const pageTitle = title || category || "Accessories";

  return (
    <main className="mc2-page">
      {message && <div className="mc2-toast" role="status">{message}</div>}

      <div className="mc2-breadcrumb">
        <button type="button" onClick={onBack}>Home</button>
        <span>/</span>
        <strong>{category}</strong>
      </div>

      <section className="mc2-product-heading">
        <span className="mc2-eyebrow">BATRA MOBILE ACCESSORIES</span>
        <h1>{pageTitle}</h1>
        <p>{subtitle}</p>
      </section>

      {isAdmin && (
        <section className="mc2-form-section">
          <div className="mc2-form-heading">
            <div>
              <span className="mc2-eyebrow">ADMIN PANEL</span>
              <h2>{editingId ? "Edit Product" : "Product Management"}</h2>
              <p>Add, update or delete products in this category.</p>
            </div>
            <button
              type="button"
              className="mc2-primary-button"
              onClick={() => {
                if (showForm) {
                  resetForm();
                  setShowForm(false);
                } else {
                  resetForm();
                  setShowForm(true);
                }
              }}
            >
              {showForm ? "Close Form" : "+ Add Product"}
            </button>
          </div>

          {showForm && (
            <form className="mc2-form" onSubmit={saveProduct}>
              <div className="mc2-form-grid">
                <label className="mc2-form-group">
                  <span>Product Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label className="mc2-form-group">
                  <span>Product Price (₹)</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </label>

                <label className="mc2-form-group mc2-form-full">
                  <span>Upload Product Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    required={!editingId}
                  />
                </label>
              </div>

              {preview && (
                <div className="mc2-image-preview">
                  <img src={preview} alt="Product preview" />
                  <span>{imageName || "Current product image"}</span>
                </div>
              )}

              <div className="mc2-form-actions">
                <button
                  type="submit"
                  className="mc2-primary-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingId ? "Update Product" : "Save Product"}
                </button>
                <button
                  type="button"
                  className="mc2-secondary-button"
                  disabled={saving}
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <div className="mc2-product-toolbar">
        <div>
          <span className="mc2-eyebrow">OUR COLLECTION {icon}</span>
          <h2>{pageTitle}</h2>
          {isAdmin && <p>{products.length} products added</p>}
        </div>
      </div>

      {loading ? (
        <div className="mc2-no-results">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="mc2-no-results">
          <h3>No products available</h3>
          <p>
            {isAdmin
              ? "Add Product par click karke pehla product upload karein."
              : "Products will be available soon."}
          </p>
        </div>
      ) : (
        <div className="mc2-product-grid">
          {products.map((product) => (
            <article className="mc2-product-card" key={product.id}>
              <div className="mc2-product-image-wrap">
                {product.image ? (
                  <img
                    className="mc2-product-image"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="mc2-no-results">No image</div>
                )}
              </div>

              <div className="mc2-product-info">
                <span className="mc2-product-model">{category}</span>
                <h3>{product.name}</h3>
                <div className="mc2-price">
                  <strong>{formatPrice(product.price)}</strong>
                </div>
              </div>

              <div className="mc2-product-actions">
                <button
                  type="button"
                  className="mc2-cart-button"
                  onClick={() => onAddToCart({ ...product, quantity: 1 })}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="mc2-buy-button"
                  onClick={() => onAddToCart({ ...product, quantity: 1 })}
                >
                  Add Item
                </button>
              </div>

              {isAdmin && (
                <div className="mc2-admin-actions">
                  <button type="button" onClick={() => editProduct(product)}>Edit</button>
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
      )}
    </main>
  );
}

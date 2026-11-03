

import React, { useMemo, useState } from "react";

import "./App.css";

import batraLogo from "./images/Batra Logo.jpeg";



import * as MobileCasesModule from "./Products/MobileCases.jsx";

import * as MobileCasesIphoneModule from "./Products/MobileCasesIphone.jsx";

import * as ChargersCablesModule from "./Products/ChargersCables.jsx";

import * as EarphonesHeadphonesModule from "./Products/EarphonesHeadphones.jsx";



import "./Products/MobileCasesIphone.css";



const getComponent = (module, preferredName) =>

  module.default ||

  module[preferredName] ||

  Object.values(module).find((value) => typeof value === "function");



const MobileCases = getComponent(MobileCasesModule, "MobileCases");



const MobileCasesIphone = getComponent(

  MobileCasesIphoneModule,

  "MobileCasesIphone"

);



const ChargersCables = getComponent(

  ChargersCablesModule,

  "ChargersCables"

);



const EarphonesHeadphones = getComponent(

  EarphonesHeadphonesModule,

  "EarphonesHeadphones"

);



// Set VITE_API_URL in your Vercel environment variables

// Example: https://your-backend-domain.com

const API_BASE_URL = (

  import.meta.env.VITE_API_URL || ""

).replace(/\/$/, "");



const categories = [

  {

    name: "Mobile Cases",

    subtitle: "Protection & Style",

    icon: "▣",

    color: "purple",

  },

  {

    name: "Chargers & Cables",

    subtitle: "Power Up Your Device",

    icon: "ϟ",

    color: "blue",

  },

  {

    name: "Earphones & Headphones",

    subtitle: "Crystal Clear Sound",

    icon: "♫",

    color: "green",

  },

  {

    name: "Smart Watch",

    subtitle: "Stay Fit, Stay Smart",

    icon: "⌚",

    color: "orange",

  },

  {

    name: "Screen Guards",

    subtitle: "Keep It Safe",

    icon: "▯",

    color: "pink",

  },

  {

    name: "Other Accessories",

    subtitle: "More for Your Mobile",

    icon: "◉",

    color: "lavender",

  },

];



const products = [

  {

    id: 1,

    name: "Clear Back Case",

    category: "Mobile Cases",

    price: 299,

    oldPrice: 399,

    discount: "25% OFF",

    rating: 4.8,

    reviews: 124,

    image:

      "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=700&q=85",

  },

  {

    id: 2,

    name: "Wireless Earbuds",

    category: "Earphones & Headphones",

    price: 1999,

    oldPrice: 2499,

    discount: "20% OFF",

    rating: 4.7,

    reviews: 98,

    image:

      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=85",

  },

  {

    id: 3,

    name: "Smart Watch",

    category: "Smart Watch",

    price: 1699,

    oldPrice: 1999,

    discount: "15% OFF",

    rating: 4.6,

    reviews: 76,

    image:

      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",

  },

  {

    id: 4,

    name: "Fast Charging Cable",

    category: "Chargers & Cables",

    price: 349,

    oldPrice: 449,

    discount: "New",

    rating: 4.5,

    reviews: 52,

    image:

      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=700&q=85",

  },

  {

    id: 5,

    name: "Tempered Glass",

    category: "Screen Guards",

    price: 249,

    oldPrice: 359,

    discount: "30% OFF",

    rating: 4.7,

    reviews: 91,

    image:

      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85",

  },

  {

    id: 6,

    name: "Mobile Holder",

    category: "Other Accessories",

    price: 399,

    oldPrice: 499,

    discount: "20% OFF",

    rating: 4.4,

    reviews: 67,

    image:

      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=85",

  },

];



const formatPrice = (price) =>

  new Intl.NumberFormat("en-IN", {

    style: "currency",

    currency: "INR",

    maximumFractionDigits: 0,

  }).format(Number(price) || 0);



function App() {

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");



  const [cart, setCart] = useState([]);

  const [favorites, setFavorites] = useState([]);



  const [showCart, setShowCart] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);



  const [activePage, setActivePage] = useState("home");



  // ADMIN LOGIN STATES

  const [isAdmin, setIsAdmin] = useState(false);

  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");

  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [loginError, setLoginError] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);



  const [adminToken, setAdminToken] = useState(

    sessionStorage.getItem("batraAdminToken") || ""

  );



  const filteredProducts = useMemo(() => {

    const query = search.trim().toLowerCase();



    return products.filter((product) => {

      const matchesSearch =

        !query ||

        product.name.toLowerCase().includes(query) ||

        product.category.toLowerCase().includes(query);



      const matchesCategory =

        selectedCategory === "All" ||

        product.category === selectedCategory;



      return matchesSearch && matchesCategory;

    });

  }, [search, selectedCategory]);



  const cartCount = cart.reduce(

    (total, item) => total + item.quantity,

    0

  );



  const cartTotal = cart.reduce(

    (total, item) => total + item.price * item.quantity,

    0

  );



  const isHomePage = activePage === "home";



  const scrollToSection = (id) => {

    window.setTimeout(() => {

      document.getElementById(id)?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }, 60);

  };



  const goToPage = (page) => {

    setActivePage(page);

    setMobileMenu(false);

    setShowCart(false);

    window.scrollTo({ top: 0, behavior: "smooth" });

  };



  // ADMIN LOGIN

  const handleAdminLogin = async (event) => {

    event.preventDefault();



    setLoginError("");

    setLoginLoading(true);



    try {

      const response = await fetch(

        `${API_BASE_URL}/api/admin/login`,

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            email: adminEmail.trim().toLowerCase(),

            password: adminPassword,

          }),

        }

      );



      const data = await response.json().catch(() => ({}));



      if (!response.ok || !data.token) {

        setLoginError(

          data.message || "Invalid email or password."

        );

        return;

      }



      sessionStorage.setItem("batraAdminToken", data.token);



      setAdminToken(data.token);

      setIsAdmin(true);



      setShowAdminLogin(false);

      setAdminEmail("");

      setAdminPassword("");

      setLoginError("");



      alert("Owner login successful!");



      goToPage("home");

    } catch (error) {

      console.error("Admin login error:", error);



      setLoginError(

        "Unable to connect to the server. Please try again."

      );

    } finally {

      setLoginLoading(false);

    }

  };



  // ADMIN LOGOUT

  const handleAdminLogout = () => {

    sessionStorage.removeItem("batraAdminToken");



    setAdminToken("");

    setIsAdmin(false);



    setShowAdminLogin(false);

    setAdminEmail("");

    setAdminPassword("");



    goToPage("home");



    alert("You have been logged out.");

  };



  const selectCategory = (category) => {

    if (category === "Mobile Cases") {

      goToPage("mobile-cases");

      return;

    }



    if (category === "Chargers & Cables") {

      goToPage("chargers-cables");

      return;

    }



    if (category === "Earphones & Headphones") {

      goToPage("earphones-headphones");

      return;

    }



    setActivePage("home");

    setSelectedCategory(category);

    setMobileMenu(false);

    setShowCart(false);



    scrollToSection("products");

  };



  const showAllProducts = () => {

    setActivePage("home");

    setSelectedCategory("All");

    setSearch("");

    setMobileMenu(false);

    setShowCart(false);



    scrollToSection("products");

  };



  const addToCart = (product) => {

    setCart((currentCart) => {

      const existing = currentCart.find(

        (item) => item.id === product.id

      );



      if (existing) {

        return currentCart.map((item) =>

          item.id === product.id

            ? {

                ...item,

                quantity: item.quantity + 1,

              }

            : item

        );

      }



      return [

        ...currentCart,

        {

          ...product,

          quantity: 1,

        },

      ];

    });

  };



  const changeQuantity = (productId, amount) => {

    setCart((currentCart) =>

      currentCart

        .map((item) =>

          item.id === productId

            ? {

                ...item,

                quantity: item.quantity + amount,

              }

            : item

        )

        .filter((item) => item.quantity > 0)

    );

  };



  const toggleFavorite = (productId) => {

    setFavorites((current) =>

      current.includes(productId)

        ? current.filter((id) => id !== productId)

        : [...current, productId]

    );

  };



  const orderOnWhatsApp = () => {

    if (cart.length === 0) return;



    const orderLines = cart

      .map(

        (item) =>

          `${item.name} x ${item.quantity} = ${formatPrice(

            item.price * item.quantity

          )}`

      )

      .join("\n");



    const message =

      `Hello Batra Mobile Accessories! I would like to order:\n\n${orderLines}` +

      `\n\nTotal: ${formatPrice(cartTotal)}` +

      "\n\nPlease confirm product availability and delivery details.";



    // Replace this with the real shop WhatsApp number.

    const whatsappNumber = "91XXXXXXXXXX";



    window.open(

      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,

      "_blank",

      "noopener,noreferrer"

    );

  };



  const goHomeAndScroll = (id) => {

    goToPage("home");

    scrollToSection(id);

  };



  return (

    <div className="app">

      {/* ANNOUNCEMENT BAR */}

      <div className="announcement">

        <span>✦ Latest Mobile Accessories</span>

        <span className="announcement-divider">|</span>

        <span>Best Quality</span>

        <span className="announcement-divider">|</span>

        <span>Shop Smart. Stay Connected.</span>

      </div>



      {/* HEADER */}

      <header className="header" id="top">

        <button

          className="brand"

          onClick={() => goToPage("home")}

          aria-label="Batra home"

        >

          <img

            className="brand-logo"

            src={batraLogo}

            alt="Batra Mobile Accessories logo"

          />

        </button>



        <button

          className="menu-toggle"

          onClick={() => setMobileMenu((open) => !open)}

          aria-label="Toggle navigation"

          aria-expanded={mobileMenu}

        >

          ☰

        </button>



        <nav className={`nav ${mobileMenu ? "nav-open" : ""}`}>

          <button

            className={`nav-link ${isHomePage ? "active" : ""}`}

            onClick={() => goToPage("home")}

          >

            Home

          </button>



          <button className="nav-link" onClick={showAllProducts}>

            Shop

          </button>



          <button

            className={`nav-link ${

              activePage === "mobile-cases" ? "active" : ""

            }`}

            onClick={() => selectCategory("Mobile Cases")}

          >

            Mobile Cases

          </button>



          <button

            className={`nav-link ${

              activePage === "mobile-cases-iphone" ? "active" : ""

            }`}

            onClick={() => goToPage("mobile-cases-iphone")}

          >

            iPhone Cases

          </button>



          <button

            className={`nav-link ${

              activePage === "chargers-cables" ? "active" : ""

            }`}

            onClick={() => selectCategory("Chargers & Cables")}

          >

            Chargers & Cables

          </button>



          <button

            className={`nav-link ${

              activePage === "earphones-headphones" ? "active" : ""

            }`}

            onClick={() => selectCategory("Earphones & Headphones")}

          >

            Earphones

          </button>



          <button

            className="nav-link"

            onClick={() => goHomeAndScroll("categories")}

          >

            Categories

          </button>



          <button

            className="nav-link"

            onClick={() => goHomeAndScroll("about")}

          >

            About Us

          </button>



          <button

            className="nav-link"

            onClick={() => goHomeAndScroll("contact")}

          >

            Contact

          </button>

        </nav>



        <div className="header-actions">

          <label className="search-box">

            <span className="search-icon">⌕</span>



            <input

              type="search"

              placeholder="Search products..."

              value={search}

              onFocus={() => {

                if (!isHomePage) goToPage("home");

              }}

              onChange={(event) => {

                setSearch(event.target.value);

                setActivePage("home");

                setSelectedCategory("All");

              }}

              aria-label="Search products"

            />



            {search && (

              <button

                className="clear-search"

                onClick={() => setSearch("")}

                aria-label="Clear search"

              >

                ×

              </button>

            )}

          </label>



          <button

            className="icon-button cart-button"

            onClick={() => setShowCart((open) => !open)}

            aria-label="Open cart"

            aria-expanded={showCart}

          >

            <span className="cart-icon">🛒</span>

            <span className="cart-label">Cart</span>

            <span className="cart-count">{cartCount}</span>

          </button>

        </div>

      </header>



      {/* CART PANEL */}

      {showCart && (

        <aside className="cart-panel">

          <div className="cart-panel-heading">

            <h3>Your Cart ({cartCount})</h3>



            <button

              className="close-button"

              onClick={() => setShowCart(false)}

              aria-label="Close cart"

            >

              ×

            </button>

          </div>



          {cart.length === 0 ? (

            <p className="empty-cart">

              Your cart is empty. Explore our products!

            </p>

          ) : (

            <>

              <div className="cart-items">

                {cart.map((item) => (

                  <div className="cart-item" key={item.id}>

                    <img src={item.image} alt={item.name} />



                    <div className="cart-item-info">

                      <strong>{item.name}</strong>

                      <span>{formatPrice(item.price)}</span>



                      <div className="quantity-control">

                        <button

                          onClick={() =>

                            changeQuantity(item.id, -1)

                          }

                          aria-label={`Decrease ${item.name} quantity`}

                        >

                          −

                        </button>



                        <span>{item.quantity}</span>



                        <button

                          onClick={() =>

                            changeQuantity(item.id, 1)

                          }

                          aria-label={`Increase ${item.name} quantity`}

                        >

                          +

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>



              <div className="cart-total">

                <span>Total</span>

                <strong>{formatPrice(cartTotal)}</strong>

              </div>



              <button

                className="primary-button checkout-button"

                onClick={orderOnWhatsApp}

              >

                Order on WhatsApp →

              </button>



              <p className="cart-note">

                Confirm product availability and delivery with the shop.

              </p>

            </>

          )}

        </aside>

      )}



      {/* PAGE CONTENT */}

      {activePage === "mobile-cases-iphone" ? (

        MobileCasesIphone ? (

          <MobileCasesIphone

            isAdmin={isAdmin}

            adminToken={adminToken}

            onBack={() => goToPage("mobile-cases")}

            onAddToCart={addToCart}

          />

        ) : (

          <p>MobileCasesIphone component export is missing.</p>

        )

      ) : activePage === "mobile-cases" ? (

        MobileCases ? (

          <MobileCases

            onBack={() => goToPage("home")}

            onOpenIphone={() =>

              goToPage("mobile-cases-iphone")

            }

          />

        ) : (

          <p>Mobile Cases component export is missing.</p>

        )

      ) : activePage === "chargers-cables" ? (

        ChargersCables ? (

          <ChargersCables
            isAdmin={isAdmin}
            adminToken={adminToken}
            onBack={() => goToPage("home")}
            onAddToCart={addToCart}
          />

        ) : (

          <p>Chargers &amp; Cables component export is missing.</p>

        )

      ) : activePage === "earphones-headphones" ? (

        EarphonesHeadphones ? (

          <EarphonesHeadphones
            isAdmin={isAdmin}
            adminToken={adminToken}
            onBack={() => goToPage("home")}
            onAddToCart={addToCart}
          />

        ) : (

          <p>Earphones &amp; Headphones component export is missing.</p>

        )

      ) : (

        <main>

          {/* HERO SECTION */}

          <section className="hero" id="home">

            <div className="hero-content">

              <div className="eyebrow">

                <span className="eyebrow-line" />

                PREMIUM MOBILE ACCESSORIES

              </div>



              <h1>

                Style Your Phone.

                <br />

                <span>Upgrade Your Life.</span>

              </h1>



              <p className="hero-description">

                Discover mobile covers and everyday accessories that bring

                together protection, quality and personal style.

              </p>



              <div className="hero-buttons">

                <button

                  className="primary-button"

                  onClick={showAllProducts}

                >

                  Explore Products <span>→</span>

                </button>



                <button

                  className="secondary-button"

                  onClick={() => scrollToSection("categories")}

                >

                  Browse Categories

                </button>

              </div>



              <div className="hero-note">

                <span>✓</span>

                Find accessories for your everyday needs

              </div>

            </div>



            <div

              className="hero-visual"

              aria-label="Featured mobile accessories"

            >

              <div className="hero-glow" />

              <div className="hero-orbit orbit-one" />

              <div className="hero-orbit orbit-two" />



              <div className="hero-product hero-phone">

                <img

                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85"

                  alt="Smartphone"

                />

              </div>



              <div className="hero-product hero-earbuds">

                <img

                  src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=85"

                  alt="Wireless earbuds"

                />

              </div>



              <div className="hero-product hero-watch">

                <img

                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85"

                  alt="Smart watch"

                />

              </div>



              <div className="floating-note">

                <strong>Everyday</strong>

                <strong>Essentials</strong>

                <span className="note-underline" />

              </div>



              <div className="hero-caption">

                <span className="caption-dot" />

                Accessories for your style

              </div>

            </div>



            <div className="trust-row">

              <div className="trust-item">

                <span className="trust-icon">◇</span>

                <div>

                  <strong>Quality Products</strong>

                  <span>Selected for everyday use</span>

                </div>

              </div>



              <div className="trust-item">

                <span className="trust-icon">♡</span>

                <div>

                  <strong>Style &amp; Protection</strong>

                  <span>Made for your device</span>

                </div>

              </div>



              <div className="trust-item">

                <span className="trust-icon">↗</span>

                <div>

                  <strong>Easy Ordering</strong>

                  <span>Connect with us on WhatsApp</span>

                </div>

              </div>



              <div className="trust-item">

                <span className="trust-icon">✓</span>

                <div>

                  <strong>Personal Support</strong>

                  <span>Help finding the right accessory</span>

                </div>

              </div>

            </div>

          </section>



          {/* CATEGORIES */}

          <section

            className="section categories-section"

            id="categories"

          >

            <div className="section-heading">

              <div>

                <div className="section-eyebrow">

                  <span className="eyebrow-line" />

                  SHOP BY CATEGORY

                </div>



                <h2>Find Your Essentials</h2>



                <p>

                  Explore accessories for your phone and everyday tech.

                </p>

              </div>



              <button

                className="text-link"

                onClick={showAllProducts}

              >

                View all products <span>→</span>

              </button>

            </div>



            <div className="category-grid">

              {categories.map((category) => (

                <button

                  className={`category-card ${category.color} ${

                    selectedCategory === category.name

                      ? "category-selected"

                      : ""

                  }`}

                  key={category.name}

                  onClick={() => selectCategory(category.name)}

                >

                  <span className="category-icon">

                    {category.icon}

                  </span>



                  <strong>{category.name}</strong>



                  <span className="category-subtitle">

                    {category.subtitle}

                  </span>

                </button>

              ))}

            </div>

          </section>



          {/* PRODUCTS */}

          <section

            className="section products-section"

            id="products"

          >

            <div className="section-heading">

              <div>

                <div className="section-eyebrow">

                  <span className="eyebrow-line" />

                  OUR COLLECTION

                </div>



                <h2>

                  {selectedCategory === "All"

                    ? "Popular Accessories"

                    : selectedCategory}

                </h2>



                <p>

                  Explore popular picks for your mobile and daily use.

                </p>

              </div>



              <button

                className="text-link"

                onClick={showAllProducts}

              >

                Show all <span>→</span>

              </button>

            </div>



            <div className="product-grid">

              {filteredProducts.map((product) => (

                <article

                  className="product-card"

                  key={product.id}

                >

                  <div className="product-image-wrap">

                    <span

                      className={`discount-badge ${

                        product.discount === "New"

                          ? "new-badge"

                          : ""

                      }`}

                    >

                      {product.discount}

                    </span>



                    <button

                      className={`favorite-button ${

                        favorites.includes(product.id)

                          ? "is-favorite"

                          : ""

                      }`}

                      onClick={() =>

                        toggleFavorite(product.id)

                      }

                      aria-label={

                        favorites.includes(product.id)

                          ? "Remove from favourites"

                          : "Add to favourites"

                      }

                    >

                      {favorites.includes(product.id) ? "♥" : "♡"}

                    </button>



                    <img

                      className="product-image"

                      src={product.image}

                      alt={product.name}

                      loading="lazy"

                    />



                    <button

                      className="quick-add"

                      onClick={() => addToCart(product)}

                    >

                      Add to Cart +

                    </button>

                  </div>



                  <div className="product-details">

                    <span className="product-category">

                      {product.category}

                    </span>



                    <h3>{product.name}</h3>



                    <div className="rating-row">

                      <span className="stars">★★★★★</span>

                      <span className="rating-value">

                        {product.rating}

                      </span>

                      <span className="review-count">

                        ({product.reviews})

                      </span>

                    </div>



                    <div className="price-row">

                      <strong>

                        {formatPrice(product.price)}

                      </strong>



                      <del>

                        {formatPrice(product.oldPrice)}

                      </del>

                    </div>



                    <button

                      className="mobile-add-button"

                      onClick={() => addToCart(product)}

                    >

                      Add to Cart +

                    </button>

                  </div>

                </article>

              ))}

            </div>



            {filteredProducts.length === 0 && (

              <div className="no-products">

                <span>⌕</span>

                <h3>No products found</h3>



                <p>

                  Try another search or select a different category.

                </p>



                <button

                  className="primary-button"

                  onClick={showAllProducts}

                >

                  Clear filters

                </button>

              </div>

            )}

          </section>



          {/* ABOUT */}

          <section className="about-section" id="about">

            <div className="about-icon">✦</div>



            <div>

              <div className="section-eyebrow">

                ABOUT BATRA

              </div>



              <h2>Your Everyday Mobile Accessories Store</h2>



              <p>

                Batra Mobile Accessories brings together useful

                accessories for your phone and everyday technology.

                Browse the collection and contact us to check product

                availability, device compatibility and local delivery

                options.

              </p>

            </div>



            <button

              className="secondary-button"

              onClick={() => scrollToSection("contact")}

            >

              Get in Touch →

            </button>

          </section>

        </main>

      )}



      {/* ADMIN LOGIN MODAL */}

      {showAdminLogin && (

        <div

          className="admin-login-overlay"

          onClick={(event) => {

            if (event.target === event.currentTarget) {

              setShowAdminLogin(false);

              setLoginError("");

            }

          }}

        >

          <form

            className="admin-login-box"

            onSubmit={handleAdminLogin}

          >

            <button

              type="button"

              className="admin-login-close"

              onClick={() => {

                setShowAdminLogin(false);

                setLoginError("");

              }}

              aria-label="Close login"

            >

              ×

            </button>



            <span className="section-eyebrow">

              BATRA MOBILE ACCESSORIES

            </span>



            <h2>Owner Login</h2>



            <p>

              Sign in to manage products, images and prices.

            </p>



            <label htmlFor="admin-email">

              Email Address

            </label>



            <input

              id="admin-email"

              type="email"

              autoComplete="username"

              value={adminEmail}

              onChange={(event) =>

                setAdminEmail(event.target.value)

              }

              placeholder="Enter owner email"

              required

            />



            <label htmlFor="admin-password">

              Password

            </label>



            <div className="admin-password-field" style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showAdminPassword ? "text" : "password"}
                autoComplete="current-password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Enter password"
                required
                style={{ width: "100%", paddingRight: "48px" }}
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword((visible) => !visible)}
                aria-label={showAdminPassword ? "Hide password" : "Show password"}
                aria-pressed={showAdminPassword}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "6px",
                  fontSize: "18px",
                  lineHeight: 1
                }}
              >
                {showAdminPassword ? "🙈" : "👁"}
              </button>
            </div>



            {loginError && (

              <p className="admin-login-error" role="alert">

                {loginError}

              </p>

            )}



            <button

              type="submit"

              className="primary-button admin-login-submit"

              disabled={loginLoading}

            >

              {loginLoading ? "Logging in..." : "Login"}

            </button>



            <p className="admin-login-note">

              Owner access only.

            </p>

          </form>

        </div>

      )}



      {/* FOOTER */}

      <footer className="footer" id="contact">

        <div className="footer-main">

          <div className="footer-brand">

            <img

              src={batraLogo}

              alt="Batra Mobile Accessories"

            />



            <p>

              Mobile accessories for your everyday needs. Find your

              style, protect your device and stay connected.

            </p>

          </div>



          <div className="footer-column">

            <h3>Quick Links</h3>



            <button onClick={() => goToPage("home")}>

              Home

            </button>



            <button onClick={showAllProducts}>

              Shop Products

            </button>



            <button

              onClick={() => goHomeAndScroll("categories")}

            >

              Categories

            </button>



            <button

              onClick={() => goHomeAndScroll("about")}

            >

              About Us

            </button>

          </div>



          <div className="footer-column">

            <h3>Categories</h3>



            {categories.slice(0, 4).map((category) => (

              <button

                key={category.name}

                onClick={() => selectCategory(category.name)}

              >

                {category.name}

              </button>

            ))}

          </div>



          <div className="footer-column">

            <h3>Contact Us</h3>



            <p>

              Have a question about a product or phone compatibility?

            </p>



            <button

              className="footer-contact-link"

              onClick={() => setShowCart(true)}

            >

              View your cart

            </button>



            <button onClick={showAllProducts}>

              Browse products →

            </button>

          </div>



          {/* OWNER LOGIN IN FOOTER */}

          <div className="footer-column">

            <h3>Owner Access</h3>



            {isAdmin ? (

              <>

                <p>Admin account is active.</p>



                <button onClick={handleAdminLogout}>

                  Admin Logout

                </button>

              </>

            ) : (

              <button

                onClick={() => {

                  setShowAdminLogin(true);

                  setLoginError("");

                }}

              >

                Owner Login

              </button>

            )}

          </div>

        </div>



        <div className="footer-bottom">

          <span>

            © {new Date().getFullYear()} Batra Mobile Accessories.

          </span>



          <span>

            Thank you for shopping with us.

          </span>

        </div>

      </footer>

    </div>

  );

}



export default App;

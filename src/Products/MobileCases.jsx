import React, { useMemo, useState } from "react";
import "./MobileCases.css";

const phoneBrands = [
  {
    name: "Apple — iPhone",
    short: "i",
    models: [
      "iPhone 7", "iPhone 8", "iPhone SE 2", "iPhone SE 3",
      "iPhone X", "iPhone XS", "iPhone XS Max", "iPhone XR",
      "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
      "iPhone 12", "iPhone 12 Mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
      "iPhone 13", "iPhone 13 Mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
      "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
      "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
      "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
      "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "iPhone Air",
      "iPhone 18", "iPhone 18 Pro", "iPhone 18 Pro Max"
    ]
  },
  {
    name: "OnePlus",
    short: "1",
    models: [
      "OnePlus 6", "OnePlus 6T", "OnePlus 7", "OnePlus 7T",
      "OnePlus 8", "OnePlus 8 Pro", "OnePlus 9", "OnePlus 9 Pro",
      "OnePlus 10R", "OnePlus 11", "OnePlus 11R",
      "OnePlus 12", "OnePlus 12R", "OnePlus 13", "OnePlus 13R",
      "OnePlus 14", "OnePlus Nord", "OnePlus Nord 2",
      "OnePlus Nord 2T", "OnePlus Nord 3", "OnePlus Nord 4",
      "OnePlus Nord 5", "OnePlus Nord CE",
      "OnePlus Nord CE 2 Lite", "OnePlus Nord CE 3 Lite",
      "OnePlus Nord CE 4 Lite", "OnePlus Nord CE 5",
      "OnePlus Nord 6", "OnePlus Nord CE 6", "OnePlus Open"
    ]
  },
  {
    name: "Samsung — Galaxy",
    short: "S",
    models: [
      "Galaxy S9", "Galaxy S10", "Galaxy S20",
      "Galaxy S21", "Galaxy S21 Ultra", "Galaxy S22",
      "Galaxy S23", "Galaxy S23 FE", "Galaxy S24",
      "Galaxy S24 FE", "Galaxy S24 Ultra",
      "Galaxy S25", "Galaxy S25 Ultra",
      "Galaxy A11", "Galaxy A12", "Galaxy A13", "Galaxy A14",
      "Galaxy A15", "Galaxy A16", "Galaxy A17",
      "Galaxy A20", "Galaxy A30", "Galaxy A31", "Galaxy A32",
      "Galaxy A33", "Galaxy A34", "Galaxy A35", "Galaxy A36",
      "Galaxy A50", "Galaxy A51", "Galaxy A52", "Galaxy A53",
      "Galaxy A54", "Galaxy A55", "Galaxy A56",
      "Galaxy A04", "Galaxy A04e", "Galaxy A05",
      "Galaxy A05s", "Galaxy A06", "Galaxy A07",
      "Galaxy M11", "Galaxy M12", "Galaxy M14",
      "Galaxy M15", "Galaxy M16", "Galaxy M17",
      "Galaxy M30", "Galaxy M34", "Galaxy M35",
      "Galaxy M51", "Galaxy M52",
      "Galaxy F15", "Galaxy F16", "Galaxy F17",
      "Galaxy F41", "Galaxy F62",
      "Galaxy Z Fold Series", "Galaxy Z Flip Series"
    ]
  },
  {
    name: "Vivo",
    short: "V",
    models: [
      "Vivo S1", "Vivo S1 Pro",
      "Vivo T1", "Vivo T1 5G", "Vivo T1 Pro",
      "Vivo T2", "Vivo T2 Pro", "Vivo T2X",
      "Vivo T3", "Vivo T3X", "Vivo T3 Pro",
      "Vivo T4", "Vivo T4X", "Vivo T4 Pro",
      "Vivo V12", "Vivo V15", "Vivo V15 Pro",
      "Vivo V17", "Vivo V19", "Vivo V19 Neo",
      "Vivo V20", "Vivo V20 SE", "Vivo V21",
      "Vivo V23", "Vivo V23 Pro", "Vivo V25",
      "Vivo V25 Pro", "Vivo V27", "Vivo V27 Pro",
      "Vivo V29", "Vivo V29 Pro",
      "Vivo V30", "Vivo V30e", "Vivo V30 Pro",
      "Vivo V31", "Vivo V31 Pro", "Vivo V35",
      "Vivo V40", "Vivo V40 Pro", "Vivo V50",
      "Vivo V60", "Vivo V60e", "Vivo V70", "Vivo V70e",
      "Vivo Y11", "Vivo Y12", "Vivo Y12G",
      "Vivo Y15", "Vivo Y16", "Vivo Y17",
      "Vivo Y18", "Vivo Y19", "Vivo Y19e",
      "Vivo Y20", "Vivo Y21", "Vivo Y22",
      "Vivo Y27", "Vivo Y28", "Vivo Y29",
      "Vivo Y30", "Vivo Y31", "Vivo Y33",
      "Vivo Y35", "Vivo Y36", "Vivo Y40",
      "Vivo Y50", "Vivo Y56", "Vivo Y60",
      "Vivo Y100", "Vivo Y100A", "Vivo Y200",
      "Vivo Y200e", "Vivo X Series", "Vivo X Fold Series"
    ]
  },
  {
    name: "Redmi",
    short: "R",
    models: [
      "Redmi 4", "Redmi 5", "Redmi 6", "Redmi 7",
      "Redmi 8", "Redmi 9", "Redmi 10", "Redmi 11",
      "Redmi 12", "Redmi 13", "Redmi 14",
      "Redmi Note 4", "Redmi Note 5", "Redmi Note 6 Pro",
      "Redmi Note 7", "Redmi Note 8", "Redmi Note 8 Pro",
      "Redmi Note 9", "Redmi Note 9 Pro", "Redmi Note 9 Pro Max",
      "Redmi Note 10", "Redmi Note 10 Pro", "Redmi Note 10 Pro Max",
      "Redmi Note 11", "Redmi Note 11 Pro", "Redmi Note 11 Pro Plus",
      "Redmi Note 12", "Redmi Note 12 Pro", "Redmi Note 12 Pro Plus",
      "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 13 Pro Plus",
      "Redmi Note 14", "Redmi Note 14 Pro", "Redmi Note 14 Pro Plus",
      "Redmi Note 15", "Redmi A Series", "Redmi K Series"
    ]
  },
  {
    name: "Xiaomi / Mi",
    short: "M",
    models: [
      "Mi 10", "Mi 10 Pro", "Mi 11", "Mi 11 Lite",
      "Mi 11X", "Mi 11X Pro", "Mi 12", "Mi 12 Pro",
      "Mi 13", "Mi 13 Pro", "Mi 14", "Mi 14 Ultra",
      "Xiaomi 14", "Xiaomi 14 Pro", "Xiaomi 14 Ultra",
      "Xiaomi 15", "Xiaomi 15 Pro", "Xiaomi 15 Ultra",
      "Xiaomi T Series"
    ]
  },
  {
    name: "OPPO",
    short: "O",
    models: [
      "OPPO A3", "OPPO A3X", "OPPO A3 Pro",
      "OPPO A5", "OPPO A5 Pro", "OPPO A5X",
      "OPPO A7", "OPPO A9", "OPPO A12",
      "OPPO A15", "OPPO A16", "OPPO A17",
      "OPPO A18", "OPPO A31", "OPPO A38",
      "OPPO A39", "OPPO A53", "OPPO A54",
      "OPPO A55", "OPPO A57", "OPPO A58",
      "OPPO A59", "OPPO A74", "OPPO A78",
      "OPPO A79", "OPPO A92", "OPPO A96",
      "OPPO F9", "OPPO F11", "OPPO F11 Pro",
      "OPPO F15", "OPPO F17", "OPPO F19",
      "OPPO F21 Pro", "OPPO F23", "OPPO F25 Pro",
      "OPPO F27 Pro", "OPPO K12", "OPPO K12X",
      "OPPO K13", "OPPO K13X",
      "OPPO Reno Series", "OPPO Find X Series",
      "OPPO Find N Series"
    ]
  },
  {
    name: "Realme",
    short: "R",
    models: [
      "Realme 1", "Realme 2", "Realme 3", "Realme 5",
      "Realme 6", "Realme 7", "Realme 8",
      "Realme 9", "Realme 10", "Realme 11",
      "Realme 12", "Realme 13", "Realme 14", "Realme 15",
      "Realme 3 Pro", "Realme 5 Pro", "Realme 6 Pro",
      "Realme 7 Pro", "Realme 8 Pro", "Realme 9 Pro",
      "Realme 10 Pro", "Realme 11 Pro", "Realme 12 Pro",
      "Realme 13 Pro", "Realme C Series", "Realme C11",
      "Realme C12", "Realme C15", "Realme C20",
      "Realme C21", "Realme C25", "Realme C30",
      "Realme C31", "Realme C33", "Realme C35",
      "Realme C51", "Realme C53", "Realme C55",
      "Realme C61", "Realme C63", "Realme C65",
      "Realme Narzo Series", "Realme GT Series",
      "Realme P Series", "Realme Note Series"
    ]
  },
 
 
];

function MobileCases({ onBack }) {
  const iphoneBrand = phoneBrands[0];

  const androidBrands = useMemo(() => {
    const order = [
      "OnePlus",
      "Samsung — Galaxy",
      "Vivo",
      "Redmi",
      "Xiaomi / Mi",
      "OPPO",
      "Realme"
    ];

    const sorted = order
      .map((name) => phoneBrands.find((brand) => brand.name === name))
      .filter(Boolean);

    const remaining = phoneBrands.filter(
      (brand) => brand.name !== iphoneBrand.name &&
        !order.includes(brand.name)
    );

    return [...sorted, ...remaining];
  }, []);

  const getDisplayBrandName = (brand) => {
    if (!brand) return "";
    if (brand.name === "Samsung — Galaxy") return "Samsung";
    if (brand.name === "Xiaomi / Mi") return "Mi";
    return brand.name;
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showAllAndroidBrands, setShowAllAndroidBrands] = useState(false);

  const activeBrand = phoneBrands.find(
    (brand) => brand.name === selectedBrand
  );

  const filteredModels = useMemo(() => {
    if (!activeBrand) return [];

    const query = modelSearch.trim().toLowerCase();

    if (!query) return activeBrand.models;

    return activeBrand.models.filter((model) =>
      model.toLowerCase().includes(query)
    );
  }, [activeBrand, modelSearch]);

  const globalSearchResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();

    if (!query) return [];

    return phoneBrands.flatMap((brand) =>
      brand.models
        .filter((model) => model.toLowerCase().includes(query))
        .map((model) => ({
          model,
          brandName: brand.name,
          category: brand.name === iphoneBrand.name ? "iPhone" : "Android",
          displayBrand: getDisplayBrandName(brand)
        }))
    ).slice(0, 12);
  }, [globalSearch]);

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedBrand(category === "iPhone" ? iphoneBrand.name : "");
    setSelectedModel("");
    setModelSearch("");
    setGlobalSearch("");
  };

  const selectBrand = (brandName) => {
    setSelectedCategory(brandName === iphoneBrand.name ? "iPhone" : "Android");
    setSelectedBrand(brandName);
    setSelectedModel("");
    setModelSearch("");
    setGlobalSearch("");
  };

  const selectSearchResult = (result) => {
    setSelectedCategory(result.category);
    setSelectedBrand(result.brandName);
    setSelectedModel(result.model);
    setModelSearch("");
    setGlobalSearch(result.model);
  };

  const handleGlobalSearchKeyDown = (event) => {
    if (event.key === "Enter" && globalSearchResults.length > 0) {
      event.preventDefault();
      selectSearchResult(globalSearchResults[0]);
    }

    if (event.key === "Escape") {
      setGlobalSearch("");
    }
  };

  const checkAvailability = () => {
    if (!selectedModel || !activeBrand) return;

    const message =
      `Hello Batra Mobile Accessories! I want to check mobile cover availability.\n\n` +
      `Phone category: ${selectedCategory}\n` +
      `Phone brand: ${getDisplayBrandName(activeBrand)}\n` +
      `Phone model: ${selectedModel}\n\n` +
      `Please share available designs and prices.`;

    // Replace with the shop's actual WhatsApp number.
    const whatsappNumber = "91XXXXXXXXXX";

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      alert("Please add the shop's actual WhatsApp number in MobileCases.jsx.");
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const visibleAndroidBrands = showAllAndroidBrands
    ? androidBrands
    : androidBrands.slice(0, 7);

  return (
    <section className="mobile-cases-page">

      <div className="mc-topbar">
        <button
          type="button"
          className="mc-back-button"
          onClick={onBack}
        >
          ← Back to Shop
        </button>

        <div className="mc-breadcrumb">
          Home <span>/</span> Shop <span>/</span>
          <strong>Mobile Cases</strong>
        </div>
      </div>

      <div className="mc-page-heading">
        <div>
          <span className="mc-eyebrow">OUR COLLECTION</span>
          <h1>Find a Cover for Your Phone</h1>
          <p>
            Select your phone brand or enter your phone model name
            to find a matching cover.
          </p>
        </div>

        <button
          type="button"
          className="mc-show-all"
          onClick={() => selectCategory("iPhone")}
        >
          Show iPhone models →
        </button>
      </div>

      <div className="mc-layout">

        {/* LEFT SIDEBAR */}

        <aside className="mc-sidebar">

          <div className="mc-sidebar-heading">
            <span>FIND YOUR PHONE</span>
            <span>Search</span>
          </div>

          {/* Global phone search */}

          <label className="mc-model-search mc-sidebar-search">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Enter phone model name..."
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              onKeyDown={handleGlobalSearchKeyDown}
              aria-label="Search all phone models"
            />
          </label>

          {globalSearch.trim() && (
            <div className="mc-search-results">

              {globalSearchResults.length > 0 ? (
                globalSearchResults.map((result) => (
                  <button
                    type="button"
                    key={`${result.brandName}-${result.model}`}
                    className="mc-search-result"
                    onClick={() => selectSearchResult(result)}
                  >
                    <span>
                      <strong>{result.model}</strong>
                      <small>{result.displayBrand}</small>
                    </span>

                    <span className="mc-model-arrow">→</span>
                  </button>
                ))
              ) : (
                <p className="mc-search-no-result">
                  No matching phone model found.
                </p>
              )}

              {globalSearchResults.length > 0 && (
                <p className="mc-search-hint">
                  Press Enter to open the first result.
                </p>
              )}
            </div>
          )}

          <div className="mc-sidebar-heading mc-category-heading">
            <span>PHONE TYPE</span>
            <span>2 categories</span>
          </div>

          <div className="mc-brand-list">

            {/* iPhone */}

            <button
              type="button"
              className={`mc-brand-item ${
                selectedCategory === "iPhone" ? "mc-brand-active" : ""
              }`}
              onClick={() => selectCategory("iPhone")}
              aria-expanded={selectedCategory === "iPhone"}
            >
              <span className="mc-brand-letter">i</span>
              <span className="mc-brand-name">iPhone</span>
              <span className="mc-chevron">›</span>
            </button>

            {/* Android */}

            <button
              type="button"
              className={`mc-brand-item ${
                selectedCategory === "Android" ? "mc-brand-active" : ""
              }`}
              onClick={() => {
                if (selectedCategory === "Android") {
                  setSelectedCategory("");
                  setSelectedBrand("");
                  setSelectedModel("");
                } else {
                  selectCategory("Android");
                }
              }}
              aria-expanded={selectedCategory === "Android"}
            >
              <span className="mc-brand-letter">A</span>
              <span className="mc-brand-name">Android</span>
              <span className="mc-chevron">
                {selectedCategory === "Android" ? "⌄" : "›"}
              </span>
            </button>

            {/* Expanded Android brands */}

            {selectedCategory === "Android" && (
              <div className="mc-sidebar-android-brands">

                <p className="mc-sidebar-section-label">
                  SELECT YOUR BRAND
                </p>

                {visibleAndroidBrands.map((brand) => (
                  <button
                    type="button"
                    key={brand.name}
                    className={`mc-brand-item mc-nested-brand ${
                      selectedBrand === brand.name ? "mc-brand-active" : ""
                    }`}
                    onClick={() => selectBrand(brand.name)}
                  >
                    <span className="mc-brand-letter">
                      {brand.short}
                    </span>

                    <span className="mc-brand-name">
                      {getDisplayBrandName(brand)}
                    </span>

                    <span className="mc-chevron">›</span>
                  </button>
                ))}

                {androidBrands.length > 7 && (
                  <button
                    type="button"
                    className="mc-more-brands"
                    onClick={() =>
                      setShowAllAndroidBrands((current) => !current)
                    }
                  >
                    {showAllAndroidBrands
                      ? "Show fewer brands"
                      : "More brands"}

                    <span>
                      {showAllAndroidBrands ? "−" : "+"}
                    </span>
                  </button>
                )}

              </div>
            )}
          </div>
        </aside>

        {/* RIGHT MODEL PANEL */}

        <div className="mc-model-panel">

          {/* First-time instruction */}

          {!selectedCategory && (
            <div className="mc-first-time-state">
              <span className="mc-eyebrow">
                LET'S FIND YOUR COVER
              </span>

              <h2>Select Your Phone Brand</h2>

              <p>
                Choose <strong>iPhone</strong> or <strong>Android</strong>
                from the sidebar, or enter your phone model name
                in the search box. We will take you directly
                to the matching model.
              </p>

              <div className="mc-first-time-actions">
                <button
                  type="button"
                  className="mc-whatsapp-button"
                  onClick={() => selectCategory("iPhone")}
                >
                  Explore iPhone →
                </button>

                <button
                  type="button"
                  className="mc-reset-button"
                  onClick={() => selectCategory("Android")}
                >
                  Explore Android →
                </button>
              </div>
            </div>
          )}

          {/* Android brand instruction */}

          {selectedCategory === "Android" && !selectedBrand && (
            <div className="mc-first-time-state">
              <span className="mc-eyebrow">
                ANDROID PHONES
              </span>

              <h2>Select Your Phone Brand</h2>

              <p>
                Choose OnePlus, Samsung, Vivo, Redmi, Mi, OPPO
                or Realme from the expanded Android list in the sidebar.
                You can also search for your exact phone model above.
              </p>
            </div>
          )}

          {/* Selected brand models */}

          {activeBrand && (
            <>
              <div className="mc-model-heading">
                <div>
                  <span className="mc-eyebrow">
                    {selectedCategory === "iPhone"
                      ? "IPHONE MODELS"
                      : `${getDisplayBrandName(activeBrand).toUpperCase()} MODELS`}
                  </span>

                  <h2>
                    {selectedCategory === "iPhone"
                      ? "Apple iPhone"
                      : getDisplayBrandName(activeBrand)}
                  </h2>

                  <p>
                    Choose your phone model to check matching mobile covers.
                  </p>
                </div>

                <button
                  type="button"
                  className="mc-all-models"
                  onClick={() => {
                    setSelectedModel("");
                    setModelSearch("");
                  }}
                >
                  All models
                </button>
              </div>

              {/* Brand-specific model search */}

              <label className="mc-model-search">
                <span>⌕</span>

                <input
                  type="search"
                  placeholder={`Search ${getDisplayBrandName(activeBrand)} models...`}
                  value={modelSearch}
                  onChange={(event) => setModelSearch(event.target.value)}
                  aria-label="Search brand models"
                />
              </label>

              {/* Model cards */}

              {filteredModels.length > 0 ? (
                <div className="mc-model-grid">
                  {filteredModels.map((model) => (
                    <button
                      type="button"
                      key={model}
                      className={`mc-model-card ${
                        selectedModel === model
                          ? "mc-model-selected"
                          : ""
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      <span className="mc-model-icon">▯</span>
                      <span className="mc-model-name">{model}</span>
                      <span className="mc-model-arrow">→</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mc-empty-state">
                  <span>⌕</span>
                  <h3>No matching models found</h3>

                  <p>
                    Try another model name or choose a different brand.
                  </p>

                  <button
                    type="button"
                    className="mc-reset-button"
                    onClick={() => setModelSearch("")}
                  >
                    Show all models
                  </button>
                </div>
              )}

              {/* Selected model and WhatsApp */}

              <div className="mc-bottom-note">
                {selectedModel ? (
                  <div className="mc-selected-info">
                    <div>
                      <strong>{selectedModel}</strong>

                      <p>
                        Selected model. Confirm cover availability
                        and prices with the shop.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mc-whatsapp-button"
                      onClick={checkAvailability}
                    >
                      Check Availability →
                    </button>
                  </div>
                ) : (
                  <p>
                    Select a model to check cover availability on WhatsApp.
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}

export default MobileCases;
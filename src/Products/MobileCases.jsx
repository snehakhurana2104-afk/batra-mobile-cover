
import React, { useMemo, useState } from "react";
import "./MobileCases.css";



const phoneBrands = [
  {
    name: "Apple",
    short: "A",
    category: "iPhone",
    models: [
      "iPhone 7 & iPhone 8",
      "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
      "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
      "iPhone 12", "iPhone 12 Mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
      "iPhone 13", "iPhone 13 Mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
      "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
      "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
      "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
      "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "iPhone Air"
    ]
  },
  {
    name: "OnePlus",
    short: "O",
    category: "Android",
    models: [
      "OnePlus 5", "OnePlus 5T", "OnePlus 6", "OnePlus 6T",
      "OnePlus 7", "OnePlus 7 Pro", "OnePlus 7T", "OnePlus 7T Pro",
      "OnePlus 8", "OnePlus 8 Pro", "OnePlus 8T",
      "OnePlus 9", "OnePlus 9 Pro", "OnePlus 9R",
      "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 10R",
      "OnePlus 11", "OnePlus 11R", "OnePlus 12", "OnePlus 12R",
      "OnePlus 13", "OnePlus 13R", "OnePlus Nord", "OnePlus Nord CE",
      "OnePlus Nord CE 2", "OnePlus Nord CE 3", "OnePlus Nord CE 4",
      "OnePlus Nord 2", "OnePlus Nord 3", "OnePlus Nord 4"
    ]
  },
  {
    name: "Samsung",
    short: "S",
    category: "Android",
    models: [
      "Galaxy S8", "Galaxy S8 Plus", "Galaxy S9", "Galaxy S9 Plus",
      "Galaxy S10", "Galaxy S10 Plus", "Galaxy S10 Lite",
      "Galaxy S20", "Galaxy S20 Plus", "Galaxy S20 Ultra", "Galaxy S20 FE",
      "Galaxy S21", "Galaxy S21 Plus", "Galaxy S21 Ultra", "Galaxy S21 FE",
      "Galaxy S22", "Galaxy S22 Plus", "Galaxy S22 Ultra",
      "Galaxy S23", "Galaxy S23 Plus", "Galaxy S23 Ultra", "Galaxy S23 FE",
      "Galaxy S24", "Galaxy S24 Plus", "Galaxy S24 Ultra", "Galaxy S24 FE",
      "Galaxy S25", "Galaxy S25 Plus", "Galaxy S25 Ultra", "Galaxy S25 FE",
      "Galaxy A12", "Galaxy A13", "Galaxy A14", "Galaxy A15",
      "Galaxy A16", "Galaxy A22", "Galaxy A23", "Galaxy A24",
      "Galaxy A25", "Galaxy A32", "Galaxy A33", "Galaxy A34",
      "Galaxy A35", "Galaxy A50", "Galaxy A51", "Galaxy A52",
      "Galaxy A53", "Galaxy A54", "Galaxy A55", "Galaxy M12",
      "Galaxy M13", "Galaxy M14", "Galaxy M15", "Galaxy M21",
      "Galaxy M31", "Galaxy M32", "Galaxy M33", "Galaxy M34",
      "Galaxy M51", "Galaxy M52", "Galaxy F14", "Galaxy F15",
      "Galaxy F23", "Galaxy F34", "Galaxy Z Flip 5", "Galaxy Z Flip 6",
      "Galaxy Z Fold 5", "Galaxy Z Fold 6"
    ]
  },
  {
    name: "Vivo",
    short: "V",
    category: "Android",
    models: [
      "Vivo V15", "Vivo V17", "Vivo V19", "Vivo V20",
      "Vivo V21", "Vivo V23", "Vivo V25", "Vivo V27",
      "Vivo V29", "Vivo V30", "Vivo V40", "Vivo V50",
      "Vivo Y11", "Vivo Y12", "Vivo Y15", "Vivo Y16",
      "Vivo Y17", "Vivo Y19", "Vivo Y20", "Vivo Y21",
      "Vivo Y22", "Vivo Y27", "Vivo Y28", "Vivo Y30",
      "Vivo Y33s", "Vivo Y35", "Vivo Y36", "Vivo Y56",
      "Vivo Y75", "Vivo Y100", "Vivo T1", "Vivo T2",
      "Vivo T2 Pro", "Vivo T3", "Vivo T3 Pro", "Vivo T3x"
    ]
  },
  {
    name: "Redmi",
    short: "R",
    category: "Android",
    models: [
      "Redmi 5", "Redmi 6", "Redmi 7", "Redmi 8",
      "Redmi 9", "Redmi 9A", "Redmi 9 Prime", "Redmi 10",
      "Redmi 10A", "Redmi 10 Prime", "Redmi 11 Prime",
      "Redmi 12", "Redmi 12 5G", "Redmi 13C", "Redmi 13 5G",
      "Redmi 14C", "Redmi Note 7", "Redmi Note 8",
      "Redmi Note 8 Pro", "Redmi Note 9", "Redmi Note 9 Pro",
      "Redmi Note 10", "Redmi Note 10 Pro", "Redmi Note 10S",
      "Redmi Note 11", "Redmi Note 11 Pro", "Redmi Note 11T",
      "Redmi Note 12", "Redmi Note 12 Pro", "Redmi Note 12 Pro Plus",
      "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 13 Pro Plus",
      "Redmi Note 14", "Redmi Note 14 Pro", "Redmi Note 14 Pro Plus"
    ]
  },
  {
    name: "Mi",
    short: "M",
    category: "Android",
    models: [
      "Mi A1", "Mi A2", "Mi A2 Lite", "Mi A3",
      "Mi 9", "Mi 10", "Mi 10T", "Mi 10T Pro",
      "Mi 11", "Mi 11 Lite", "Mi 11X", "Mi 11X Pro",
      "Mi 12 Pro", "Mi 13 Pro", "Mi 14",
      "Xiaomi 11T", "Xiaomi 11T Pro", "Xiaomi 12",
      "Xiaomi 12 Pro", "Xiaomi 13", "Xiaomi 13 Pro",
      "Xiaomi 14", "Xiaomi 14 Ultra", "Xiaomi 15"
    ]
  },
  {
    name: "OPPO",
    short: "O",
    category: "Android",
    models: [
      "OPPO A3s", "OPPO A5", "OPPO A5s", "OPPO A9",
      "OPPO A12", "OPPO A15", "OPPO A16", "OPPO A17",
      "OPPO A18", "OPPO A31", "OPPO A32", "OPPO A33",
      "OPPO A52", "OPPO A53", "OPPO A54", "OPPO A55",
      "OPPO A57", "OPPO A58", "OPPO A59", "OPPO A74",
      "OPPO A76", "OPPO A78", "OPPO A79", "OPPO A96",
      "OPPO F11", "OPPO F15", "OPPO F17", "OPPO F19",
      "OPPO F21 Pro", "OPPO F23", "OPPO Reno 2",
      "OPPO Reno 4", "OPPO Reno 5", "OPPO Reno 6",
      "OPPO Reno 7", "OPPO Reno 8", "OPPO Reno 10",
      "OPPO Reno 11", "OPPO Reno 12"
    ]
  },
  {
    name: "Realme",
    short: "R",
    category: "Android",
    models: [
      "Realme 2", "Realme 3", "Realme 5", "Realme 5 Pro",
      "Realme 6", "Realme 6 Pro", "Realme 7", "Realme 7 Pro",
      "Realme 8", "Realme 8 Pro", "Realme 9", "Realme 9 Pro",
      "Realme 9 Pro Plus", "Realme 10", "Realme 10 Pro",
      "Realme 11", "Realme 11 Pro", "Realme 11 Pro Plus",
      "Realme 12", "Realme 12 Pro", "Realme 12 Pro Plus",
      "Realme 13", "Realme 13 Pro", "Realme 13 Pro Plus",
      "Realme C11", "Realme C12", "Realme C15", "Realme C20",
      "Realme C21", "Realme C25", "Realme C30", "Realme C31",
      "Realme C33", "Realme C35", "Realme C51", "Realme C53",
      "Realme C55", "Realme C61", "Realme C63", "Realme Narzo 50",
      "Realme Narzo 60", "Realme Narzo 70"
    ]
  },
  {
    name: "POCO",
    short: "P",
    category: "Android",
    models: [
      "POCO C3", "POCO C31", "POCO C50", "POCO C51",
      "POCO C55", "POCO C65", "POCO M2", "POCO M2 Pro",
      "POCO M3", "POCO M4 Pro", "POCO M5", "POCO M6",
      "POCO X2", "POCO X3", "POCO X3 Pro", "POCO X4 Pro",
      "POCO X5", "POCO X5 Pro", "POCO X6", "POCO X6 Pro",
      "POCO X7", "POCO F1", "POCO F3", "POCO F4",
      "POCO F5", "POCO F6"
    ]
  },
  {
    name: "Motorola",
    short: "M",
    category: "Android",
    models: [
      "Moto G30", "Moto G31", "Moto G32", "Moto G40 Fusion",
      "Moto G42", "Moto G52", "Moto G54", "Moto G62",
      "Moto G64", "Moto G72", "Moto G73", "Moto G82",
      "Moto G84", "Moto G85", "Moto Edge 20", "Moto Edge 30",
      "Moto Edge 30 Pro", "Moto Edge 40", "Moto Edge 50",
      "Moto Edge 50 Pro", "Moto E13", "Moto E32", "Moto E40"
    ]
  },
  {
    name: "Nothing",
    short: "N",
    category: "Android",
    models: [
      "Nothing Phone 1", "Nothing Phone 2", "Nothing Phone 2a",
      "Nothing Phone 2a Plus", "Nothing Phone 3", "Nothing Phone 3a"
    ]
  },
  {
    name: "Google Pixel",
    short: "G",
    category: "Android",
    models: [
      "Pixel 4", "Pixel 4 XL", "Pixel 4a", "Pixel 5",
      "Pixel 5a", "Pixel 6", "Pixel 6 Pro", "Pixel 6a",
      "Pixel 7", "Pixel 7 Pro", "Pixel 7a", "Pixel 8",
      "Pixel 8 Pro", "Pixel 8a", "Pixel 9", "Pixel 9 Pro",
      "Pixel 9 Pro XL", "Pixel 9a", "Pixel 10", "Pixel 10 Pro"
    ]
  }
];

const initialVisibleBrands = 8;
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

export default function MobileCases({ onBack, onOpenIphone = () => {} }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  const androidBrands = phoneBrands.filter(
    (brand) => brand.category === "Android"
  );

  const appleBrand = phoneBrands.find(
    (brand) => brand.name === "Apple"
  );

  const visibleBrands = showAllBrands
    ? androidBrands
    : androidBrands.slice(0, initialVisibleBrands);

  const currentBrand = phoneBrands.find(
    (brand) => brand.name === selectedBrand
  );

  const filteredModels = useMemo(() => {
    if (!currentBrand) return [];

    return currentBrand.models.filter((model) =>
      model.toLowerCase().includes(modelSearch.trim().toLowerCase())
    );
  }, [currentBrand, modelSearch]);

  const globalResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();

    if (!query) return [];

    return phoneBrands.flatMap((brand) =>
      brand.models
        .filter((model) => model.toLowerCase().includes(query))
        .map((model) => ({
          model,
          brand: brand.name
        }))
    ).slice(0, 10);
  }, [globalSearch]);

  const chooseBrand = (brandName) => {
    if (brandName === "Apple") {
      onOpenIphone();
      return;
    }

    setSelectedBrand(brandName);
    setSelectedModel("");
    setModelSearch("");
    setGlobalSearch("");
  };

  const chooseSearchResult = (result) => {
    if (result.brand === "Apple") {
      onOpenIphone();
      return;
    }

    setSelectedBrand(result.brand);
    setSelectedModel(result.model);
    setModelSearch("");
    setGlobalSearch("");
  };

  const resetSelection = () => {
    setSelectedBrand(null);
    setSelectedModel("");
    setModelSearch("");
    setGlobalSearch("");
  };

  const sendWhatsApp = () => {
    if (!selectedModel || !currentBrand) return;

    const message = `Hello, I want to check mobile cover availability for ${selectedBrand} ${selectedModel}. Please share available designs and prices.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="mobile-cases-page">
      <div className="mc-topbar">
        <button
          className="mc-back-button"
          onClick={() => onBack?.()}
          type="button"
        >
          ← Back
        </button>

        <div className="mc-breadcrumb">
          <span>Home</span>
          <span>/</span>
          <span>Collections</span>
          <span>/</span>
          <strong>Mobile Cases</strong>
        </div>
      </div>

      <div className="mc-page-heading">
        <div>
          <span className="mc-eyebrow">PHONE ACCESSORIES COLLECTION</span>
          <h1>Find a Cover for Your Phone</h1>
          <p>
            Select your phone brand and model to find the right mobile cover.
          </p>
        </div>
      </div>

      <div className="mc-layout">
        <aside className="mc-sidebar">
          <div className="mc-sidebar-heading">
            <span>PHONE BRANDS</span>
            <span>{phoneBrands.length} Brands</span>
          </div>

          <div className="mc-sidebar-search">
            <div className="mc-model-search">
              <span>⌕</span>
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search any phone model..."
              />
            </div>

            {globalSearch.trim() && (
              <div className="mc-search-results">
                {globalResults.length > 0 ? (
                  globalResults.map((result) => (
                    <button
                      type="button"
                      className="mc-search-result"
                      key={`${result.brand}-${result.model}`}
                      onClick={() => chooseSearchResult(result)}
                    >
                      <span>
                        <strong>{result.model}</strong>
                        <small>{result.brand}</small>
                      </span>
                      <span>→</span>
                    </button>
                  ))
                ) : (
                  <p className="mc-search-no-result">
                    No matching phone model found.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mc-category-heading">
            <div className="mc-sidebar-section-label">APPLE</div>
            <button
              type="button"
              className={`mc-brand-item ${
                selectedBrand === "Apple" ? "mc-brand-active" : ""
              }`}
              onClick={() => chooseBrand("Apple")}
            >
              <span className="mc-brand-letter">A</span>
              <span className="mc-brand-name">Apple — iPhone</span>
              <span className="mc-chevron">›</span>
            </button>
          </div>

          <div className="mc-category-heading">
            <div className="mc-sidebar-section-label">ANDROID BRANDS</div>

            <div className="mc-brand-list">
              {visibleBrands.map((brand) => (
                <button
                  type="button"
                  key={brand.name}
                  className={`mc-brand-item ${
                    selectedBrand === brand.name ? "mc-brand-active" : ""
                  }`}
                  onClick={() => chooseBrand(brand.name)}
                >
                  <span className="mc-brand-letter">{brand.short}</span>
                  <span className="mc-brand-name">{brand.name}</span>
                  <span className="mc-chevron">›</span>
                </button>
              ))}
            </div>

            {androidBrands.length > initialVisibleBrands && (
              <button
                type="button"
                className="mc-more-brands"
                onClick={() => setShowAllBrands((value) => !value)}
              >
                {showAllBrands ? "Show Less" : "View More Brands"}
                <span>{showAllBrands ? "−" : "+"}</span>
              </button>
            )}
          </div>
        </aside>

        <section className="mc-model-panel">
          {!currentBrand ? (
            <div className="mc-first-time-state">
              <span className="mc-eyebrow">GET STARTED</span>
              <h2>Select Your Phone Brand</h2>
              <p>
                First, choose your phone brand from the left sidebar.
                Then select your exact model to check mobile cover availability.
              </p>

              <div className="mc-first-time-actions">
                <button
                  type="button"
                  className="mc-whatsapp-button"
                  onClick={() => chooseBrand("Apple")}
                >
                  Browse iPhone Models
                </button>
                <button
                  type="button"
                  className="mc-reset-button"
                  onClick={() => chooseBrand("OnePlus")}
                >
                  Browse Android Models
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mc-model-heading">
                <div>
                  <span className="mc-eyebrow">
                    {currentBrand.category === "iPhone"
                      ? "APPLE COLLECTION"
                      : "ANDROID COLLECTION"}
                  </span>
                  <h2>{currentBrand.name} Phone Models</h2>
                  <p>
                    Select your exact model from the list below.
                  </p>
                </div>

                <button
                  type="button"
                  className="mc-reset-button"
                  onClick={resetSelection}
                >
                  Change Brand
                </button>
              </div>

              <div className="mc-model-search">
                <span>⌕</span>
                <input
                  type="search"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder={`Search ${currentBrand.name} models...`}
                />
              </div>

              {filteredModels.length > 0 ? (
                <div className="mc-model-grid">
                  {filteredModels.map((model) => (
                    <button
                      type="button"
                      key={model}
                      className={`mc-model-card ${
                        selectedModel === model ? "mc-model-selected" : ""
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      <span className="mc-model-icon">▣</span>
                      <span className="mc-model-name">{model}</span>
                      <span className="mc-model-arrow">›</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mc-empty-state">
                  <span>⌕</span>
                  <h3>No Models Found</h3>
                  <p>Try another model name or check the spelling.</p>
                  <button
                    type="button"
                    className="mc-reset-button"
                    onClick={() => setModelSearch("")}
                  >
                    Clear Search
                  </button>
                </div>
              )}

              <div className="mc-bottom-note">
                {selectedModel ? (
                  <div className="mc-selected-info">
                    <div>
                      <strong>{selectedBrand} {selectedModel}</strong>
                      <p>Your selected phone model is ready for availability enquiry.</p>
                    </div>
                    <button
                      type="button"
                      className="mc-whatsapp-button"
                      onClick={sendWhatsApp}
                    >
                      Check Availability on WhatsApp
                    </button>
                  </div>
                ) : (
                  <p>
                    Select a model to check its mobile cover availability.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

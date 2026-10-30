
import React, { useMemo, useState } from "react";
import "./MobileCases.css";

const phoneBrands = [
  {
    name: "Apple — iPhone",
    short: "A",
    models: [
      "iPhone 17",
      "iPhone 17 Pro",
      "iPhone 17 Pro Max",
      "iPhone Air",
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 14",
      "iPhone 14 Plus",
      "iPhone 14 Pro",
      "iPhone 14 Pro Max",
      "iPhone 13",
      "iPhone 13 Pro",
      "iPhone 13 Pro Max",
      "iPhone 12",
      "iPhone 12 Pro",
      "iPhone 11",
      "iPhone 11 Pro",
      "iPhone SE",
    ],
  },
  {
    name: "Samsung — Galaxy",
    short: "S",
    models: [
      "Galaxy S Series",
      "Galaxy S Ultra Series",
      "Galaxy S FE Series",
      "Galaxy A Series",
      "Galaxy M Series",
      "Galaxy F Series",
      "Galaxy Z Fold Series",
      "Galaxy Z Flip Series",
    ],
  },
  {
    name: "Xiaomi / Redmi / POCO",
    short: "X",
    models: [
      "Redmi Note Series",
      "Redmi Number Series",
      "Redmi A Series",
      "Redmi K Series",
      "POCO X Series",
      "POCO F Series",
      "POCO M Series",
      "POCO C Series",
      "Xiaomi Number Series",
      "Xiaomi T Series",
    ],
  },
  {
    name: "Vivo",
    short: "V",
    models: [
      "Vivo V Series",
      "Vivo Y Series",
      "Vivo T Series",
      "Vivo X Series",
      "Vivo X Fold Series",
    ],
  },
  {
    name: "OPPO",
    short: "O",
    models: [
      "OPPO Reno Series",
      "OPPO A Series",
      "OPPO F Series",
      "OPPO Find X Series",
      "OPPO Find N Series",
      "OPPO K Series",
    ],
  },
  {
    name: "OnePlus",
    short: "1",
    models: [
      "OnePlus Number Series",
      "OnePlus Nord Series",
      "OnePlus R Series",
      "OnePlus CE Series",
      "OnePlus Open",
    ],
  },
  {
    name: "Realme",
    short: "R",
    models: [
      "Realme Number Series",
      "Realme Narzo Series",
      "Realme C Series",
      "Realme P Series",
      "Realme GT Series",
      "Realme Note Series",
    ],
  },
  {
    name: "Motorola",
    short: "M",
    models: [
      "Motorola Edge Series",
      "Motorola Razr Series",
      "Moto G Series",
      "Moto E Series",
      "Moto G Play Series",
    ],
  },
  {
    name: "Nothing",
    short: "N",
    models: [
      "Nothing Phone Series",
      "Nothing Phone (a) Series",
      "CMF Phone Series",
    ],
  },
  {
    name: "Google Pixel",
    short: "G",
    models: [
      "Google Pixel 10",
      "Google Pixel 10 Pro",
      "Google Pixel 10 Pro XL",
      "Google Pixel 9",
      "Google Pixel 9 Pro",
      "Google Pixel 9 Pro XL",
      "Google Pixel 8",
      "Google Pixel 8 Pro",
      "Google Pixel 7",
      "Google Pixel 7 Pro",
      "Google Pixel 6",
      "Google Pixel 6 Pro",
    ],
  },
];

function MobileCases({ onBack }) {
  const [selectedBrand, setSelectedBrand] = useState(phoneBrands[0].name);
  const [selectedModel, setSelectedModel] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  const activeBrand = phoneBrands.find(
    (brand) => brand.name === selectedBrand
  );

  const filteredModels = useMemo(() => {
    if (!activeBrand) return [];

    return activeBrand.models.filter((model) =>
      model.toLowerCase().includes(modelSearch.trim().toLowerCase())
    );
  }, [activeBrand, modelSearch]);

  const selectBrand = (brandName) => {
    setSelectedBrand(brandName);
    setSelectedModel("");
    setModelSearch("");
  };

  const checkAvailability = () => {
    if (!selectedModel) return;

    const message =
      `Hello Batra Mobile Accessories! I want to check mobile cover availability.\n\n` +
      `Phone brand: ${selectedBrand}\n` +
      `Phone model: ${selectedModel}\n\n` +
      `Please share available designs and prices.`;

    // Replace with the shop's actual WhatsApp number.
    const whatsappNumber = "91XXXXXXXXXX";

    if (whatsappNumber.includes("X")) {
      window.alert(
        "Please add the shop's actual WhatsApp number in MobileCases.jsx first."
      );
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

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
            Choose your phone brand and model to explore matching covers.
          </p>
        </div>

        <button
          type="button"
          className="mc-show-all"
          onClick={() => selectBrand(phoneBrands[0].name)}
        >
          Show all <span>→</span>
        </button>
      </div>

      <div className="mc-layout">
        <aside className="mc-sidebar">
          <div className="mc-sidebar-heading">
            <span>PHONE BRANDS</span>
            <span>{phoneBrands.length} brands</span>
          </div>

          <div className="mc-brand-list">
            {phoneBrands.map((brand) => (
              <button
                type="button"
                key={brand.name}
                className={`mc-brand-item ${
                  selectedBrand === brand.name ? "mc-brand-active" : ""
                }`}
                onClick={() => selectBrand(brand.name)}
              >
                <span className="mc-brand-letter">{brand.short}</span>
                <span className="mc-brand-name">{brand.name}</span>
                <span className="mc-chevron">›</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="mc-model-panel">
          <div className="mc-model-heading">
            <div>
              <span className="mc-eyebrow">SELECT PHONE MODEL</span>
              <h2>{selectedBrand}</h2>
              <p>
                Choose a model or series to explore matching covers.
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

          <label className="mc-model-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search phone model or series..."
              value={modelSearch}
              onChange={(event) => setModelSearch(event.target.value)}
              aria-label="Search phone models"
            />
          </label>

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
              <p>Try a different search or select another brand.</p>
              <button
                type="button"
                className="mc-reset-button"
                onClick={() => setModelSearch("")}
              >
                Show all models
              </button>
            </div>
          )}

          <div className="mc-bottom-note">
            {selectedModel ? (
              <div className="mc-selected-info">
                <div>
                  <strong>{selectedModel}</strong>
                  <p>
                    Selected model. Confirm cover availability and prices
                    with the shop.
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
                Can't find your model? Contact the shop to check
                availability.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileCases;

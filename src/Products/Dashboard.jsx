import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const number = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value) || 0);

const firstValue = (object, keys, fallback = 0) => {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) return object[key];
  }
  return fallback;
};

const statusClass = (value) => {
  const status = String(value || "pending").toLowerCase().replace(/\s+/g, "-");
  return `ad-status ad-status-${status}`;
};

export default function Dashboard({ adminToken, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadDashboard = useCallback(async () => {
    if (!adminToken) {
      setError("Admin session is missing. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error("Your admin session has expired. Please log in again.");
      }
      if (!response.ok) {
        throw new Error(data.message || "Could not load dashboard data.");
      }

      setDashboard(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = dashboard?.stats || {};
  const orders = Array.isArray(dashboard?.recentOrders) ? dashboard.recentOrders : [];
  const bestSellers = Array.isArray(dashboard?.bestSellers) ? dashboard.bestSellers : [];

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const status = String(order.status || order.orderStatus || "pending").toLowerCase();
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const searchable = [
        order.orderId,
        order._id,
        order.id,
        order.customerName,
        order.name,
        order.email,
        order.phone,
        order.productName,
        order.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [orders, search, statusFilter]);

  const metricCards = [
    {
      label: "Total Revenue",
      value: money(firstValue(stats, ["totalRevenue", "revenue", "totalSales"])),
      icon: "₹",
      note: "Total recorded order revenue",
    },
    {
      label: "Total Income / Profit",
      value: money(firstValue(stats, ["totalProfit", "profit", "income"])),
      icon: "↗",
      note: "Based on figures provided by your API",
    },
    {
      label: "Total Sales",
      value: number(firstValue(stats, ["totalSalesCount", "salesCount", "totalOrders", "ordersCount"])),
      icon: "▤",
      note: "Orders or sales reported by backend",
    },
    {
      label: "Units Sold",
      value: number(firstValue(stats, ["unitsSold", "totalUnitsSold", "totalQuantity"])),
      icon: "▣",
      note: "Total product units reported",
    },
    {
      label: "Pending Orders",
      value: number(firstValue(stats, ["pendingOrders", "pendingOrderCount"])),
      icon: "◷",
      note: "Orders awaiting processing",
    },
    {
      label: "Completed Orders",
      value: number(firstValue(stats, ["completedOrders", "deliveredOrders", "completedOrderCount"])),
      icon: "✓",
      note: "Completed orders reported by backend",
    },
    {
      label: "New Orders",
      value: number(firstValue(stats, ["newOrders", "newOrderCount"])),
      icon: "＋",
      note: "New orders reported by backend",
    },
    {
      label: "Paid Payments",
      value: number(firstValue(stats, ["paidPayments", "paidOrders", "successfulPayments"])),
      icon: "₹",
      note: "Successful payments reported by backend",
    },
    {
      label: "Best Seller",
      value: bestSellers[0]?.name || bestSellers[0]?.productName || "—",
      icon: "★",
      note: "Top product reported by backend",
    },
  ];

  if (loading) {
    return (
      <main className="ad-dashboard">
        <div className="ad-state-card">
          <h2>Loading Dashboard…</h2>
          <p>Please wait while your store data is being fetched.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ad-dashboard">
        <div className="ad-state-card ad-error">
          <h2>Dashboard Could Not Load</h2>
          <p>{error}</p>
          <button className="ad-button" type="button" onClick={loadDashboard}>
            Try Again
          </button>
          {error.toLowerCase().includes("session") && (
            <button className="ad-button ad-button-light" type="button" onClick={onLogout}>
              Log In Again
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="ad-dashboard">
      <header className="ad-dashboard-heading">
        <div>
          <span className="ad-eyebrow">BATRA MOBILE ACCESSORIES</span>
          <h1>Admin Dashboard</h1>
          <p>Store performance, payments and recent orders at a glance.</p>
        </div>
        <div>
          <button className="ad-button ad-button-light" type="button" onClick={loadDashboard}>
            ↻ Refresh
          </button>
          <button className="ad-button" type="button" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      <section className="ad-section">
        <h2>Store Overview</h2>
        <div className="ad-metric-grid">
          {metricCards.map((metric) => (
            <article className="ad-metric-card" key={metric.label}>
              <div className="ad-metric-top">
                <span>{metric.label}</span>
                <span className="ad-metric-icon" aria-hidden="true">{metric.icon}</span>
              </div>
              <strong className="ad-metric-value">{metric.value}</strong>
              <span className="ad-metric-note">{metric.note}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="ad-section">
        <div className="ad-orders-heading">
          <div>
            <h2>Recent Orders</h2>
            <p>Search orders or filter them by status.</p>
          </div>
          <span className="ad-order-count">{visibleOrders.length} orders</span>
        </div>

        <div className="ad-order-filters">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer, email or phone…"
            aria-label="Search orders"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter orders by status"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="ad-table-wrap">
          <table className="ad-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.length ? (
                visibleOrders.map((order, index) => {
                  const orderId = order.orderId || order._id || order.id || `Order ${index + 1}`;
                  const customer = order.customerName || order.name || order.customer?.name || "Customer";
                  const product =
                    order.productName ||
                    order.product?.name ||
                    (Array.isArray(order.items)
                      ? order.items
                          .map((item) => item.name || item.productName)
                          .filter(Boolean)
                          .join(", ")
                      : "") ||
                    "—";
                  const dateValue = order.createdAt || order.date || order.orderDate;
                  const date = dateValue ? new Date(dateValue).toLocaleDateString("en-IN") : "—";
                  const amount = firstValue(order, ["totalAmount", "amount", "total", "grandTotal"], 0);
                  const payment = order.paymentStatus || order.paymentMethod || "—";
                  const status = order.status || order.orderStatus || "Pending";

                  return (
                    <tr key={String(orderId)}>
                      <td>{String(orderId).slice(-12)}</td>
                      <td>
                        {customer}
                        <br />
                        {order.email || order.customer?.email || ""}
                      </td>
                      <td className="ad-product-cell">{product}</td>
                      <td>{date}</td>
                      <td>{money(amount)}</td>
                      <td>{payment}</td>
                      <td>
                        <span className={statusClass(status)}>{status}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="ad-empty-orders" colSpan="7">
                    {orders.length
                      ? "No orders match your search/filter."
                      : "No recent orders were returned by the server."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="ad-dashboard-footnote">
        Dashboard figures are displayed from your backend response. Ensure
        <code> /api/admin/dashboard </code> returns <code>stats</code>,
        <code> recentOrders</code> and <code>bestSellers</code> for the figures to be populated.
      </p>
    </main>
  );
}

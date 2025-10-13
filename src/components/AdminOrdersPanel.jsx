import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminOrdersPanel.css";

const AdminOrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const [editingOrderId, setEditingOrderId] = useState(null); // ID ordine in modifica
  const [selectedStatus, setSelectedStatus] = useState({}); // stato scelto per ciascun ordine

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/order/all")
      .then((res) => {
        console.log("📦 Ordini ricevuti:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error("Errore nel caricamento ordini:", err));
  }, []);

  const handleStatusChange = (orderId, value) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleStatusUpdate = (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) {
      alert("Seleziona uno stato prima di aggiornare.");
      return;
    }

    axios
      .put(`http://localhost:8080/api/admin/order/update/${orderId}`, { status: newStatus })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        setEditingOrderId(null);
        alert(`✅ Stato dell’ordine ${orderId} aggiornato a ${newStatus}`);
      })
      .catch((err) =>  console.error("Errore nell'aggiornamento stato ordine:", err.response || err.message));
  };

  if (!user || user.role !== "ROLE_ADMIN") {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Accesso negato ❌</h2>;
  }

  const statusOptions = ["IN_ELABORAZIONE", "SPEDITO", "CONSEGNATO", "ANNULLATO"];

  return (
    <div className="orders-container">
      <h1>📦 Gestione Ordini</h1>

      {orders.length === 0 ? (
        <p className="no-orders">Nessun ordine trovato.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Ordine</th>
              <th>Utente</th>
              <th>Data</th>
              <th>Totale (€)</th>
              <th>Prodotti</th>
              <th>Status</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.user?.username || "—"}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.totalPrice?.toFixed(2)}</td>
                <td>
                  {order.orderItemsId && order.orderItemsId.length > 0 ? (
                    <ul className="order-items-list">
                      {order.orderItemsId.map((item) => (
                        <li key={item.idOrderItem}>
                          {item.product?.prodName} × {item.quantity} — €{item.price?.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Nessun prodotto"
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {editingOrderId === order.orderId ? (
                    <div className="status-edit-container">
                      <select
                        className="status-select"
                        value={selectedStatus[order.orderId] || order.status}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        className="update-status-btn"
                        onClick={() => handleStatusUpdate(order.orderId)}
                      >
                        Aggiorna
                      </button>
                    </div>
                  ) : (
                    <button
                      className="change-status-btn"
                      onClick={() => setEditingOrderId(order.orderId)}
                    >
                      Cambia stato
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrdersPanel;

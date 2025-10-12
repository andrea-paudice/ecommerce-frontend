import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminOrdersPanel.css";

const AdminOrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/order/all")
      .then((res) => {
        console.log("📦 Ordini ricevuti:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error("Errore nel caricamento ordini:", err));
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`http://localhost:8080/api/admin/update/${orderId}`, { status: newStatus })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((err) => console.error("Errore nell'aggiornamento stato ordine:", err));
  };

  if (!user || user.role !== "ROLE_ADMIN") {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Accesso negato ❌</h2>;
  }

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrdersPanel;

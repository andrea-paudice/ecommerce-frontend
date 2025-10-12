import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AdminProductsPanel.css";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | deleted
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Carica tutti i prodotti (attivi + disattivi)
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/public/product/all")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Errore nel caricamento prodotti:", err));
  }, []);

  // 🔹 Soft delete
  const handleDeactivate = (id) => {
    if (window.confirm("Vuoi disattivare questo prodotto?")) {
      axios
        .put(`http://localhost:8080/products/soft-delete/${id}`)
        .then(() => {
          setProducts((prev) =>
            prev.map((p) =>
              p.prodId === id ? { ...p, deleted: true } : p
            )
          );
        })
        .catch((err) => console.error("Errore nella disattivazione:", err));
    }
  };

  // 🔹 Riattiva
  const handleActivate = (id) => {
    if (window.confirm("Vuoi riattivare questo prodotto?")) {
      axios
        .put(`http://localhost:8080/products/reactivate/${id}`)
        .then(() => {
          setProducts((prev) =>
            prev.map((p) =>
              p.prodId === id ? { ...p, deleted: false } : p
            )
          );
        })
        .catch((err) => console.error("Errore nella riattivazione:", err));
    }
  };

  // 🔹 Filtro prodotti in base al toggle
  const filteredProducts = products.filter((p) => {
    if (filter === "active") return !p.deleted;
    if (filter === "deleted") return p.deleted;
    return true; // all
  });

  // 🔹 Solo admin
  if (!user || user.role !== "ROLE_ADMIN") {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Accesso negato ❌
      </h2>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🧩 Pannello Amministratore</h1>
        <div className="admin-actions">
          <button className="add-btn" onClick={() => navigate("/admin/orders")}>
            Pannello ordini
          </button>
          <button className="add-btn" onClick={() => navigate("/add-product")}>
            ➕ Aggiungi nuovo prodotto
          </button>
          <div className="filter-group">
            <label>Filtra: </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tutti</option>
              <option value="active">Attivi</option>
              <option value="deleted">Disattivati</option>
            </select>
          </div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Prezzo (€)</th>
            <th>Brand</th>
            <th>Categoria</th>
            <th>Quantità</th>
            <th>Disponibile</th>
            <th>Disattivato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <tr
                key={prod.prodId}
                className={prod.deleted ? "deleted-row" : ""}
              >
                <td>{prod.prodId}</td>
                <td>{prod.prodName}</td>
                <td>{prod.price}</td>
                <td>{prod.brand}</td>
                <td>{prod.category}</td>
                <td>{prod.quantity}</td>
                <td>{prod.available ? "✅" : "❌"}</td>
                <td>{prod.deleted ? "🟥 Sì" : "🟩 No"}</td>
                <td>
                  {!prod.deleted ? (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit-product/${prod.prodId}`)}
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeactivate(prod.prodId)}
                      >
                        🚫 Disattiva
                      </button>
                    </>
                  ) : (
                    <button
                      className="activate-btn"
                      onClick={() => handleActivate(prod.prodId)}
                    >
                      🔄 Riattiva
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Nessun prodotto trovato.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;

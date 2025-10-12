import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      </div>

      
        <div className="admin-actions">
          <button className="panel-button" onClick={() => navigate("/admin/products")}>
            Prodotti
          </button>
          <button className="panel-button" onClick={() => navigate("/admin/orders")}>
            Ordini
          </button>
        </div>
        
      
    </div>
  );
};

export default AdminPanel;

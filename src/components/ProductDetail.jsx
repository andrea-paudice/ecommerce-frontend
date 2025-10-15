import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ otteniamo utente e token
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/public/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Errore nel caricamento prodotto:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Devi effettuare il login per aggiungere un prodotto al carrello.");
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .post(`http://localhost:8080/api/user/add/${product.prodId}`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        alert("Prodotto aggiunto al carrello!");
      })
      .catch((err) => {
        console.error("Errore nell'aggiunta al carrello:", err);
        alert("Errore: impossibile aggiungere al carrello.");
      })
      .finally(() => setLoading(false));
  };

  if (!product) return <p style={{ textAlign: "center" }}>Caricamento...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-box">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.prodName} />
          ) : (
            <div className="product-no-image">Nessuna immagine</div>
          )}
        </div>

        <div className="product-detail-info">
          <h2>{product.prodName}</h2>
          <p><b>Brand:</b> {product.brand}</p>
          <p><b>Categoria:</b> {product.category}</p>
          <p>
            <b>Prezzo:</b>{" "}
            <span className="product-price">{product.price} €</span>
          </p>
          <p><b>Quantità:</b> {product.quantity}</p>
          <p>
            <b>Disponibilità:</b>{" "}
            <span className={product.available ? "available" : "unavailable"}>
              {product.available ? "Disponibile" : "Non disponibile"}
            </span>
          </p>
          <p><b>Descrizione:</b><br />{product.prodDescription}</p>

          <div className="button-group">
            <button className="back-button" onClick={() => navigate("/")}>
              ⬅️ Torna alla Home
            </button>

            {/* ✅ Bottone aggiungi al carrello */}
            <button
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={loading || !product.available}
            >
              {loading ? "⏳ Aggiungo..." : "🛒 Aggiungi al Carrello"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/public/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Errore nel caricamento prodotto:", err));
  }, [id]);

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

          <button className="back-button" onClick={() => navigate("/")}>
            ⬅️ Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

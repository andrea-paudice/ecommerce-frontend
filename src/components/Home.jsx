import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate , useLocation} from "react-router-dom";
import "./Home.css"; // 👈 importa il CSS

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/public/product/allFiltered")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Errore nel caricamento dei prodotti:", error));
  }, [location]);

  return (
    <div className="home-container">
      <h2 className="home-title">Catalogo Prodotti</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.prodId} className="product-card">
            <img alt={p.prodName} src={p.imageUrl} className="product-image" />
            <h3 className="product-name">{p.prodName}</h3>
            <p className="product-info">
              <b>Prezzo:</b> {p.price} €
            </p>
            <p className="product-info">
              <b>Brand:</b> {p.brand}
            </p>
            <p className="product-info">
              <b>Disponibilità:</b> {p.available ? "Disponibile" : "Non disponibile"}
            </p>
            <button
              className="product-button"
              onClick={() => navigate(`/product/${p.prodId}`)}
            >
              Dettagli
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

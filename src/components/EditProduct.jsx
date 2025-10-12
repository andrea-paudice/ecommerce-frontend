import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    prodName: "",
    price: "",
    brand: "",
    category: "",
    prodDescription: "",
    quantity: "",
    available: false,
    imageUrl: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/public/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Errore nel caricamento prodotto:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/admin/product/update/${id}`, product)
      .then(() => {
        alert("Prodotto aggiornato con successo!");
        navigate("/admin");
      })
      .catch((err) => console.error("Errore nell'aggiornamento:", err));
  };

  return (
    <div className="edit-container">
      <h2>✏️ Modifica Prodotto</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Nome:</label>
        <input
          type="text"
          name="prodName"
          value={product.prodName}
          onChange={handleChange}
          required
        />

        <label>Prezzo (€):</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Brand:</label>
        <input
          type="text"
          name="brand"
          value={product.brand}
          onChange={handleChange}
        />

        <label>Categoria:</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
        />

        <label>Descrizione:</label>
        <textarea
          name="prodDescription"
          value={product.prodDescription}
          onChange={handleChange}
        ></textarea>

        <label>Quantità:</label>
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          required
        />

        <label>Disponibile:</label>
        <input
          type="checkbox"
          name="available"
          checked={product.available}
          onChange={handleChange}
        />

        <label>URL Immagine:</label>
        <input
          type="text"
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
        />

        <button type="submit" className="save-btn">
          💾 Salva Modifiche
        </button>
        <button className="back-button" onClick={() => navigate("/admin")}>
            ⬅️ Torna indietro
          </button>
      </form>
    </div>
  );
};

export default EditProduct;

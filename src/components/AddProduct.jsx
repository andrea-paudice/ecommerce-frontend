import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    prodName: "",
    price: "",
    brand: "",
    prodDescription: "",
    category: "",
    releaseDate: "",
    available: true,
    quantity: "",
    image: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product)

    axios
      .post("http://localhost:8080/products/add", product)
      .then(() => {
        alert("✅ Prodotto aggiunto con successo!");
        navigate("/admin");
      })
      .catch((err) => {
        console.error("Errore durante l'aggiunta del prodotto:", err);
        alert("❌ Errore durante l'aggiunta del prodotto.");
      });
  };

  return (
    <div className="add-product-container">
      <h2>🆕 Aggiungi un nuovo prodotto</h2>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <label>Nome Prodotto:</label>
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
          required
        />

        <label>Descrizione:</label>
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />

        <label>Categoria:</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        />

        <label>Data di rilascio:</label>
        <input
          type="date"
          name="releaseDate"
          value={product.releaseDate}
          onChange={handleChange}
          required
        />

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
          placeholder="https://..."
        />

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            ➕ Aggiungi
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin")}
          >
            🔙 Annulla
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./CartPage.css";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carica il carrello dell'utente
  useEffect(() => {
    if (user) {
      axios.get("http://localhost:8080/api/user/mycart", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(res => setCart(res.data))
      .catch(err => console.error("Errore nel caricamento del carrello:", err))
      .finally(() => setLoading(false));
    }
  }, [user]);

  const handleRemove = (idCartItem) => {
    axios.delete(`http://localhost:8080/api/user/remove/${idCartItem}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then(res => {
      alert("Prodotto rimosso dal carrello!");
      setCart(prev => ({
        ...prev,
        cartItems: prev.cartItems.filter(item => item.idCartItem !== idCartItem)
      }));
    })
    .catch(err => console.error("Errore nella rimozione:", err));
  };

  const handleClearCart = () => {
    axios.delete("http://localhost:8080/api/clear", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then(() => {
      alert("Carrello svuotato!");
      setCart(prev => ({ ...prev, cartItems: [] }));
    })
    .catch(err => console.error("Errore nello svuotamento:", err));
  };

  if (loading) return <p>Caricamento carrello...</p>;
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return <p>Il tuo carrello è vuoto 😢</p>;
  }

  const total = cart.cartItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Il tuo Carrello</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Prodotto</th>
            <th>Prezzo</th>
            <th>Marca</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.cartItems.map((item) => (
            <tr key={item.idCartItem}>
              <td>{item.product.prodName}</td>
              <td>{item.product.price} €</td>
              <td>{item.product.brand}</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.idCartItem)}
                >
                  Rimuovi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="cart-total">Totale: {total.toFixed(2)} €</h3>

      <button className="clear-btn" onClick={handleClearCart}>
        Svuota Carrello
      </button>
    </div>
  );
};

export default CartPage;

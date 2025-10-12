import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🏮 MangaShop</Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>

          {/* Solo admin può vedere questi */}
          {user?.role === "ROLE_ADMIN" && (
            <>
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            </>
          )}

          {/* Se loggato mostra Logout, altrimenti Login */}
          {user ? (
            <button onClick={logout} className="nav-link logout-btn">
              Logout ({user.username})
            </button>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

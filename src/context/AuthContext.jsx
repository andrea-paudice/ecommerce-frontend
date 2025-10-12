import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, role }

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
            }
        } catch (err) {
            console.error("Errore nel parsing dell'utente salvato:", err);
            localStorage.removeItem("user");
        }
    }, []);

    const login = (userData) => {
        if (!userData.role) {
            console.warn("Ruolo mancante nell'oggetto utente");
        }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

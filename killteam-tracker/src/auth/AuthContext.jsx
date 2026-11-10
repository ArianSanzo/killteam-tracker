import { useEffect, useState } from "react";
import { AuthContext } from "./context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "killteam-tracker-token";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const handleUnauthorized = () => {
            if (active) setUser(null);
        };
        window.addEventListener("killteam:unauthorized", handleUnauthorized);

        const restoreSession = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                if (active) setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const currentUser = await response.json();
                if (!response.ok) {
                    if (response.status === 401) localStorage.removeItem(TOKEN_KEY);
                    throw new Error(currentUser.message || "No se pudo recuperar la sesión.");
                }
                if (active) setUser(currentUser);
            } catch (error) {
                if (active) setUser(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        restoreSession();
        return () => {
            active = false;
            window.removeEventListener("killteam:unauthorized", handleUnauthorized);
        };
    }, []);

    const login = async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "No se pudo iniciar sesión.");
        localStorage.setItem(TOKEN_KEY, result.token);
        setUser(result.user);
        return result.user;
    };

    const register = async (details) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(details),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "No se pudo registrar la cuenta.");
        localStorage.setItem(TOKEN_KEY, result.token);
        setUser(result.user);
        return result.user;
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    };

    const value = { user, loading, login, register, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


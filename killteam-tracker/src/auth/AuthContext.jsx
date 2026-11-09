import { useCallback, useEffect, useMemo, useState } from "react";
import { apiJson, clearToken, getToken, saveToken } from "../api/client";
import { AuthContext } from "./context";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            if (!getToken()) {
                if (active) setLoading(false);
                return;
            }

            try {
                const currentUser = await apiJson("/auth/me");
                if (active) setUser(currentUser);
            } catch (error) {
                if (error.status === 401) clearToken();
                if (active) setUser(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        restoreSession();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => setUser(null);
        window.addEventListener("killteam:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("killteam:unauthorized", handleUnauthorized);
    }, []);

    const login = useCallback(async (credentials) => {
        const result = await apiJson("/auth/login", {
            method: "POST",
            authenticated: false,
            body: JSON.stringify(credentials),
        });
        saveToken(result.token);
        setUser(result.user);
        return result.user;
    }, []);

    const register = useCallback(async (details) => {
        const result = await apiJson("/auth/register", {
            method: "POST",
            authenticated: false,
            body: JSON.stringify(details),
        });
        saveToken(result.token);
        setUser(result.user);
        return result.user;
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


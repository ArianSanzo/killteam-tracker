const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "killteam-tracker-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch(path, options = {}) {
    const { authenticated = true, ...fetchOptions } = options;
    const headers = { ...fetchOptions.headers };
    const token = getToken();

    if (fetchOptions.body && !headers["Content-Type"] && !headers["content-type"]) {
        headers["Content-Type"] = "application/json";
    }
    if (authenticated && token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
    if (response.status === 401 && token) {
        clearToken();
        window.dispatchEvent(new Event("killteam:unauthorized"));
    }
    return response;
}

export async function apiJson(path, options = {}) {
    const response = await apiFetch(path, options);
    const text = await response.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }
    if (!response.ok) {
        const error = new Error(data?.message || "La solicitud no pudo completarse.");
        error.status = response.status;
        throw error;
    }
    return data;
}

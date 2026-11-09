import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./useAuth";

const LoadingSession = () => <p role="status">Comprobando sesión…</p>;

export function RequireAuth() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <LoadingSession />;
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}

export function GuestOnly() {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSession />;
    return user ? <Navigate to="/" replace /> : <Outlet />;
}

export function RequireRole({ roles }) {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSession />;
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.roleKey)) return <Navigate to="/" replace />;
    return <Outlet />;
}

import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import { GuestOnly, RequireAuth } from "./auth/RouteGuards";
import Home from "./pages/Home";
import Login from "./components/Login";
import AddUser from "./components/user/AddUser";

function AppRoutes() {
    const { register } = useAuth();

    return (
        <Routes>
            <Route element={<GuestOnly />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<AddUser onUserAdded={register} />} />
            </Route>
            <Route element={<RequireAuth />}>
                <Route path="/*" element={<Home />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

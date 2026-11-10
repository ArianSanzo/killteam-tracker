import { Routes, Route, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import OptionsModule from "../components/homeModules/OptionsModule"
import AddMatchModule from "../components/homeModules/AddMatchModule"
import MatchDetailModule from "../components/homeModules/MatchDetailModule";
import HistoryModule from "../components/homeModules/HistoryModule";
import AdminCatalogModule from "../components/homeModules/AdminCatalogModule";
import AdminUsersModule from "../components/homeModules/AdminUsersModule";
import { RequireRole } from "../auth/RouteGuards";
import ThemeToggle from "../theme/ThemeToggle";
const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const canAdmin = ["admin", "superadmin"].includes(user?.roleKey);
    return (
        <div className="app-shell">
            <header className="app-header">
                <button className="brand" type="button" onClick={() => navigate("/")} aria-label="Kill Team Tracker, inicio">
                    <span className="brand-mark">KT</span>
                    <span><span className="brand-title">KILL TEAM</span><span className="brand-subtitle">Battle tracker</span></span>
                </button>
                <div className="header-account">
                    <span className="account-name">{user?.name} · {user?.role}</span>
                    <ThemeToggle />
                    <button className="button-quiet icon-button" type="button" onClick={() => { logout(); navigate("/login", { replace: true }); }}>Salir</button>
                </div>
            </header>
            <nav className="global-nav" aria-label="Navegación principal">
                <button className="global-nav-item" type="button" onClick={() => navigate("/")}>Inicio</button>
                <button className="global-nav-item" type="button" onClick={() => navigate("/addMatch")}>Nueva partida</button>
                <button className="global-nav-item" type="button" onClick={() => navigate("/history")}>Historial</button>
                {canAdmin && <button className="global-nav-item" type="button" onClick={() => navigate("/admin/catalogs")}>Catálogos</button>}
                {user?.roleKey === "superadmin" && <button className="global-nav-item" type="button" onClick={() => navigate("/admin/users")}>Usuarios</button>}
            </nav>
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<OptionsModule />} />
                    <Route path="/addMatch" element={<AddMatchModule />} />
                    <Route path="/matches/:matchId" element={<MatchDetailModule />} />
                    <Route path="/history" element={<HistoryModule />} />
                    <Route element={<RequireRole roles={["admin", "superadmin"]} />}>
                        <Route path="/admin/catalogs" element={<AdminCatalogModule />} />
                    </Route>
                    <Route element={<RequireRole roles={["superadmin"]} />}>
                        <Route path="/admin/users" element={<AdminUsersModule />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )
}

export default Home;

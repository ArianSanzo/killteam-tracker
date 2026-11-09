import { Routes, Route } from "react-router";
import OptionsModule from "../components/homeModules/OptionsModule"
import AddMatchModule from "../components/homeModules/AddMatchModule"
import MatchDetailModule from "../components/homeModules/MatchDetailModule";
import HistoryModule from "../components/homeModules/HistoryModule";
import AdminCatalogModule from "../components/homeModules/AdminCatalogModule";
import AdminUsersModule from "../components/homeModules/AdminUsersModule";
import { RequireRole } from "../auth/RouteGuards";
const Home = () => {
    return (
        <div>
            <h1>KillTeam App</h1>
            <Routes>
                <Route path="/" element={ <OptionsModule/> }/>
                <Route path="/addMatch" element={ <AddMatchModule /> }/>
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
    )
}

export default Home;

import { Routes, Route, useNavigate } from "react-router";
import OptionsModule from "../components/homeModules/OptionsModule"
import AddMatchModule from "../components/homeModules/AddMatchModule"
const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>KillTeam App</h1>
            <Routes>
                <Route path="/" element={ <OptionsModule/> }/>
                <Route path="/addMatch" element={ <AddMatchModule /> }/>
            </Routes>        
        </div>  
    )
}

export default Home;
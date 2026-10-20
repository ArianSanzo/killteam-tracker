
import './App.css';
import Dashboard from './pages/Dashboard';
import AddWeapon from './components/forms/WeaponsForms';
import AddWRules from './components/forms/WRulesForms';

function App() {
    const handleWeaponAdded = (weapon) => {
        console.log("Arma agregada:", weapon);
    };

    const handleWRulesAdded = (wRule) => {
        console.log("Regla de arma agregada:", wRule);
    };

    return (
        <>
            <Dashboard />

            <AddWeapon onWeaponAdded={handleWeaponAdded} />

            <AddWRules onWRulesAdded={handleWRulesAdded} />
        </>
    );
}

export default App;

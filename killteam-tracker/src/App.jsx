
import './App.css';
import Dashboard from './pages/Dashboard';
import AddWeapon from './components/forms/WeaponsForms';

function App() {
    const handleWeaponAdded = (weapon) => {
        console.log("Arma agregada:", weapon);
    };

    return (
        <>
            <Dashboard />
            <AddWeapon onWeaponAdded={handleWeaponAdded} />
        </>
    );
}

export default App;
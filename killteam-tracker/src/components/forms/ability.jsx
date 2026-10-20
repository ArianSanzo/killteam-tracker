import { useState } from "react";
import { useNavigate } from "react-router";
export default function AddAbility({ onAbilityAdded }) {
  const [ability, setAbility] = useState("");
  

  const navigate = useNavigate();

  const handleChangeAbility= (e) => {
    setAbility(e.target.value);
  };
  

  const handleAddAbility = (event) => {
    event.preventDefault();
    const ability = {
      
      ability,


    };
    onAbilityAdded(ability);
    setAbility("");
    
  };
  return (
    <section>
      <h2>Agregar habilidad</h2>

      <form onSubmit={handleAddAbility}>
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 m-2"
          type="text"
          placeholder="texto de habilidad"
          onChange={handleChangeability}
          value={text}
        ></input>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-300">
            Agregar Abilidad
          </button>
          <button
            type="button"
            className="bg-red-300"
            onClick={() => navigate("/dashboard", { replace: true })}
          >
            Cancelar operacion/volver
          </button>
        </div>
      </form>
    </section>
  );
}
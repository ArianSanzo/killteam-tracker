import "./TeamPanel.css";
function TeamPanel(){
    const operatives = [
    {
      id: 1,
      name: "Ravener prime",
      wounds: 21,
      movement: 7,
      attacks: 4,
      save: "5+",
    },
    {
      id: 2,
      name: "Ravener Tremorscythe",
      wounds: 20,
      movement: 7,
      attacks: 4,
      save: "5+",
    },
  ];
return(
    <section className="panel">
        <header className="roaster_head">
            <img src="" alt="" className="raveners img" />
            <h2>RAVENERS</h2>
            <p>tyranids</p>
        </header>
        <div className="operatives-list">
        <h3>Operativos</h3>

        {operatives.map((operative) => (
          <article className="operative-card" key={operative.id}>
            <h4>{operative.name}</h4>

            <p>Heridas: {operative.wounds}</p>
            <p>Movimiento: {operative.movement}</p>
            <p>Ataques: {operative.attacks}</p>
            <p>Salvación: {operative.save}</p>
          </article>
        ))}
      </div>
    </section>
);
}
export default TeamPanel;
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
    <section className="panel">
        <header className="roaster_head">
            <img src="" alt="" className="team_img" />
            <h2>RAVENERS</h2>
            <p>tyranids</p>
        </header>
      <div className="operatives-list">
        <div className="stats">
          <span>operativo</span>
          <span>W</span>
          <span>M</span>
          <span>A</span>
          <span>S</span>
        </div>
        {operatives.map((operative)=>(
          <article className="columna_op" key={operative.id}>
            <strong>{operative.name}</strong>
            <span>{operative.wounds}</span>
            <span>{operative.movement}</span>
            <span>{operative.attacks}</span>
            <span>{operative.save}</span>
          </article>
        ))}
      </div>
    </section>

}
export default TeamPanel;
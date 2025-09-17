import { useState } from "react";

export default function Pesquisa() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState([]);

  const buscar = () => {
    setRes([
      { id:1, ficha:"Ficha 2", disciplina:"Programação I", trecho:"Para declarar variável em C++: int x = 0; ..." },
      { id:2, ficha:"Ficha 1", disciplina:"Banco de Dados", trecho:"JOIN combina linhas de duas tabelas..." },
    ]);
  };

  return (
    <main className="container">
      <div className="hero" style={{marginBottom:18}}>
        <div>
          <h1>Pesquisa / Dúvidas</h1>
          <p>Digite sua dúvida e receba o trecho exato da ficha onde o assunto é explicado.</p>
          <div style={{display:"flex", gap:8}}>
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ex.: Como declarar variável em C++?" />
            <button className="btn" onClick={buscar}>Buscar</button>
          </div>
        </div>
        <div className="art">
          <img src="/img/search.png" alt="" />
        </div>
      </div>

      <div className="grid2">
        {res.map(r=>(
          <div key={r.id} className="card">
            <h3>{r.ficha} — {r.disciplina}</h3>
            <div className="excerpt">{r.trecho}</div>
            <a className="link" href="#">Ver na Ficha</a>
          </div>
        ))}
      </div>
    </main>
  );
}

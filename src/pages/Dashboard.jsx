export default function Dashboard() {
  return (
    <main className="container">
      <section className="hero">
        <div>
          <h1>Sistema de Apoio ao Estudante Académico</h1>
          <p>Centralize fichas, pesquise dúvidas e encontre rapidamente o trecho certo no material.</p>
          <div style={{display:"flex", gap:12, marginTop:10}}>
            <a className="btn" href="/pesquisa">Pesquisar Dúvidas</a>
            <a className="btn btn-outline" href="/entrar">Entrar</a>
          </div>
        </div>
        <div className="art">
          <img src="/img/hero.jpg" alt="Estudo e organização académica" />
        </div>
      </section>

      <section className="grid2" style={{ marginTop:18 }}>
        <div className="card">
          <h3>Como funciona</h3>
          <p>Docentes disponibilizam fichas das disciplinas. Estudantes pesquisam dúvidas em linguagem natural e recebem a
            indicação exata do trecho da ficha com a resposta.</p>
        </div>
        <div className="card">
          <h3>Atalhos</h3>
          <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
            <a className="btn" href="/cadastrar">Criar Conta</a>
            <a className="btn btn-outline" href="/ajuda">Ajuda</a>
          </div>
        </div>
      </section>
    </main>
  );
}

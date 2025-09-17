export default function Ajuda() {
  return (
    <main className="container">
      <div className="hero">
        <div>
          <h1>Ajuda / FAQ</h1>
          <p>Encontre respostas rápidas sobre login, cadastro, pesquisa de dúvidas e uso do sistema.</p>
        </div>
        <div className="art">
          <img src="/img/help.png" alt="" />
        </div>
      </div>

      <div className="grid2" style={{marginTop:18}}>
        <details className="card">
          <summary><b>Como faço login?</b></summary>
          <p>Clique em “Login” no topo, informe seu e-mail e senha cadastrados.</p>
        </details>
        <details className="card">
          <summary><b>Como pesquisar dúvidas?</b></summary>
          <p>Na página “Pesquisa”, digite sua dúvida e clique em “Buscar”.</p>
        </details>
        <details className="card">
          <summary><b>Como cadastrar uma conta?</b></summary>
          <p>Abra “Cadastro”, preencha os dados e selecione “Docente” ou “Estudante”.</p>
        </details>
        <details className="card">
          <summary><b>Quem envia as fichas?</b></summary>
          <p>Os Docentes fazem upload das fichas; estudantes consultam e pesquisam.</p>
        </details>
      </div>
    </main>
  );
}

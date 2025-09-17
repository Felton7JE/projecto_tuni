import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";  // vamos criar um css só para login

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`Login com ${email}`);
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={onSubmit}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Digite seu email"
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
            />
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="Digite sua senha"
              value={senha} 
              onChange={(e)=>setSenha(e.target.value)} 
              required 
            />
            <button type="submit">Entrar</button>
          </form>
          <p className="muted">
            Esqueceu sua senha? <a href="#">Recuperar</a>
          </p>
          <p className="muted">
            Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
          </p>
        </div>
        <div className="login-image">
          <img src="/img/login-bg.png" alt="Login Illustration" />
        </div>
      </div>
    </main>
  );
}

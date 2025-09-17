import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cadastro() {
  const nav = useNavigate();
  const [form, setForm] = useState({ nome:"", email:"", tipo:"", senha:"", confirmar:"" });
  const update = (k,v)=>setForm(s=>({...s,[k]:v}));

  const onSubmit = (e)=>{
    e.preventDefault();
    if(form.senha !== form.confirmar) return alert("As senhas não coincidem.");
    if(!form.tipo) return alert("Selecione o tipo de usuário.");
    alert(`Conta criada para ${form.nome} (${form.tipo}). Faça login.`);
    nav("/entrar");
  };

  return (
    <main className="auth-container">
      <form className="auth-card" onSubmit={onSubmit}>
        <div style={{textAlign:"center", marginBottom:12}}>
          <img src="/img/signup-illustration.png" alt="" style={{width:120, opacity:.9}} />
        </div>
        <h2>Cadastro</h2>
        <label>Nome Completo</label>
        <input value={form.nome} onChange={(e)=>update("nome", e.target.value)} required />
        <label>E-mail</label>
        <input type="email" value={form.email} onChange={(e)=>update("email", e.target.value)} required />
        <label>Tipo de Usuário</label>
        <select value={form.tipo} onChange={(e)=>update("tipo", e.target.value)} required>
          <option value="">Selecione...</option>
          <option value="docente">Docente</option>
          <option value="estudante">Estudante</option>
        </select>
        <label>Senha</label>
        <input type="password" value={form.senha} onChange={(e)=>update("senha", e.target.value)} required />
        <label>Confirmar Senha</label>
        <input type="password" value={form.confirmar} onChange={(e)=>update("confirmar", e.target.value)} required />
        <button className="btn" type="submit" style={{width:"100%", marginTop:8}}>Cadastrar-se</button>
        <div className="muted" style={{textAlign:"center"}}>Já tem conta? <Link to="/entrar">Login</Link></div>
      </form>
    </main>
  );
}

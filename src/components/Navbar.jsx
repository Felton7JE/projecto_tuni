import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <Link to="/" className="brand">SACADEMIC</Link>
      <nav className="nav-links">
        <NavLink to="/entrar">Login</NavLink>
        <NavLink to="/cadastrar">Cadastro</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/pesquisa">Pesquisa</NavLink>
        <NavLink to="/ajuda">Ajuda</NavLink>
      </nav>
    </header>
  );
}

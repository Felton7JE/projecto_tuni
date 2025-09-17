import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Pesquisa from "./pages/Pesquisa";
import Ajuda from "./pages/Ajuda";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/ajuda" element={<Ajuda />} />
      </Routes>
    </BrowserRouter>
  );
}

// src/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBook, FaPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="logo">PAINEL</h2>
      <ul>
        <li>
          <NavLink to="/" className="nav-link">
            <FaHome /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/disciplinas" className="nav-link">
            <FaBook /> Minhas Disciplinas
          </NavLink>
        </li>
        <li>
          <NavLink to="/adicionar" className="nav-link">
            <FaPlus /> Adicionar Ficha
          </NavLink>
        </li>
        <li>
          <NavLink to="/perfil" className="nav-link">
            <FaUser /> Perfil
          </NavLink>
        </li>
        <li>
          <NavLink to="/logout" className="nav-link">
            <FaSignOutAlt /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

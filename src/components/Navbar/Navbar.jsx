import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle, HiAcademicCap, HiMiniDocumentText, HiUsers, HiTicket, HiPencilSquare, HiRectangleGroup } from "react-icons/hi2";
import { ImExit } from "react-icons/im";

import { useAuth } from "../../context/AuthContext"; // Importa o AuthContext
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userRole, logout, isAuthenticated } = useAuth(); // Obtém a role e a função de logout do AuthContext

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container">
      {isAuthenticated && (
        <button
          className={`hamburger-menu ${isMenuOpen ? "hidden" : ""}`}
          onClick={toggleMenu}
        >
          ☰
        </button>
      )}

      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          ✖
        </button>
        <nav className="nav-links">
          <ul>
            {/* Links comuns a todos os usuários */}
            <li><Link to="/profile" onClick={toggleMenu}><HiUserCircle /> Meu Perfil</Link></li>
            <li><Link to="/meus-eventos" onClick={toggleMenu}><HiRectangleGroup /> Meus Eventos</Link></li>
            <li><Link to="/eventos-inscritos" onClick={toggleMenu}><HiTicket /> Eventos Inscritos</Link></li>
            <li><Link to="/criar-publicacao" onClick={toggleMenu}><HiPencilSquare /> Criar Publicação</Link></li>


            {/* Links específicos para ADMIN */}
            {userRole === "ADMIN" && (
              <>
                <li><Link to="/feed-managment" onClick={toggleMenu}><HiMiniDocumentText /> Solicitações de Publicações</Link></li>
                <li><Link to="/cursos" onClick={toggleMenu}><HiAcademicCap /> Gerenciar Cursos</Link></li>
                <li><Link to="/gerenciamento-usuarios" onClick={toggleMenu}><HiUsers /> Gerenciamento de Usuários</Link></li>
              </>
            )}

            {/* Links específicos para ORGANIZADOR */}
            {userRole === "ORGANIZADOR" && (
              <>
                <li><Link to="/feed-managment" onClick={toggleMenu}><HiMiniDocumentText /> Solicitações de Publicações</Link></li>
                <li><Link to="/gerenciamento-usuarios" onClick={toggleMenu}><HiUsers /> Gerenciamento de Representantes</Link></li>
              </>
            )}

            {/* Links específicos para ALUNO_REPRESENTANTE */}
            {userRole === "ALUNO_REPRESENTANTE" && (
              <>
                <li><Link to="/feed-managment" onClick={toggleMenu}><HiMiniDocumentText /> Solicitações de Publicações </Link></li>
              </>
            )}
                <li className="logout-button" onClick={() => { logout(); toggleMenu(); }}>
              <Link to="/"><ImExit /> Sair</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
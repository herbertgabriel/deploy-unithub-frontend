import "./Header.css";
import logo from "../../assets/logo.svg";
import Navbar from "../Navbar/Navbar";
import Button from "../Button/Button";
import ButtonTransparent from "../ButtonTransparent/ButtonTransparent";
import { Link } from "react-router-dom";
import Popup from "../Popup/Popup";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { isAuthenticated, showLogoutPopup, closeLogoutPopup } = useAuth();
  
  return (
    <header className="header-container">
      {showLogoutPopup && (
        <Popup
          title="Sessão Encerrada"
          message="Você foi deslogado devido à inatividade."
          onClose={closeLogoutPopup}
        />
      )}
      <div className="menu-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <nav>
          <ul>
            {isAuthenticated ? (
              <>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login?register=true">
                    <ButtonTransparent title={"Cadastrar"} />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault(); 
                      window.location.href = "/login"; 
                    }}
                  >
                    <Button title={"Login"} />
                  </Link>
                </li>
              </>
            )}
            <li className="hamburguer">
              <Navbar />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
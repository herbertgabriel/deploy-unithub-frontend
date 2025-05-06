import "./Footer.css";
import { FaInstagram } from "react-icons/fa";
import { LuFacebook } from "react-icons/lu";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer>

        <ul>
          <li>Termos de Serviço</li>
          <li>Política de Privacidade</li>
          <li>Ajuda</li>
        </ul>

        <ul className="icons">
          <li><FaInstagram /></li>
          <li><LuFacebook /></li>
          <li><FaLinkedinIn /></li>
        </ul>

    </footer>
  );
}

export default Footer;
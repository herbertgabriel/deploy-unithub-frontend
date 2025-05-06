import { useState } from "react";
import { sanitizeInput, validateLoginForm } from "../../../utils/validations";
import { httpStatusMessagesLogin } from "../../../utils/httpStatusMessages";
import Popup from "../../Popup/Popup";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
function LoginForm({ apiUrl, login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar o Popup
  const [popupData, setPopupData] = useState({ title: "", message: "" }); // Dados do Popup
  const [captchaValue, setCaptchaValue] = useState(null); // Valor do reCAPTCHA

  const handleLogin = async (e) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    const errorMessage = validateLoginForm(sanitizedEmail, sanitizedPassword);
    if (errorMessage) {
      setPopupData({ title: "Erro", message: errorMessage });
      setShowPopup(true);
      return;
    }

    if (!captchaValue) {
      setPopupData({ title: "Erro", message: "Por favor, complete o reCAPTCHA." });
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          recaptchaToken: captchaValue, // Envia o token do reCAPTCHA
        }),
      });

      if (!response.ok) {
        const errorMessage = httpStatusMessagesLogin[response.status] || "Erro desconhecido.";
        setPopupData({ title: "Erro", message: errorMessage });
        setShowPopup(true);
        return;
      }

      const data = await response.json();

      if (!data.accessToken || !data.role || !data.expiresIn) {
        throw new Error("Dados incompletos retornados pelo servidor.");
      }

      login(data.accessToken, data.role, data.expiresIn);

      setPopupData({
        title: "Sucesso",
        message: "Login realizado com sucesso!",
      });
      setShowPopup(true);
    } catch (err) {
      setPopupData({ title: "Erro", message: err.message });
      setShowPopup(true);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); // Atualiza o valor do reCAPTCHA
  };

  return (
    <>
      {showPopup && (
        <Popup
          title={popupData.title}
          message={popupData.message}
          onClose={() => setShowPopup(false)} // Fecha o Popup
        />
      )}
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange} 
            className="recaptcha" // Adiciona uma classe para estilização
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </>
  );
}

export default LoginForm;
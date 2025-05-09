import { useState, useEffect } from "react";
import { sanitizeInput, validateRecoverPasswordForm } from "../../../utils/validations";
import { httpStatusMessagesLogin } from "../../../utils/httpStatusMessages";
import Popup from "../../Popup/Popup";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function RecoverPasswordForm({ apiUrl, setPopupData, setIsRecoverPassword, setError }) {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar o Popup
  const [popupMessage, setPopupMessage] = useState(""); // Mensagem do Popup
  const [captchaValue, setCaptchaValue] = useState(null); // Valor do reCAPTCHA

  const handleRecoverPassword = async (e) => {
    e.preventDefault();

    // Verifica se já se passaram 5 minutos desde a última requisição
    const lastRequestTime = localStorage.getItem("recoverPasswordLastRequest");
    const now = Date.now();
    if (lastRequestTime && now - parseInt(lastRequestTime) < 5 * 60 * 1000) {
      setPopupMessage("Você já solicitou a recuperação de senha recentemente. Aguarde alguns minutos antes de tentar novamente.");
      setShowPopup(true);
      return;
    }

    const sanitizedEmail = sanitizeInput(email);

    const errorMessage = validateRecoverPasswordForm(sanitizedEmail);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (!captchaValue) {
      setPopupMessage("Por favor, complete o reCAPTCHA.");
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/recover-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sanitizedEmail, recaptchaToken: captchaValue }), // Envia o token do reCAPTCHA
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setPopupMessage("Email inválido");
        } else {
          setPopupMessage(httpStatusMessagesLogin[response.status] || "Erro ao recuperar senha.");
        }
        setShowPopup(true);
        return;
      }

      // Armazena o timestamp da requisição bem-sucedida no localStorage
      localStorage.setItem("recoverPasswordLastRequest", now);

      setPopupData({
        title: "Atenção",
        message: "Instruções para recuperação de senha enviadas para o email.",
        onClose: () => setIsRecoverPassword(false),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = (token) => {
    setCaptchaValue(token); // Atualiza o valor do reCAPTCHA
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <>
        {showPopup && (
          <Popup
            title={"Erro"}
            message={popupMessage}
            onClose={() => setShowPopup(false)}
          />
        )}
        <form onSubmit={handleRecoverPassword} className="recover-password-form">
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
            <GoogleReCaptcha
              onVerify={handleVerify} // Captura o token do reCAPTCHA
              className="recaptcha" // Adiciona uma classe para estilização
            />
          </div>
          <button type="submit">Recuperar Senha</button>
        </form>
      </>
    </GoogleReCaptchaProvider>
  );
}

export default RecoverPasswordForm;
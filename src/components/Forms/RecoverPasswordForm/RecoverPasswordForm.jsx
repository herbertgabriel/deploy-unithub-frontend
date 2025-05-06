import { useState } from "react";
import { sanitizeInput, validateRecoverPasswordForm } from "../../../utils/validations";
import { httpStatusMessagesLogin } from "../../../utils/httpStatusMessages";
import Popup from "../../Popup/Popup";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
function RecoverPasswordForm({ apiUrl, setPopupData, setIsRecoverPassword, setError }) {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar o Popup
  const [popupMessage, setPopupMessage] = useState(""); // Mensagem do Popup
  const [captchaValue, setCaptchaValue] = useState(null); // Valor do reCAPTCHA

  const handleRecoverPassword = async (e) => {
    e.preventDefault();

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

      if (!response.ok ) {
        if (!response.status === 403 || !response.status === 401) {
          setPopupMessage(httpStatusMessagesLogin[response.status] || "Erro ao recuperar senha.");
        }
        else{
          setPopupMessage("Email inválido");
        }
        setShowPopup(true);
        return;
      }

      setPopupData({
        title: "Atenção",
        message: "Instruções para recuperação de senha enviadas para o email.",
        onClose: () => setIsRecoverPassword(false),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); // Atualiza o valor do reCAPTCHA
  };

  return (
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
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY} // Substitua pelo seu sitekey
            onChange={handleCaptchaChange} // Define a função para capturar o token
            className="recaptcha"
          />
        </div>
        <button type="submit">Recuperar Senha</button>
      </form>
    </>
  );
}

export default RecoverPasswordForm;
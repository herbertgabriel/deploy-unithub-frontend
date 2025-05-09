import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleReCaptchaProvider, GoogleReCaptcha } from "react-google-recaptcha-v3";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Popup from "../../components/Popup/Popup"; // Importa o componente Popup
import "./RecuperarSenha.css";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const apiUrl = import.meta.env.VITE_API_BASE_URL;

function RecuperarSenha() {
    const { id } = useParams(); // Resgata o token da URL
    const navigate = useNavigate(); // Hook para redirecionamento
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null); // Valor do reCAPTCHA
    const [showPopup, setShowPopup] = useState(false); // Estado para controlar o Popup
    const [popupData, setPopupData] = useState({ title: "", message: "" }); // Dados do Popup

    const handleVerify = (token) => {
        setCaptchaValue(token); // Atualiza o valor do reCAPTCHA
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação: Senhas não coincidem
        if (novaSenha !== confirmaSenha) {
            setPopupData({
                title: "Erro",
                message: "As senhas não coincidem.",
            });
            setShowPopup(true);
            return;
        }

        // Validação: reCAPTCHA não completado
        if (!captchaValue) {
            setPopupData({
                title: "Erro",
                message: "Por favor, complete o reCAPTCHA.",
            });
            setShowPopup(true);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/reset-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${id}`,
                },
                body: JSON.stringify({
                    password: novaSenha,
                    recaptchaToken: captchaValue, // Envia o token do reCAPTCHA
                }),
            });

            // Erro de requisição ao servidor
            if (!response.ok) {
                setPopupData({
                    title: "Erro",
                    message: "Link de recuperação expirou, solicite novamente.",
                });
                setShowPopup(true);
                setTimeout(() => navigate("/login"), 3000); // Redireciona para /login após 3 segundos
                return;
            }

            // Sucesso
            setPopupData({
                title: "Sucesso",
                message: "Senha alterada com sucesso!",
            });
            setShowPopup(true);
            setTimeout(() => navigate("/login"), 3000); // Redireciona para /login após 3 segundos
        } catch (error) {
            // Erro de conexão ou requisição
            setPopupData({
                title: "Erro",
                message: "Link de recuperação expirou, solicite novamente.",
            });
            setShowPopup(true);
            setTimeout(() => navigate("/login"), 3000); // Redireciona para /login após 3 segundos
        }
    };

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <>
                <Header />

                <main className="recuperar-container">
                    <div className="recuperar-card">
                        <h2>Recuperar Senha</h2>
                        <GoogleReCaptcha onVerify={handleVerify} />
                        <form className="recuperar-form" onSubmit={handleSubmit}>
                            <label htmlFor="novaSenha">Senha</label>
                            <input
                                type="password"
                                id="novaSenha"
                                placeholder="Nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                            />
                            <label htmlFor="confirmaSenha">Confirme a senha</label>
                            <input
                                type="password"
                                id="confirmaSenha"
                                placeholder="Confirme a senha"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                            />

                            <div className="botoes">
                                <button type="submit" className="button-template">Salvar</button>
                            </div>
                        </form>
                    </div>
                </main>

                <Footer />

                {showPopup && (
                    <Popup
                        title={popupData.title}
                        message={popupData.message}
                        onClose={() => setShowPopup(false)}
                    />
                )}
            </>
        </GoogleReCaptchaProvider>
    );
}

export default RecuperarSenha;
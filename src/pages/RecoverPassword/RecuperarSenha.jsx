import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./RecuperarSenha.css";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const apiUrl = import.meta.env.VITE_API_BASE_URL;

function RecuperarSenha() {
    const { id } = useParams(); // Resgata o token da URL
    const navigate = useNavigate(); // Hook para redirecionamento
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erroSenha, setErroSenha] = useState(false); // Estado para indicar erro de validação
    const [captchaValidado, setCaptchaValidado] = useState(false); // Estado para controlar a validação do reCAPTCHA

    const handleCaptchaChange = (value) => {
        if (value) {
            setCaptchaValidado(true); // Marca o reCAPTCHA como validado
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (novaSenha !== confirmaSenha) {
            setErroSenha(true);
            setMensagem("As senhas não coincidem.");
            return;
        }
    
        setErroSenha(false);
        setMensagem("");
    
        try {
            const response = await fetch(`${apiUrl}/reset-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${id}`,
                },
                body: JSON.stringify({
                    password: novaSenha,
                }),
            });
    
            if (!response.ok) {
                let errorMessage = "Erro ao alterar a senha. Tente novamente.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Erro ao processar a resposta JSON:", e);
                }
                setMensagem(errorMessage);
                setCaptchaValidado(false); // Volta para o reCAPTCHA
                return;
            }
    
            setMensagem("Senha alterada com sucesso!");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            console.error("Erro na requisição:", error);
            setMensagem("Erro ao conectar ao servidor.");
            setCaptchaValidado(false); // Volta para o reCAPTCHA
        }
    };

    return (
        <>
            <Header />

            <main className="recuperar-container">
                <div className="recuperar-card">
                    <h2>Recuperar Senha</h2>
                    {!captchaValidado ? (
                        <div className="recaptcha-container">
                            <p>Por favor, complete o reCAPTCHA para continuar.</p>
                            <br />
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                                id="recaptcha-recuperar-senha"
                            />
                        </div>
                    ) : (
                        <form className="recuperar-form" onSubmit={handleSubmit}>
                            <label htmlFor="novaSenha">Senha</label>
                            <input
                                type="password"
                                id="novaSenha"
                                placeholder="Nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                className={erroSenha ? "input-erro" : ""}
                            />
                            <label htmlFor="confirmaSenha">Confirme a senha</label>
                            <input
                                type="password"
                                id="confirmaSenha"
                                placeholder="Confirme a senha"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                                className={erroSenha ? "input-erro" : ""}
                            />

                            <div className="botoes">
                                <button type="submit" className="button-template">Salvar</button>
                            </div>
                        </form>
                    )}
                    {mensagem && <p className="mensagem">{mensagem}</p>}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default RecuperarSenha;
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Popup from "../../components/Popup/Popup";
import LoginForm from "../../components/Forms/LoginForm/LoginForm";
import RegisterForm from "../../components/Forms/RegisterForm/RegisterForm";
import RecoverPasswordForm from "../../components/Forms/RecoverPasswordForm/RecoverPasswordForm";
import "./Login.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isRecoverPassword, setIsRecoverPassword] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [error, setError] = useState("");

  const { isAuthenticated, login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 2000); // 2 segundos
  
      return () => clearTimeout(timeout); 
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsRegister(true);
    }
  }, [searchParams]);

  return (
    <>
      <Header />
      <main className="login-container">
        {popupData && (
          <Popup
            title={popupData.title}
            message={popupData.message}
            onClose={() => setPopupData(null)} 
          />
        )}
        <h1>{isRecoverPassword ? "Recuperar Senha" : isRegister ? "Cadastro" : "Login"}</h1>
        <div>
        {isRegister ? (
          <RegisterForm
            apiUrl={apiUrl}
            setPopupData={setPopupData}
            setIsRegister={setIsRegister}
            setError={setError}
          />
        ) : isRecoverPassword ? (
          <RecoverPasswordForm
            apiUrl={apiUrl}
            setPopupData={setPopupData}
            setIsRecoverPassword={setIsRecoverPassword}
            setError={setError}
          />
        ) : (
          <LoginForm
            apiUrl={apiUrl}
            setPopupData={setPopupData}
            login={login}
            setError={setError}
          />
        )}
        <div className="toggle-form-container">
        {!isRecoverPassword && (
          <button
            className="toggle-form-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Já tem conta? Clique aqui" : "Não tem conta? Clique aqui"}
          </button>
        )}
        {!isRegister && (
          <button
            className="toggle-form-button"
            onClick={() => {
              setIsRecoverPassword(!isRecoverPassword);
              setError("");
            }}
          >
            {isRecoverPassword ? "Voltar ao Login" : "Esqueci minha senha"}
          </button>
        )}
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
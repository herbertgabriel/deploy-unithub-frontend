import { useState, useEffect } from "react";
import { sanitizeInput, validateRegisterForm } from "../../../utils/validations";
import { httpStatusMessagesLogin } from "../../../utils/httpStatusMessages";
import Popup from "../../Popup/Popup";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
function RegisterForm({ apiUrl, setPopupData, setIsRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupDataLocal] = useState({ title: "", message: "" });
  const [captchaValue, setCaptchaValue] = useState(null); // Valor do reCAPTCHA

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/courses`);
        if (!response.ok) {
          throw new Error(httpStatusMessagesLogin[response.status] || "Erro ao buscar cursos.");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setPopupDataLocal({ title: "Erro", message: err.message });
        setShowPopup(true);
      }
    };

    fetchCourses();
  }, [apiUrl]);

  
  const handleRegister = async (e) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);
    const sanitizedTelephone = sanitizeInput(telephone);
    const sanitizedName = sanitizeInput(name);

    const errorMessage = validateRegisterForm(
      sanitizedName,
      sanitizedEmail,
      sanitizedPassword,
      sanitizedConfirmPassword,
      courseId,
      sanitizedTelephone
    );
    if (errorMessage) {
      setPopupDataLocal({ title: "Erro", message: errorMessage });
      setShowPopup(true);
      return;
    }

    if (!captchaValue) {
      setPopupDataLocal({ title: "Erro", message: "Por favor, complete o reCAPTCHA." });
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          confirmPassword: sanitizedConfirmPassword,
          telephone: sanitizedTelephone,
          name: sanitizedName,
          courseId: parseInt(courseId),
          recaptchaToken: captchaValue, // Envia o token do reCAPTCHA
        }),
      });
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          throw new Error("Email inválido ou já está em uso.");
        }
        throw new Error(httpStatusMessagesLogin[response.status] || "Erro ao realizar cadastro.");
      }
      if (!response.ok) {
        throw new Error(httpStatusMessagesLogin[response.status] || "Erro ao realizar cadastro.");
      }
      
      setPopupData({
        title: "Bem-vindo!",
        message: "Seu cadastro foi realizado com sucesso!",
        onClose: () => {
            setIsRegister(false);
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setPopupDataLocal({ title: "Erro", message: err.message });
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
          onClose={() => setShowPopup(false)}
        />
      )}
      <form onSubmit={handleRegister} className="register-form">
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="telephone">Telefone:</label>
          <input
            type="text"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
        </div>
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
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="course">Curso:</label>
          <select
            id="course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Selecione um curso</option>
            {courses.map((course) => (
              <option key={course.cursoId} value={course.cursoId}>
                {course.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY} // Substitua pelo seu sitekey
            onChange={handleCaptchaChange} // Define a função para capturar o token
            className="recaptcha"
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
}

export default RegisterForm;
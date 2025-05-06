import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Perfil.css";
import Cookies from "js-cookie";
import { validatePassword } from "../../utils/validations";
import Button from "../../components/Button/Button";
import { FaCircleUser } from "react-icons/fa6";


function Perfil() {
    const [userData, setUserData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [fieldValue, setFieldValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("jwtToken");
                if (!token) {
                    throw new Error("Você não está autenticado.");
                }

                const response = await fetch(`${apiUrl}/users/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do perfil.");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        fetchUserData();
    }, [apiUrl]);

    const handleEdit = () => {
        setEditingField("password");
        setFieldValue("");
        setConfirmPassword("");
    };

    const handleSave = async () => {
        try {
            // Validação da senha antes de enviar
            if (!validatePassword(fieldValue)) {
                throw new Error("A senha deve ter pelo menos 6 caracteres.");
            }
    
            if (fieldValue !== confirmPassword) {
                throw new Error("As senhas não coincidem.");
            }
    
            const token = Cookies.get("jwtToken");
            if (!token) {
                throw new Error("Você não está autenticado.");
            }
    
            const response = await fetch(`${apiUrl}/users/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    password: fieldValue,
                    confirmPassword: confirmPassword, // Inclui a confirmação da senha na requisição
                }),
            });
    
            if (!response.ok) {
                throw new Error("Erro ao atualizar a senha.");
            }
    
            // Tenta analisar o JSON, mas trata respostas vazias
            const updatedData = await response.json().catch(() => null);
    
            if (updatedData) {
                setUserData(updatedData);
            }
    
            setSuccessMessage("Senha atualizada com sucesso!");
            setEditingField(null);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setFieldValue("");
        setConfirmPassword("");
    };

    if (!userData) {
        return (
            <>
                <Header />
                <p>Carregando...</p>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="perfil-container">
                <div className="title-container">
                    <h1>Meu Perfil</h1> {/* O título */}
                    <FaCircleUser className="perfil-icon" /> {/* O ícone */}
                </div>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="perfil-field" id="id-field">
                    <p><strong>ID:</strong> {userData.userId}</p>
                </div>
                <div className="perfil-field">
                    <p><strong>Nome:</strong></p>
                    <p>{userData.name}</p>
                </div>
                <div className="perfil-field">
                    <p><strong>Email:</strong></p>
                    <p>{userData.email}</p>
                </div>
                <div className="perfil-field">
                    <p><strong>Telefone:</strong></p>
                    <p>{userData.telephone}</p>
                </div>
                <div className="perfil-field">
                    <p><strong>Senha:</strong></p>
                    {editingField === "password" ? (
                        <>
                            <input
                                type="password"
                                placeholder="Nova senha"
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirme a senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button title="Salvar" onClick={handleSave} color="green"/>
                            <Button title="Cancelar" onClick={handleCancel} color="red"/>
                        </>
                    ) : (
                        <>
                            <Button title="Alterar Senha" onClick={handleEdit} color="yellow"/>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Perfil;
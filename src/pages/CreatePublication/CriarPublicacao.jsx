import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./CriarPublicacao.css";
import Cookies from "js-cookie";
import Popup from "../../components/Popup/Popup";

function CriarPublicacao() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [maxParticipants, setMaxParticipants] = useState("");
    const [images, setImages] = useState([null, null, null, null]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({ title: "", message: "" });
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const MAX_CHARACTERS = 250;

    useEffect(() => {
        const fixedCategories = [
            { id: 1, name: "TECNOLOGIA" },
            { id: 2, name: "SAUDE" },
            { id: 3, name: "ENGENHARIA" },
            { id: 4, name: "HUMANAS" },
            { id: 5, name: "EXATAS" },
        ];
        setCategories(fixedCategories);
    }, []);

    const handleCategoryChange = (e) => {
        const value = parseInt(e.target.value, 10);
        const updatedCategories = new Set(selectedCategories);
        if (e.target.checked) {
            updatedCategories.add(value);
        } else {
            updatedCategories.delete(value);
        }
        setSelectedCategories(updatedCategories);
    };

    const handleImageChange = (index, file) => {
        if (file && !["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
            setPopupData({ title: "Erro", message: "Apenas arquivos JPEG, PNG e SVG são permitidos." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return;
        }
        const updatedImages = [...images];
        updatedImages[index] = file;
        setImages(updatedImages);
    };

    const handleMaxParticipantsChange = (e) => {
        const value = e.target.value;
        if (value === "" || (Number(value) >= 0 && Number(value) <= 1000)) {
            setMaxParticipants(value);
        }
    };

    const handleTextChange = (setter, value) => {
        if (value.length <= MAX_CHARACTERS) {
            setter(value);
        }
    };

    const validateForm = () => {
        if (!title.trim()) {
            setPopupData({ title: "Erro", message: "O título é obrigatório." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (title.length > MAX_CHARACTERS) {
            setPopupData({ title: "Erro", message: `O título deve ter no máximo ${MAX_CHARACTERS} caracteres.` });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (!description.trim()) {
            setPopupData({ title: "Erro", message: "A descrição é obrigatória." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (description.length > MAX_CHARACTERS) {
            setPopupData({ title: "Erro", message: `A descrição deve ter no máximo ${MAX_CHARACTERS} caracteres.` });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (!dateTime) {
            setPopupData({ title: "Erro", message: "A data e hora são obrigatórias." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (!location.trim()) {
            setPopupData({ title: "Erro", message: "A localização é obrigatória." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (selectedCategories.size === 0) {
            setPopupData({ title: "Erro", message: "Selecione pelo menos uma categoria." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        if (!maxParticipants || Number(maxParticipants) <= 0) {
            setPopupData({ title: "Erro", message: "O número máximo de participantes deve ser maior que zero." });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const token = Cookies.get("jwtToken");
            if (!token) {
                setPopupData({ title: "Erro", message: "Você não está autenticado. Por favor, faça login." });
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("dateTime", dateTime);
            formData.append("location", location);
            selectedCategories.forEach((id) => formData.append("categoriaIds", id));
            formData.append("maxParticipants", maxParticipants);
            images.forEach((image, index) => {
                if (image) {
                    formData.append(`imagem${index + 1}`, image);
                }
            });

            const response = await fetch(`${apiUrl}/events`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao criar o evento.");
            }

            setPopupData({ title: "Sucesso", message: "Evento criado com sucesso!" });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos

            // Reset form
            setTitle("");
            setDescription("");
            setDateTime("");
            setLocation("");
            setSelectedCategories(new Set());
            setMaxParticipants("");
            setImages([null, null, null, null]);
        } catch (error) {
            setPopupData({ title: "Erro", message: error.message });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
        }
    };

    return (
        <>
            <Header />
            <div className="criar-publicacao-container">
                <h1>Criar Evento</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTextChange(setTitle, e.target.value)}
                            maxLength={MAX_CHARACTERS}
                            required
                        />
                        <div className="character-counter">
                            {title.length}/{MAX_CHARACTERS} caracteres
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Descrição:</label>
                        <textarea
                            value={description}
                            onChange={(e) => handleTextChange(setDescription, e.target.value)}
                            maxLength={MAX_CHARACTERS}
                            required
                        ></textarea>
                        <div className="character-counter">
                            {description.length}/{MAX_CHARACTERS} caracteres
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Data e Hora:</label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Localização:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => handleTextChange(setLocation, e.target.value)}
                            maxLength={MAX_CHARACTERS}
                            required
                        />
                        <div className="character-counter">
                            {location.length}/{MAX_CHARACTERS} caracteres
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="categorias">
                            <label>Categorias:</label>
                            {categories.map((cat) => (
                                <div key={cat.id}>
                                    <input
                                        type="checkbox"
                                        value={cat.id}
                                        onChange={handleCategoryChange}
                                        checked={selectedCategories.has(cat.id)}
                                    />
                                    <label>{cat.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Máximo de Participantes:</label>
                        <input
                            type="number"
                            value={maxParticipants}
                            onChange={handleMaxParticipantsChange}
                            min="1"
                            max="1000"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Imagens (JPEG, PNG, SVG) - Opcional:</label>
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <label htmlFor={`file-upload-${index}`} id="file-upload-label">
                                    Escolher Arquivo
                                </label>
                                <input
                                    id={`file-upload-${index}`}
                                    type="file"
                                    accept="image/jpeg, image/png, image/svg+xml"
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                />
                                <span className="file-upload-text">
                                    {images[index] ? images[index].name : "Nenhum arquivo escolhido"}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Criar Evento</button>
                </form>
            </div>
            <Footer />
            {showPopup && (
                <Popup
                    title={popupData.title}
                    message={popupData.message}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
}

export default CriarPublicacao;

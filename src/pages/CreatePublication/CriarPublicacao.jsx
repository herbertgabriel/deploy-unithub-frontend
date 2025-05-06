import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./CriarPublicacao.css";
import Cookies from "js-cookie";

function CriarPublicacao() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [maxParticipants, setMaxParticipants] = useState("");
    const [images, setImages] = useState([null, null, null, null]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Simula categorias fixas
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
            setErrorMessage("Apenas arquivos JPEG, PNG e SVG são permitidos.");
            return;
        }
        const updatedImages = [...images];
        updatedImages[index] = file;
        setImages(updatedImages);
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get("jwtToken");
            if (!token) {
                throw new Error("Você não está autenticado.");
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
                throw new Error("Erro ao criar o evento.");
            }

            setSuccessMessage("Evento criado com sucesso!");
            setTitle("");
            setDescription("");
            setDateTime("");
            setLocation("");
            setSelectedCategories(new Set());
            setMaxParticipants("");
            setImages([null, null, null, null]);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="criar-publicacao-container">
                <h1>Criar Evento</h1>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descrição:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
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
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
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
                            onChange={(e) => setMaxParticipants(e.target.value)}
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
        </>
    );
}

export default CriarPublicacao;
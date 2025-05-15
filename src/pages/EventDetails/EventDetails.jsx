import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./EventDetails.css";
import Button from "../../components/Button/Button";
import Popup from "../../components/Popup/Popup";
import FormsPopup from "../../components/Popup/FormsPopup/FormsPopup";
import SubscribersList from "../../components/SubscribersList/SubscribersList";
import Cookies from "js-cookie";
import { IoMdArrowBack } from "react-icons/io";

function EventDetails() {
    const { id } = useParams(); // Obtém o parâmetro 'id' da URL
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // Controla a exibição do Popup de erro
    const [showSubscribersPopup, setShowSubscribersPopup] = useState(false); // Controla a exibição do Popup de inscritos
    const [showDeletePopup, setShowDeletePopup] = useState(false); // Controla o popup de exclusão
    const [confirmDelete, setConfirmDelete] = useState(false); // Estado do checkbox de confirmação
    const [popupError, setPopupError] = useState(null); // Mensagem de erro no popup de exclusão
    const apiUrl = import.meta.env.VITE_API_BASE_URL; // Obtém a URL base da API

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/events/${id}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar os detalhes do evento.");
                }
                const data = await response.json();
                setEventDetails(data);
            } catch (err) {
                setError(err.message);
                setShowPopup(true); // Exibe o Popup em caso de erro
                setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleSubscribe = async () => {
        try {
            const token = Cookies.get("jwtToken");
            if (!token) {
                throw new Error("Você não está logado.");
            }

            const response = await fetch(`${apiUrl}/events/subscribe/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 409) {
                throw new Error("Você já está inscrito neste evento.");
            }
            if (!response.ok) {
                throw new Error("Erro ao se inscrever no evento.");
            }

            setSuccessMessage("Inscrição realizada com sucesso!");
            setTimeout(() => setSuccessMessage(null), 3000); // Fecha o popup automaticamente após 3 segundos
        } catch (err) {
            setError(err.message);
            setShowPopup(true); // Exibe o Popup em caso de erro
            setTimeout(() => setShowPopup(false), 3000); // Fecha o popup automaticamente após 3 segundos
        }
    };

    const handleDeleteEvent = async () => {
        if (!confirmDelete) {
            setPopupError("Você deve confirmar que deseja excluir este evento.");
            return;
        }

        try {
            const token = Cookies.get("jwtToken");
            if (!token) {
                throw new Error("Token JWT não encontrado.");
            }

            const response = await fetch(`${apiUrl}/events/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao deletar o evento.");
            }

            setSuccessMessage("Evento excluído com sucesso!");
            setShowDeletePopup(false); // Fecha o popup de exclusão

            // Fecha o popup de sucesso automaticamente após 3 segundos
            setTimeout(() => {
                setSuccessMessage(null);
                window.history.back(); // Volta para a página anterior
            }, 3000);
        } catch (error) {
            setPopupError("Erro ao deletar o evento.");
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setError(null);
    };

    const openSubscribersPopup = () => {
        setShowSubscribersPopup(true); // Abre o popup de inscritos
    };

    const closeSubscribersPopup = () => {
        setShowSubscribersPopup(false); // Fecha o popup de inscritos
    };

    if (loading) {
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
            {eventDetails && (
                <main className="event-details">
                    <IoMdArrowBack className="voltar-button" onClick={() => window.history.back()} style={{ cursor: "pointer" }} />

                    <header className="event-container-header-card">
                        <h1>{eventDetails.title}</h1>

                        <nav id="buttons-container-event-details">
                            {eventDetails.maxParticipants !== 0 && (
                                <Button title="Inscrever-se" onClick={handleSubscribe} />
                            )}
                            {(Cookies.get("userRole") === "ORGANIZADOR" || Cookies.get("userRole") === "ADMIN") && (
                                <>
                                    <Button title="Ver Inscritos" onClick={openSubscribersPopup} />
                                    <Button title="Excluir publicação" onClick={() => setShowDeletePopup(true)} color="red" />
                                </>
                            )}
                        </nav>
                    </header>

                    <section className="event-container-header-card">
                        <div className="event-label">
                            <label htmlFor="categories">Categorias:</label>
                            <p id="categories">
                                {`${eventDetails.categories.join(" | ")} | ${
                                    eventDetails.isOfficial ? "Oficial" : "Não oficial"
                                }`}
                            </p>
                        </div>
                        <div className="event-label">
                            <label htmlFor="maxParticipants">Máximo de Participantes:</label>
                            <p id="maxParticipants">
                                {eventDetails.maxParticipants || "Inscrição indisponível"}
                            </p>
                        </div>
                    </section>

                    <section className="event-container-header-card">
                        <div className="event-label">
                            <label htmlFor="location">Local:</label>
                            <p id="location">{eventDetails.location}</p>
                        </div>
                        <div className="event-label">
                            <label htmlFor="dateTime">Data e Hora:</label>
                            <p id="dateTime">
                                {new Date(eventDetails.dateTime).toLocaleString("pt-BR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </section>

                    <section className="event-label-description">
                        <label htmlFor="description">Descrição:</label>
                        <p id="description">{eventDetails.description}</p>
                    </section>

                    {eventDetails.images && eventDetails.images.length > 0 && (
                        <section className="event-images">
                            {eventDetails.images.slice(0, 4).map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Imagem ${index + 1}`}
                                    className="event-image"
                                />
                            ))}
                        </section>
                    )}
                </main>
            )}
            {showPopup && (
                <Popup
                    title="Erro"
                    message={error}
                    onClose={closePopup}
                />
            )}
            {showSubscribersPopup && (
                <SubscribersList eventId={id} onClose={closeSubscribersPopup} />
            )}
            {successMessage && (
                <Popup
                    title="Sucesso"
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}
                />
            )}
            {showDeletePopup && (
               <FormsPopup
                    title={`Excluir Evento ${eventDetails.title}`}
                    onClose={() => setShowDeletePopup(false)}
                >
                    {popupError && <p className="error-message">{popupError}</p>}
                    <p>Tem certeza que deseja excluir este evento?</p>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="confirm-delete-checkbox"
                            checked={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.checked)}
                        />
                        <label htmlFor="confirm-delete-checkbox">
                            Confirmo que desejo excluir este evento.
                        </label>
                    </div>
                    <Button title="Confirmar" onClick={handleDeleteEvent} color="green" />
                </FormsPopup>
            )}
            <Footer />
        </>
    );
}

export default EventDetails;
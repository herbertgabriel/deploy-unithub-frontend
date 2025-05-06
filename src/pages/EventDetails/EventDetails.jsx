import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./EventDetails.css";
import Button from "../../components/Button/Button";
import Popup from "../../components/Popup/Popup";
import SubscribersList from "../../components/SubscribersList/SubscribersList";
import Cookies from "js-cookie";

function EventDetails() {
    const { id } = useParams(); // Obtém o parâmetro 'id' da URL
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // Controla a exibição do Popup de erro
    const [showSubscribersPopup, setShowSubscribersPopup] = useState(false); // Controla a exibição do Popup de inscritos
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
        } catch (err) {
            setError(err.message);
            setShowPopup(true); // Exibe o Popup em caso de erro
        }
    };

    const handleDelete = async (eventId) => {
        try {
            const token = Cookies.get("jwtToken");
            if (!token) {
                throw new Error("Token JWT não encontrado.");
            }

            const response = await fetch(`${apiUrl}/events/${eventId}`, {
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
            setTimeout(() => {
                window.history.back();
            }, 3000);
        } catch (error) {
            setError(error.message);
            setShowPopup(true); // Exibe o Popup em caso de erro
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
                <h1>{eventDetails.title}</h1>
              
                <div>
                  <label htmlFor="description">Descrição:</label>
                  <p id="description">{eventDetails.description}</p>
                </div>
              
                <div>
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
              
                <div>
                  <label htmlFor="location">Local:</label>
                  <p id="location">{eventDetails.location}</p>
                </div>
              
                <div>
                  <label htmlFor="categories">Categorias:</label>
                  <p id="categories">{eventDetails.categories.join(", ")}</p>
                </div>
              
                <div>
                  <label htmlFor="active">Ativo:</label>
                  <p id="active">{eventDetails.active ? "Sim" : "Não"}</p>
                </div>
              
                <div>
                  <label htmlFor="maxParticipants">Máximo de Participantes:</label>
                  <p id="maxParticipants">
                    {eventDetails.maxParticipants || "Sem limite"}
                  </p>
                </div>
              
                {/* Exibe as imagens do evento */}
                {eventDetails.images && eventDetails.images.length > 0 && (
                  <div className="event-images">
                    {eventDetails.images.slice(0, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="event-image"
                      />
                    ))}
                  </div>
                )}
              
                {/* Exibe o botão apenas se maxParticipants for diferente de 0 */}
                {eventDetails.maxParticipants !== 0 && (
                  <Button title="Inscrever-se" onClick={handleSubscribe} />
                )}
                {(Cookies.get("userRole") === "ORGANIZADOR" || Cookies.get("userRole") === "ADMIN") && (
                  <>
                    <Button title="Ver Inscritos" onClick={openSubscribersPopup} />
                    <Button title="Excluir publicação" onClick={() => handleDelete(id)} color="red" />
                  </>
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
            <Footer />
        </>
    );
}

export default EventDetails;
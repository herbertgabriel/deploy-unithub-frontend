import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Publicacao from "../../components/Publication/Publicacao";
import { useAuth } from "../../context/AuthContext";
import "./EventosInscritos.css";
import Cookies from "js-cookie";
import FormsPopup from "../../components/Popup/FormsPopup/FormsPopup";
import Button from "../../components/Button/Button";

function EventosInscritos() {
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [showUnsubscribePopup, setShowUnsubscribePopup] = useState(false); // Controla o popup de desinscrição
  const [currentEvent, setCurrentEvent] = useState(null); // Evento atual para desinscrição
  const [confirmUnsubscribe, setConfirmUnsubscribe] = useState(false); // Estado do checkbox de confirmação
  const [popupError, setPopupError] = useState(null); // Mensagem de erro no popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Controla o popup de sucesso

  useEffect(() => {
    const fetchSubscribedEvents = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwtToken");
        if (!token) {
          throw new Error("Token JWT não encontrado.");
        }

        const response = await fetch(`${apiUrl}/events/subscribed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os eventos inscritos.");
        }

        const data = await response.json();
        setSubscribedEvents(data || []);
      } catch (error) {
        console.error("Erro ao buscar os eventos inscritos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubscribedEvents();
    }
  }, [isAuthenticated, apiUrl]);

  const handleOpenUnsubscribePopup = (event) => {
    setCurrentEvent(event);
    setConfirmUnsubscribe(false);
    setPopupError(null);
    setShowUnsubscribePopup(true);
  };

  const handleUnsubscribe = async () => {
    if (!confirmUnsubscribe) {
      setPopupError("Você deve confirmar que deseja se desinscrever deste evento.");
      return;
    }

    try {
      const token = Cookies.get("jwtToken");
      if (!token) {
        throw new Error("Token JWT não encontrado.");
      }

      const response = await fetch(`${apiUrl}/events/unsubscribe/${currentEvent.eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao se desinscrever do evento.");
      }

      // Remove o evento desinscrito do estado
      setSubscribedEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== currentEvent.eventId)
      );
      console.log(`Desinscrito do evento ${currentEvent.eventId} com sucesso.`);

      // Exibe o popup de sucesso
      setShowSuccessPopup(true);

      // Fecha o popup de desinscrição
      setShowUnsubscribePopup(false);

      // Fecha o popup de sucesso automaticamente após 3 segundos
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      setPopupError("Erro ao se desinscrever do evento.");
    }
  };

  return (
    <>
      <Header />
      <main className="feed-container">
        <h1>Eventos Inscritos</h1>
        <div className="feed-container">
          {loading ? (
            <div className="container-carregar-mais">
              <p>Carregando...</p>
            </div>
          ) : subscribedEvents.length === 0 ? (
            <div className="container-carregar-mais">
              <p>Você não está inscrito em nenhum evento.</p>
            </div>
          ) : (
            subscribedEvents.map((event) => (
              <Publicacao
                key={event.eventId}
                eventId={event.eventId}
                title={event.title}
                categorias={`${event.category.join(" | ")} | ${
                  event.isOfficial ? "Oficial" : "Não oficial"
                }`}
                imagens={event.images}
                content={event.description}
                onUnsubscribe={() => handleOpenUnsubscribePopup(event)} // Abre o popup de desinscrição
              />
            ))
          )}
        </div>
      </main>

      {/* Popup para Desinscrever-se */}
      {showUnsubscribePopup && (
        <FormsPopup
          title={`Desinscrever-se do Evento ${currentEvent.title}`}
          onClose={() => setShowUnsubscribePopup(false)}
        >
          {popupError && <p className="error-message">{popupError}</p>}
          <p>Tem certeza que deseja se desinscrever deste evento?</p>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="confirm-unsubscribe-checkbox"
              checked={confirmUnsubscribe}
              onChange={(e) => setConfirmUnsubscribe(e.target.checked)}
            />
            <label htmlFor="confirm-unsubscribe-checkbox">
              Confirmo que desejo me desinscrever deste evento.
            </label>
          </div>
          <Button title="Confirmar" onClick={handleUnsubscribe} color="green" />
        </FormsPopup>
      )}

      {/* Popup de Sucesso */}
      {showSuccessPopup && (
        <FormsPopup
          title="Sucesso"
          onClose={() => setShowSuccessPopup(false)}
        >
          <p>Você se desinscreveu do evento com sucesso!</p>
        </FormsPopup>
      )}
    </>
  );
}

export default EventosInscritos;
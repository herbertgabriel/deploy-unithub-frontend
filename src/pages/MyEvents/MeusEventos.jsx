import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Publicacao from "../../components/Publication/Publicacao";
import { useAuth } from "../../context/AuthContext";
import "./MeusEventos.css";
import Cookies from "js-cookie";
import FormsPopup from "../../components/Popup/FormsPopup/FormsPopup";
import Button from "../../components/Button/Button";

function MeusEventos() {
  const [myFeedItems, setMyFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [showDeletePopup, setShowDeletePopup] = useState(false); // Controla o popup de exclusão
  const [currentEvent, setCurrentEvent] = useState(null); // Evento atual para exclusão
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado do checkbox de confirmação
  const [popupError, setPopupError] = useState(null); // Mensagem de erro no popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Controla o popup de sucesso

  useEffect(() => {
    const fetchSelfPosts = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwtToken");
        if (!token) {
          throw new Error("Token JWT não encontrado.");
        }

        const response = await fetch(`${apiUrl}/events/self-posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do feed.");
        }

        const data = await response.json();
        setMyFeedItems(data || []);
      } catch (error) {
        console.error("Erro ao buscar o feed:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSelfPosts();
    }
  }, [isAuthenticated, apiUrl]);

  const handleOpenDeletePopup = (event) => {
    setCurrentEvent(event);
    setConfirmDelete(false);
    setPopupError(null);
    setShowDeletePopup(true);
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

      const response = await fetch(`${apiUrl}/events/${currentEvent.eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar o evento.");
      }

      // Remove o evento deletado do estado
      setMyFeedItems((prevItems) =>
        prevItems.filter((item) => item.eventId !== currentEvent.eventId)
      );
      console.log(`Evento ${currentEvent.eventId} deletado com sucesso.`);

      // Exibe o popup de sucesso
      setShowSuccessPopup(true);

      // Fecha o popup de exclusão
      setShowDeletePopup(false);

      // Fecha o popup de sucesso automaticamente após 3 segundos
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      setPopupError("Erro ao deletar o evento.");
    }
  };

  function capitalizeWords(str) {
    return str
      .split("|")
      .map((word) =>
        word.trim().toLowerCase().replace(/^\w/, (char) => char.toUpperCase())
      )
      .join(" | ");
  }

  return (
    <>
      <Header />
      <main className="feed-container">
        <h1>Meus Eventos</h1>
        <div className="feed-container">
          {loading ? (
            <div className="container-carregar-mais">
              <p>Carregando...</p>
            </div>
          ) : myFeedItems.length === 0 ? (
            <div className="container-carregar-mais">
              <p>Nenhuma publicação encontrada.</p>
            </div>
          ) : (
            myFeedItems.map((item) => (
              <Publicacao
                key={item.eventId}
                eventId={item.eventId}
                title={item.title}
                categorias={`${capitalizeWords(item.category.join(" | ") || "")} | ${
                  item.isOfficial ? "Oficial" : "Não oficial"
                }`}
                imagens={item.images}
                content={item.description}
                onDelete={() => handleOpenDeletePopup(item)} // Abre o popup de exclusão
              />
            ))
          )}
        </div>
      </main>

      {/* Popup para Deletar Evento */}
      {showDeletePopup && (
        <FormsPopup
          title={`Excluir Evento ${currentEvent.title}`}
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

      {/* Popup de Sucesso */}
      {showSuccessPopup && (
        <FormsPopup
          title="Sucesso"
          onClose={() => setShowSuccessPopup(false)}
        >
          <p>O evento foi excluído com sucesso!</p>
        </FormsPopup>
      )}
    </>
  );
}

export default MeusEventos;
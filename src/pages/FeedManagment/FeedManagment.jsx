import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FeedComponent from "../../components/Feed/FeedComponent";
import Cookies from "js-cookie";
import Popup from "../../components/Popup/Popup";
import "./FeedManagment.css";

function FeedManagment() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("jwtToken");
  const userRole = Cookies.get("userRole"); // Obtém a role do usuário

  // Define a URL de busca com base na role do usuário
  const fetchUrl =
    userRole === "ALUNO_REPRESENTANTE"
      ? "/events/feed-by-course-creator?isActive=false"
      : "/events/feed?isActive=false";

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [popupData, setPopupData] = useState(null); // Estado para controlar o Popup

  const handleAccept = async (eventId) => {
    try {
      const response = await fetch(`${apiUrl}/management/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao aceitar o evento.");
      }

      setPopupData({
        id: "feed-managment-popup", // ID exclusivo
        title: "Sucesso",
        message: "Evento aceito com sucesso!",
        onClose: () => setPopupData(null),
      });
    } catch (error) {
      setPopupData({
        id: "feed-managment-popup", // ID exclusivo
        title: "Erro",
        message: "Erro ao aceitar o evento.",
        onClose: () => setPopupData(null),
      });
    }
  };

  const handleReject = (eventId) => {
    setCurrentEventId(eventId);
    setShowRejectModal(true);
    setConfirmCheckbox(false); // Reseta o estado do checkbox
  };

  const confirmReject = async () => {
    if (rejectReason.trim().length === 0) {
      setPopupData({
        id: "feed-managment-popup", // ID exclusivo
        title: "Erro",
        message: "Por favor, insira um motivo para recusar o evento.",
        onClose: () => setPopupData(null),
      });
      return;
    }

    if (!confirmCheckbox) {
      setPopupData({
        id: "feed-managment-popup", // ID exclusivo
        title: "Erro",
        message: "Você deve confirmar que deseja recusar este evento.",
        onClose: () => setPopupData(null),
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/management/${currentEventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motivo: rejectReason }),
      });

      if (!response.ok) {
        throw new Error("Erro ao recusar o evento.");
      }

      setPopupData({
        id: "feed-managment-popup", // ID exclusivo
        title: "Sucesso",
        message: "Evento recusado com sucesso!",
        onClose: () => setPopupData(null),
      });
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      setPopupData({
        id: "feed-managment-popup", // ID exclusivo
        title: "Erro",
        message: "Erro ao recusar o evento.",
        onClose: () => setPopupData(null),
      });
    }
  };

  return (
    <>
      <Header />
      <main>
        <FeedComponent
          apiUrl={apiUrl}
          fetchUrl={fetchUrl}
          token={token}
          title="Gestão de Eventos"
          isManagement={true}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </main>
      <Footer />

      {popupData && (
        <Popup
          id={popupData.id} // Passa o ID exclusivo
          title={popupData.title}
          message={popupData.message}
          onClose={popupData.onClose}
        />
      )}

      {showRejectModal && (
        <div id="reject-modal-feed-managment" className="modal">
          <div className="modal-content">
            <h2>Motivo para Recusar</h2>
            <textarea
              maxLength={200}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Digite o motivo para recusar o evento (máximo 200 caracteres)"
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="confirm-checkbox"
                checked={confirmCheckbox}
                onChange={(e) => setConfirmCheckbox(e.target.checked)}
              />
              <label htmlFor="confirm-checkbox">
                Confirmo que desejo recusar este evento. Ele será excluído.
              </label>
            </div>
            <div className="modal-actions">
              <button
                onClick={confirmReject}
                className="button-template"
                disabled={rejectReason.trim().length === 0 || !confirmCheckbox} // Desabilita o botão se as condições não forem atendidas
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="button-template"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedManagment;
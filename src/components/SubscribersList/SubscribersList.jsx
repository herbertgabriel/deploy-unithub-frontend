import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./SubscribersList.css";

function SubscribersList({ eventId, onClose }) {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSubscribers = async () => {
      const token = Cookies.get("jwtToken"); // Obtém o token JWT
      if (!token) {
        setError("Você precisa estar autenticado para visualizar os inscritos.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/management/subscribers/${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os inscritos.");
        }

        const data = await response.json();

        if (data.length === 0) {
          setError("Nenhum usuário se inscreveu neste evento.");
        } else {
          setSubscribers(data);
          setError(null); // Limpa o erro caso existam inscritos
        }
      } catch (error) {
        setError("Erro ao carregar os inscritos.");
      }
    };

    fetchSubscribers();
  }, [eventId, apiUrl]);

  return (
    <div className="popup-subscribers-list" id="subscribersListPopup">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Inscritos no Evento</h2>
        {error && <p className="error-message">{error}</p>}
        {!error && (
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={index}>
                  <td>{subscriber.name || "N/A"}</td>
                  <td>{subscriber.telephone || "N/A"}</td>
                  <td>{subscriber.email || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SubscribersList;
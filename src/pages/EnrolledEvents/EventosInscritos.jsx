import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Publicacao from "../../components/Publication/Publicacao";
import { useAuth } from "../../context/AuthContext";
import "./EventosInscritos.css";
import Cookies from "js-cookie";

function EventosInscritos() {
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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
        console.log("Dados recebidos do servidor (EventosInscritos):", data);

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

  const handleUnsubscribe = async (eventId) => {
    try {
      const token = Cookies.get("jwtToken");
      if (!token) {
        throw new Error("Token JWT não encontrado.");
      }

      const response = await fetch(`${apiUrl}/events/unsubscribe/${eventId}`, {
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
      setSubscribedEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
      console.log(`Desinscrito do evento ${eventId} com sucesso.`);
    } catch (error) {
      console.error("Erro ao se desinscrever do evento:", error.message);
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
                onUnsubscribe={handleUnsubscribe} // Passa a função de desinscrição
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default EventosInscritos;
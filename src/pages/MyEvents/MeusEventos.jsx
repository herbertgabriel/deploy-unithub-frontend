import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Publicacao from "../../components/Publication/Publicacao";
import { useAuth } from "../../context/AuthContext";
import "./MeusEventos.css";
import Cookies from "js-cookie";

function MeusEventos() {
  const [myFeedItems, setMyFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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
        console.log("Dados recebidos do servidor (MeusEventos):", data);

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

      // Remove o evento deletado do estado
      setMyFeedItems((prevItems) => prevItems.filter((item) => item.eventId !== eventId));
      console.log(`Evento ${eventId} deletado com sucesso.`);
    } catch (error) {
      console.error("Erro ao deletar o evento:", error.message);
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
                onDelete={handleDelete} // Passa a função de exclusão
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MeusEventos;
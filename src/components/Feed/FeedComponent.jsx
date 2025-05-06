import { useState, useEffect } from "react";
import Publicacao from "../Publication/Publicacao";
import Pagination from "../Pagination/Pagination";
import "./FeedComponent.css";

function FeedComponent({
  apiUrl,
  fetchUrl,
  token,
  onAccept,
  onReject,
  title,
  isManagement = false,
}) {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}${fetchUrl}&page=${page}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do feed.");
        }

        const data = await response.json();
        setFeedItems(data.feedItems || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Erro ao buscar o feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [apiUrl, fetchUrl, page, token]);

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="feed-component">
      <h1>{title}</h1>
      <div className="feed-container">
        {loading ? (
          <div className="container-carregar-mais">
            <p>Carregando...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="container-carregar-mais">
            <p>Nenhuma publicação encontrada.</p>
          </div>
        ) : (
          feedItems.map((item) => (
            <Publicacao
              key={item.eventId}
              eventId={item.eventId}
              title={item.title}
              categorias={`${item.category.join(" | ")} | ${
                item.isOfficial ? "Oficial" : "Não oficial"
              }`}
              imagens={item.images}
              content={item.description}
              onManagment={isManagement}
              onAccept={onAccept ? () => onAccept(item.eventId) : null}
              onReject={onReject ? () => onReject(item.eventId) : null}
            />
          ))
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      )}
    </div>
  );
}

export default FeedComponent;
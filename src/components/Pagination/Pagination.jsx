import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./Pagination.css";

function Pagination({ page, totalPages, onPreviousPage, onNextPage }) {
  return (
    <div className="container-carregar-mais">
      <button
        onClick={() => {
          console.log("Página anterior clicada");
          onPreviousPage(); // Chama a função para atualizar a página
        }}
        disabled={page === 1} // Desativa o botão se estiver na primeira página
      >
        <SlArrowLeft />
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => {
          console.log("Próxima página clicada");
          onNextPage(); // Chama a função para atualizar a página
        }}
        disabled={page >= totalPages} // Desativa o botão se estiver na última página
      >
        <SlArrowRight />
      </button>
    </div>
  );
}

export default Pagination;
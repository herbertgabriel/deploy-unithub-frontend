import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./Pagination.css";

function Pagination({ page, totalPages, onPreviousPage, onNextPage }) {
  return (
    <div className="container-carregar-mais">
      <button onClick={onPreviousPage} disabled={page === 0}>
        <SlArrowLeft />
      </button>
      <span>
        Página {page + 1} de {totalPages}
      </span>
      <button onClick={onNextPage} disabled={page >= totalPages - 1}>
        <SlArrowRight />
      </button>
    </div>
  );
}

export default Pagination;
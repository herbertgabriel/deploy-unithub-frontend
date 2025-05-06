import "./Carousel.css";
import { Link } from "react-router-dom"; 

function CarouselItem({id, date, title, description }) {
  return (
    <Link to={`/event-details/${id}`}>
      <div className="slide">
        <div className="box-date">
          {date} <hr className="line" />
        </div>
        <div className="box-conteudo">
          <h3 className="box-title">{title}</h3>
          <p className="box-description">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default CarouselItem;
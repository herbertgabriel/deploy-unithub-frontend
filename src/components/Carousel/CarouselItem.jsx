import "./Carousel.css";
import { Link } from "react-router-dom"; 

function CarouselItem({id, date, title, description }) {
  return (

      <div className="slide">
        <div className="box-date">
          {date} <hr className="line" />
        </div>
        <div className="box-conteudo">
          <Link to={`/event-details/${id}`}>
            <h3 className="box-title">{title}</h3>
            <p className="box-description">{description}</p>
          </Link>
        </div>
      </div>

  );
}

export default CarouselItem;
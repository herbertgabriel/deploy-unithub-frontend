import "./Carousel.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselItem from "./CarouselItem";
import { useState, useEffect } from "react";

function Carousel() {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    draggable: true, // <-- garante que o drag está ativado

    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchCarouselData = async () => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/events/feed`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do carrossel.");
        }
        const data = await response.json();

        const allData = (data.feedItems || []).map((item) => ({
          ...item,
          formattedDate: new Date(item.dateTime).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }));

        setCarouselData(allData);
      } catch (error) {
        console.error("Erro ao buscar os dados do carrossel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  // Não renderizar o carrossel se tiver menos de 3 itens
  if (carouselData.length < 3) {
    return null;
  }

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Slider {...settings}>
          {carouselData.map((item, index) => (
            <CarouselItem
              key={index}
              id={item.eventId}
              date={item.formattedDate}
              title={item.title}
              description={item.description}
            />
          ))}
        </Slider>
      )}
    </div>
  );
}

export default Carousel;

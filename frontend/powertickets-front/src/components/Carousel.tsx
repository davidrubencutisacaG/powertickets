import { useState, useEffect } from 'react';
import './Carousel.css';

type Slide = {
  img: string;
  title: string;
  category: string;
  date: string;
};

type CarouselProps = {
  slides: Slide[];
};

export default function Carousel({ slides }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide cada 5 segundos
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="carousel-container">
      <div
        className="carousel-slide"
        style={{
          backgroundImage: `url(${slides[currentSlide].img})`,
        }}
      >
        <div className="carousel-overlay"></div>
        <div className="carousel-content">
          <div className="carousel-text">
            <span className="carousel-category">{slides[currentSlide].category}</span>
            <h2 className="carousel-title">{slides[currentSlide].title}</h2>
            <p className="carousel-date">{slides[currentSlide].date}</p>
          </div>
        </div>
      </div>
      <button
        className="carousel-nav-button carousel-nav-prev"
        onClick={handlePrevSlide}
        aria-label="Slide anterior"
      >
        ‹
      </button>
      <button
        className="carousel-nav-button carousel-nav-next"
        onClick={handleNextSlide}
        aria-label="Siguiente slide"
      >
        ›
      </button>
    </section>
  );
}


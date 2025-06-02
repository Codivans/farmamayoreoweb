import React, { useEffect, useRef, useState } from "react";
import "./../BannerSlider.css";

export const Banner_principal = () => {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);

    const images = [
      "https://assets1.farmaciasanpablo.com.mx/banners/slider/SliderPrincipal-Haleon-01_07-Jun-d-v2.jpg",
      "https://assets1.farmaciasanpablo.com.mx/landings/_Apego/banners/2506-junio/slider01-apego-1q-jun25-d-v3.jpg",
      "https://assets1.farmaciasanpablo.com.mx/landings/institucionales/_natural/img/alNatural/Slider-SPN-01-07jun-d-v2.jpg"
    ];

      const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextImage, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
     <div className="slider-container">
      <div className="slider-wrapper" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((img, i) => (
          <img key={i} src={img} alt={`Slide ${i}`} className="slider-image" />
        ))}
      </div>

      {/* Botones de navegación */}
      <button className="slider-button left" onClick={() => { prevImage(); resetTimer(); }}>
        ❮
      </button>
      <button className="slider-button right" onClick={() => { nextImage(); resetTimer(); }}>
        ❯
      </button>
    </div>
  )
}

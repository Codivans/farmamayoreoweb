import React, { useEffect, useRef, useState } from "react";
import "./../BannerSlider.css";

export const Banner_principal = () => {

    const images = [
      "https://assets1.farmaciasanpablo.com.mx/banners/slider/SliderPrincipal-Haleon-01_07-Jun-d-v2.jpg",
      "https://assets1.farmaciasanpablo.com.mx/landings/_Apego/banners/2506-junio/slider01-apego-1q-jun25-d-v3.jpg",
      "https://assets1.farmaciasanpablo.com.mx/landings/institucionales/_natural/img/alNatural/Slider-SPN-01-07jun-d-v2.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!images || images.length === 0) return;

      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000); // ⏳ cambia cada 3 segundos

      return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
      <div className="slider-container slider_principal">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`banner-${index}`}
          className={index === currentIndex ? "active" : ""}
        />
      ))}

      <div className="slider-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
    )
}

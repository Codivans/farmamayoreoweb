import React, { useEffect, useRef, useState } from "react";
import "./../BannerSlider.css";

export const Banner_principal = () => {

    const images = [
      "https://firebasestorage.googleapis.com/v0/b/farmamayoreoapp.firebasestorage.app/o/banners%2Fbanner1.jpg?alt=media&token=375e7c2d-e82c-41d1-8565-1978314b8a87",
      "https://firebasestorage.googleapis.com/v0/b/farmamayoreoapp.firebasestorage.app/o/banners%2Fbanner2.jpg?alt=media&token=8f451dea-5d3b-4ed5-8772-9973a952b152",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!images || images.length === 0) return;

      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000); // ⏳ cambia cada 3 segundos

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

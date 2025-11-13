import React, { useState, useEffect, useRef } from "react";
import "./../BannerSlider.css";

export const Banner_principal = () => {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const timeoutRef = useRef(null);

    const images = [
      {src:"https://firebasestorage.googleapis.com/v0/b/farmamayoreoapp.firebasestorage.app/o/banners%2Fbanner1.jpg?alt=media&token=375e7c2d-e82c-41d1-8565-1978314b8a87"},
      {src:"https://firebasestorage.googleapis.com/v0/b/farmamayoreoapp.firebasestorage.app/o/banners%2Fbanner2.jpg?alt=media&token=8f451dea-5d3b-4ed5-8772-9973a952b152"},
    ];
    let intervalo = 2500

     // --- Autoplay con loop ---
  useEffect(() => {
    const nextSlide = () => {
      setCurrent((prev) => (prev + 1) % images.length);
    };

    // if (!paused) {
      timeoutRef.current = setTimeout(nextSlide, intervalo);
    // }

    return () => clearTimeout(timeoutRef.current);
  }, [current, paused, images, intervalo]);

  return (
    <div
      className="hero-slider-container"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="hero-slider-wrapper"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="hero-slide" key={index}>
            <img src={img.src} alt={img.alt || `banner-${index}`} />
            {img.caption && (
              <div className="hero-caption">
                <h2>{img.caption}</h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="hero-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};
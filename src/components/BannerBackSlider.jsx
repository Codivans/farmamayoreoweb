import React, { useState, useEffect, useRef } from "react";
import "./../BannerBackSlider.css"

export const BannerBackSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

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
            <img src={img} alt={img || `banner-${index}`} />
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

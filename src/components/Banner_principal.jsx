import React, { useState, useEffect, useRef } from "react";
import "./../BannerSlider.css";
import imgbanner1 from "./../assets/banners/banner1.jpg";
import imgbanner2 from "./../assets/banners/banner2.jpg";
import imgbanner3 from "./../assets/banners/banner3.jpg";

import imgbanner1movil from "./../assets/banners/banner1_movil.jpg";
import imgbanner2movil from "./../assets/banners/banner2_movil.jpg";
import imgbanner3movil from "./../assets/banners/banner3_movil.jpg";

export const Banner_principal = () => {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const timeoutRef = useRef(null);

    const images = [
      {src:imgbanner1, movil: imgbanner1movil},
      {src:imgbanner2, movil: imgbanner2movil},
      {src:imgbanner3, movil: imgbanner3movil}
    ];

    const imagesMovil = [
      {src:imgbanner1},
      {src:imgbanner2},
      {src:imgbanner3}
    ];


    let intervalo = 3500

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
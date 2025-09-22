import React, { useEffect, useRef, useState } from "react";
import "./../BannerSlider.css";

export const Banner_principal = () => {

    const images = [
      "https://firebasestorage.googleapis.com/v0/b/farmamayoreoapp.firebasestorage.app/o/banners%2Fbanner1.jpg?alt=media&token=98f78762-4dbc-4ab9-bd4c-eb924c66f57f",
      "https://firebasestorage.googleapis.com/v0/b/farmamayoreoapp.firebasestorage.app/o/banners%2Fbanner2.jpg?alt=media&token=133a6414-5b14-45dd-be71-15aa01851150",
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

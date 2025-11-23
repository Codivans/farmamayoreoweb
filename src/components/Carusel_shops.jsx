import React, { useState, useEffect, useRef } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Card_product } from './Card_product';

export const Carusel_shops = ({productos, intervalo = 2500}) => {

    const sliderRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = productos.length;
    
    // --- Movimiento automático tipo carrusel ---
    useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || totalSlides === 0) return;

    const slideWidth = slider.querySelector(".slide-item")?.offsetWidth || 0;

    const moveNext = () => {
    if (!isPaused) {
        let newIndex = currentIndex + 1;
        if (newIndex >= totalSlides) {
        newIndex = 0;
        slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
        slider.scrollTo({
            left: newIndex * (slideWidth + 10),
            behavior: "smooth",
        });
        }
        setCurrentIndex(newIndex);
    }
    };

    const interval = setInterval(moveNext, intervalo);
    return () => clearInterval(interval);
    }, [isPaused, currentIndex, intervalo, productos.length]);
    
    const scrollManual = (direction) => {
        const slider = sliderRef.current;
        const slideWidth = slider.querySelector(".slide-item")?.offsetWidth || 0;
        let newIndex =
        direction === "left" ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0) newIndex = totalSlides - 1;
        if (newIndex >= totalSlides) newIndex = 0;

        slider.scrollTo({
            left: newIndex * (slideWidth + 10),
            behavior: "smooth",
        });

        setCurrentIndex(newIndex);
    };

  return (
      <div
          className="slider-container container_shop_carrusel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
      >
          <button className="btn-scroll left" onClick={() => scrollManual("left")}>
              <IoChevronBack />
          </button>

          <div className="slider-wrapper" ref={sliderRef}>
              {productos.concat(productos).map((item, index) => (
              <div className="slide-item" key={index}>
                  <Card_product item={item} index={index} />
              </div>
              ))}
          </div>

          <button className="btn-scroll right" onClick={() => scrollManual("right")}>
              <IoChevronForward />
          </button>
      </div>
  )
}

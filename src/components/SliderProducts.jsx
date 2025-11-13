import React, { useRef, useEffect, useState } from "react";
import { Card_product } from "./Card_product";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useCatalogoCruce } from "./../hooks/useCatalogoCruce";
import "../slider.css";
import { Link } from "react-router-dom";

export const SliderProductos = ({intervalo = 2500, shopId, nameShop, img }) => {
    const { productos, loading, error } = useCatalogoCruce(shopId);
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
    <div className="container_shop_home">
        <Link className='img_category' to={`/shop/${nameShop}/shopid/${shopId}`}>
            <img src={img} />
        </Link>

        <div
            className="slider-container"
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
    </div>

  );
};

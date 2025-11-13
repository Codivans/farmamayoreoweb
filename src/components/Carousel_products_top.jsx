import React, { useState, useEffect, useRef } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { count, doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig"; // Ajusta según tu ruta
import { Card_product } from './Card_product';

export const Carousel_products_top = ({intervalo = 2500}) => {

  const [productos, setProductos] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const obtenerCatalogoTopCompleto = async () => {
      try {
        const refTop = doc(db, "catalogo", "catalogo_top");
        const refCompleto = doc(db, "catalogo", "farmaMayoreo");

        const [topSnap, completoSnap] = await Promise.all([
          getDoc(refTop),
          getDoc(refCompleto),
        ]);

        if (topSnap.exists() && completoSnap.exists()) {
          const topArray = topSnap.data().catalogo;
          const completoArray = completoSnap.data().catalogo;

          const mapaCompleto = new Map(
            completoArray.map((prod) => [prod.codigo, prod])
          );

          const resultado = topArray
            .map((itemTop) => mapaCompleto.get(itemTop.codigo))
            .filter((item) => item !== undefined);

          setProductos(resultado);
        } else {
          throw new Error("Uno o ambos documentos no existen");
        }
      } catch (err) {
        console.error("Error obteniendo catálogo top:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerCatalogoTopCompleto();
  }, []);

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
    <div className="container_shop_home slider_top">
      <h4 className='title_carrusel'>Productos + vendidos</h4>
      <div
          className="slider-container container_cards_top"
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
  )
}

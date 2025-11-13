import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("Cambia a:", pathname); // 👈 Agrega esto
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // cambia a instant para probar
    });
  }, [pathname]);

  return null;
};

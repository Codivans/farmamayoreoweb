import { useEffect,  useState } from "react";
import "./../BannerSlider.css";
import { Link } from "react-router-dom";

export const SliderBannersShops = ({shops}) => {

  const images = shops

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
      <div className="slider-container slider_shops">
      {images.map((item, index) => (
        <Link to={item.url}>
            <img
                key={index}
                src={item.src}
                alt={`banner-${index}`}
                className={index === currentIndex ? "active" : ""}
            />
        </Link>
      ))}
    </div>
    )
}

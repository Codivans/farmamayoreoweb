import "./../LogoSlider.css";

export default function LogoSlider({ logos = []}) {
  if (!logos.length) return null;

  // 🔹 Repetimos 3 veces para asegurar continuidad
  const logosDup = [...logos, ...logos, ...logos];

  return (
     <div className="slider">
      <div
        className="slide_track"
        
      >
        {logosDup.map((logo, idx) => (
          <div className="slide" key={`${logo.id}-${idx}`}>
            <a
              href={`/shop/${logo.name}/shopid/${logo.id}`}
              rel="noopener noreferrer"
              title={logo.name}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="logo-slider__img"
                draggable="false"
                loading="lazy"
                style={{height: "60px"}}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
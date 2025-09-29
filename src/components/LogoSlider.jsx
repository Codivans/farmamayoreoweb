import "./../LogoSlider.css";

export default function LogoSlider({ logos = [], duration = 20, height = "60px" }) {
  if (!logos.length) return null;

  // 🔹 Repetimos 3 veces para asegurar continuidad
  const logosDup = [...logos, ...logos, ...logos];

  return (
    <div className="logo-slider">
      <div
        className="logo-slider__track"
        style={{ animationDuration: `${duration}s`, height }}
      >
        {logosDup.map((logo, idx) => (
          <div className="logo-slider__item" key={`${logo.id}-${idx}`}>
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
                style={{ height }}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
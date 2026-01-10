// Convierte un Código Postal de México a latitud y longitud
export async function obtenerLatLng(cp) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${cp}&country=Mexico&format=json`
  );

  if (!response.ok) {
    throw new Error("Error al consultar la ubicación");
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Código postal no encontrado");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

// Calcula la distancia en kilómetros entre dos puntos (Haversine)
export function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

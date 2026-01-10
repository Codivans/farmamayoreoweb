export function obtenerMontoMinimoPorDistancia(distanciaKm, rangos) {
  const rango = rangos.find(r =>
    distanciaKm >= r.km_min && distanciaKm <= r.km_max && r.activo
  );

  return rango ? rango.monto_minimo : null;
}

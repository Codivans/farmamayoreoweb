import React, { useState } from 'react';

export const DistanciaEntreDirecciones = () => {
  const [direccionA, setDireccionA] = useState('');
  const [direccionB, setDireccionB] = useState('');
  const [distancia, setDistancia] = useState(null);
  const [error, setError] = useState('');

  const obtenerCoordenadas = async (direccion) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`);
    const data = await response.json();
    if (data.length === 0) throw new Error('Dirección no encontrada');
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };

  const calcularDistancia = (p1, p2) => {
    const R = 6371; // km
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLon = (p2.lng - p1.lng) * Math.PI / 180;
    const lat1 = p1.lat * Math.PI / 180;
    const lat2 = p2.lat * Math.PI / 180;

    const a = Math.sin(dLat / 2) ** 2 +
              Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const manejarConsulta = async () => {
    setError('');
    setDistancia(null);

    try {
      const coordsA = await obtenerCoordenadas(direccionA);
      const coordsB = await obtenerCoordenadas(direccionB);
      const dist = calcularDistancia(coordsA, coordsB);
      setDistancia(dist.toFixed(2));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 500, margin: 'auto' }}>
      <h2>Calculadora de distancia (gratis)</h2>
      <input
        type="text"
        value={direccionA}
        onChange={(e) => setDireccionA(e.target.value)}
        placeholder="Dirección A"
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="text"
        value={direccionB}
        onChange={(e) => setDireccionB(e.target.value)}
        placeholder="Dirección B"
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <button onClick={manejarConsulta} style={{ padding: '10px 15px' }}>
        Calcular distancia
      </button>

      {distancia && (
        <p style={{ marginTop: '15px' }}>
          📍 La distancia entre ambas direcciones es: <strong>{distancia} km</strong>
        </p>
      )}

      {error && (
        <p style={{ marginTop: '15px', color: 'red' }}>❌ Error: {error}</p>
      )}
    </div>
  );
};


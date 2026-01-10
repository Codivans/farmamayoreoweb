import { useEffect, useState } from "react";
import { obtenerRangosEnvio } from "../services/rengosEnvio.services";
import { obtenerLatLng, calcularDistanciaKm } from '../utils/utilsDistancia';
import { obtenerMontoMinimoPorDistancia } from "../utils/utilsRangosEnvio";
import formatoMoneda from '../functions/formatoMoneda';

export default function DistanciaCP({cerrarCp}) {
  const CP_ORIGEN = 57820; // tu CP fijo

  const [cpUsuario, setCpUsuario] = useState("");
  const [distancia, setDistancia] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rangosFirebase, setRangosFirebase] = useState([]);
  const [montoMinimo, setMontoMinimo] = useState(null);

    const calcular = async () => {
    if (cpUsuario.length !== 5) {
        setError("Ingresa un código postal válido");
        return;
    }

    try {
        setLoading(true);
        setError("");

        const origen = await obtenerLatLng(CP_ORIGEN);
        const destino = await obtenerLatLng(cpUsuario);

        const km = calcularDistanciaKm(
        origen.lat,
        origen.lng,
        destino.lat,
        destino.lng
        );

        const kmCalculados = Number(km.toFixed(2));

        setDistancia(kmCalculados);
        validarDistancia(kmCalculados);

    } catch (err) {
        setError("No se pudo calcular la distancia");
    } finally {
        setLoading(false);
    }
    };


    useEffect(() => {
    const cargarRangos = async () => {
      const data = await obtenerRangosEnvio();
      setRangosFirebase(data);
    };

    cargarRangos();
  }, []);

const validarDistancia = (distanciaKm) => {
  console.log("Distancia:", distanciaKm);
  console.log("Rangos:", rangosFirebase);

  const monto = obtenerMontoMinimoPorDistancia(distanciaKm, rangosFirebase);
  console.log("Monto encontrado:", monto);

  setMontoMinimo(monto);
};


  console.log("Rangos:", rangosFirebase);


  return (
    <div className="overlay_cp" onClick={cerrarCp}>
        <div className="content_input_cp" onClick={(e) => e.stopPropagation()}>
            <h3>Consulta la zona de entrega</h3>
            <div className="content_inputs">
                <label>Ingresa tu Código Postal</label>
                <input
                    type="number"
                    placeholder="Código Postal"
                    value={cpUsuario}
                    onChange={(e) => setCpUsuario(e.target.value)}
                />
                <button
                    onClick={calcular}
                    disabled={loading}
                >
                    {loading ? "Calculando..." : "Verificar"}
                </button>
            </div>
            {distancia && (
                <>
                    <p style={{textAlign: "center"}}>Distancia aproximada: <b>{distancia} km</b></p>
                    <p  className="txt_monto">Monto minimo:
                        {montoMinimo === null ? (
                        <p>No hay envío disponible para tu zona</p>
                        ): <strong> {formatoMoneda(montoMinimo)}</strong>}
                    </p>
                </>
            )}

            {error && <p style={{ color: "red", textAlign: "center"}}>{error}</p>}
        </div>
    </div>
  );
}

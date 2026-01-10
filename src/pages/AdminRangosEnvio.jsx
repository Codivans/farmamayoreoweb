import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import formatoMoneda from '../functions/formatoMoneda';

export const AdminRangosEnvio = ()=> {
  const [kmMin, setKmMin] = useState("");
  const [kmMax, setKmMax] = useState("");
  const [monto, setMonto] = useState("");
  const [rangos, setRangos] = useState([]);

  const cargarRangos = async () => {
    const snap = await getDocs(collection(db, "configuracion_envio"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRangos(data);
  };

  useEffect(() => {
    cargarRangos();
  }, []);

  const guardarRango = async () => {
    if (!kmMin || !kmMax || !monto) return alert("Completa todos los campos");

    await addDoc(collection(db, "configuracion_envio"), {
      km_min: Number(kmMin),
      km_max: Number(kmMax),
      monto_minimo: Number(monto),
      activo: true
    });

    setKmMin("");
    setKmMax("");
    setMonto("");
    cargarRangos();
  };

  return (
    <div>
      <h2>Rangos de Envío</h2>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10 }}>
        <input placeholder="KM Min" value={kmMin} onChange={e => setKmMin(e.target.value)} />
        <input placeholder="KM Max" value={kmMax} onChange={e => setKmMax(e.target.value)} />
        <input placeholder="Monto mínimo" value={monto} onChange={e => setMonto(e.target.value)} />
        <button onClick={guardarRango}>Guardar</button>
      </div>

      {/* TABLA */}
      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Rango KM</th>
            <th>Monto mínimo</th>
          </tr>
        </thead>
        <tbody>
          {rangos.map(r => (
            <tr key={r.id}>
              <td>{r.km_min} - {r.km_max} km</td>
              <td>${r.monto_minimo.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

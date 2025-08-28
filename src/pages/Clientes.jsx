import { useEffect, useState } from "react";
import { Header_admin } from '../components/Header_admin'
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // importa tu instancia
import { IoIosArrowDown } from "react-icons/io";


export const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [openPdf, setOpenPdf] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // 🔹 Traemos usuarios ordenados por fechaRegistro desc
        const q = query(
          collection(db, "usuarios"),
          orderBy("fechaRegistro", "desc")
        );
        const querySnapshot = await getDocs(q);

        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        // 🔹 Reordenamos en frontend: primero los status false
        data.sort((a, b) => {
          if (a.status === b.status) {
            return b.fechaRegistro - a.fechaRegistro; // más reciente primero
          }
          return a.status === false ? -1 : 1; // false arriba
        });

        setClientes(data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const uriPdf = clientes.find((item) => item.id === openPdf?.uid)
  

  return (
    <div className="container_pedidos_admin">
        <Header_admin />
        <div>
          <table className="table_clientes">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Constancia</th>
                <th>Aviso</th>
                <th>Status</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <>
                  <tr key={cliente.id}>
                    <td>{cliente.nombre} {cliente.apellidoPaterno} {cliente.apellidoMaterno}</td>
                    <td>{cliente.telefono}</td>
                    <td>
                      {cliente.constancia?.url 
                        ? (<button className='btn_document_table' onClick={() => setOpenPdf({uid: cliente.id, documento: 'constancia'})}>Ver Constancia</button>) 
                        : "Sin documentos"}
                    </td>
                    <td>
                      {cliente.aviso?.url 
                        ? (<button className='btn_document_table' onClick={() => setOpenPdf({uid: cliente.id, documento: 'aviso'})}>Ver Aviso</button>) 
                        : "Sin documentos"}
                    </td>

                    <td>{cliente.status ? "Activo" : "Pendiente"}</td>
                    <td>{new Date(cliente.fechaRegistro.seconds * 1000).toLocaleString()}</td>
                    <td>
                      <button className="btn_direcciones_table" onClick={() => setExpanded(expanded === cliente.id ? null : cliente.id)}>
                        {expanded === cliente.id ? "Ocultar " : "Ver direcciones"}
                      </button>
                    </td>
                  </tr>

                  {expanded === cliente.id && cliente.direcciones && (
                    <tr className="row_expanded">
                      <td colSpan={7}>
                        <ul>
                          {cliente.direcciones.map((dir, i) => (
                            <li key={i}>
                              <strong>{dir.tipoDireccion}:</strong><br />
                              {dir.calle} {dir.numeroExt}, {dir.colonia}, {dir.municipio}, {dir.estado}, CP {dir.cp}
                              <em>Referencias: {dir.referencias || "N/A"}</em>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal PDF */}
        {openPdf && (
          <div className="wrap_pop">
            <div className="pop_content">
              <button onClick={() => setOpenPdf(null)} className="btn_delete_pop">✕</button>
              <iframe
                src={uriPdf?.[openPdf.documento]?.url}
                title="PDF Viewer"
                className="fram_container"
              ></iframe>
            </div>
          </div>
        )}

        {/* {
            <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
                {JSON.stringify(clientes, null, 2)}
            </pre>
        } */}
    </div>
  )
}

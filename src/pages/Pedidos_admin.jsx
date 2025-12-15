import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, onSnapshot, updateDoc  } from "firebase/firestore";
import { db } from "./../firebase/firebaseConfig"; // Asegúrate de tener tu firebase config aquí
import logo from './../assets/farmamayoreo.svg';
import { Link } from "react-router-dom";
import { Header_admin } from "../components/Header_admin";
import formatoMoneda from "../functions/formatoMoneda";

export const Pedidos_admin = () => {
    const [pedidosOriginales, setPedidosOriginales] = useState([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPedido, setShowPedido] = useState(false);
    const [idPedidoDetail, setIdPedidoDetail] = useState(null);
    const [pedidoDetail, setPedidoDetail] = useState([]);

  // Recuperar desde localStorage o dejar vacío
    const [nombreFiltro, setNombreFiltro] = useState(localStorage.getItem("filtro_nombre") || "");
    const [estatusFiltro, setEstatusFiltro] = useState(localStorage.getItem("filtro_estatus") || "");
    const [tipoEntregaFiltro, setTipoEntregaFiltro] = useState(localStorage.getItem("filtro_tipoEntrega") || "");
    const [fechaInicio, setFechaInicio] = useState(localStorage.getItem("filtro_fechaInicio") || "");
    const [fechaFin, setFechaFin] = useState(localStorage.getItem("filtro_fechaFin") || "");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [resultadosPorPagina, setResultadosPorPagina] = useState(30);

  useEffect(() => {
    localStorage.setItem("filtro_nombre", nombreFiltro);
    localStorage.setItem("filtro_estatus", estatusFiltro);
    localStorage.setItem("filtro_tipoEntrega", tipoEntregaFiltro);
    localStorage.setItem("filtro_fechaInicio", fechaInicio);
    localStorage.setItem("filtro_fechaFin", fechaFin);
}, [nombreFiltro, estatusFiltro, tipoEntregaFiltro, fechaInicio, fechaFin]);


  // Cargar pedidos + usuarios
 useEffect(() => {
  // Escuchar en tiempo real los cambios en la colección "pedidos"
  const unsubscribe = onSnapshot(collection(db, "pedidos"), async (snapshot) => {
    const pedidosData = [];

    for (const docPedido of snapshot.docs) {
      const pedidoData = docPedido.data();
      const uidUsuario = pedidoData.usuario;

      let usuarioData = null;
      if (uidUsuario) {
        const usuarioSnap = await getDoc(doc(db, "usuarios", uidUsuario));
        usuarioData = usuarioSnap.exists() ? usuarioSnap.data() : null;
      }

      pedidosData.push({
        idPedido: docPedido.id,
        pedido: pedidoData,
        usuario: usuarioData,
      });
    }

    // Ordenar por fecha descendente
    const pedidosOrdenados = pedidosData.sort((a, b) => {
    const fechaA = a.pedido.fecha;
    const fechaB = b.pedido.fecha;
    return fechaB - fechaA; // Más reciente primero
    });

    setPedidosOriginales(pedidosOrdenados);
    setPedidosFiltrados(pedidosOrdenados);

    setLoading(false);
  });

  // Limpiar suscripción al desmontar
  return () => unsubscribe();
}, []);

  // Filtrar
  useEffect(() => {
    const resultados = pedidosOriginales.filter((item) => {
        const usuario = item.usuario ?? {};
        const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? ""}`.toLowerCase();
        const nombreMatch = nombreCompleto.includes(nombreFiltro.toLowerCase());

        const estatusMatch = estatusFiltro ? item.pedido.estatus === estatusFiltro : true;

        const tipoEntregaMatch = tipoEntregaFiltro ? item.pedido.tipoEntrega === tipoEntregaFiltro : true;

        const fechaUnix = item.pedido.fecha;
        const fechaPedido = new Date(
        fechaUnix < 1000000000000 ? fechaUnix * 1000 : fechaUnix
        );

        const inicio = fechaInicio ? new Date(fechaInicio + "T00:00:00") : null;
        const fin = fechaFin ? new Date(fechaFin + "T23:59:59.999") : null;

        const fechaMatch =
        (!inicio || fechaPedido >= inicio) &&
        (!fin || fechaPedido <= fin);

        return nombreMatch && estatusMatch && tipoEntregaMatch && fechaMatch;
    });

    setPedidosFiltrados(resultados);
    setPaginaActual(1); // Volver a la primera página al cambiar filtros
    }, [nombreFiltro, estatusFiltro, tipoEntregaFiltro, fechaInicio, fechaFin, pedidosOriginales]);

  // Paginación
  const totalPaginas = Math.ceil(pedidosFiltrados.length / resultadosPorPagina);
  const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
  const datosPagina = pedidosFiltrados.slice(indiceInicio, indiceInicio + resultadosPorPagina);

  const cambiarPagina = (nueva) => {
    if (nueva < 1 || nueva > totalPaginas) return;
    setPaginaActual(nueva);
  };

  if (loading) return <p>Cargando datos...</p>;

  let detail = idPedidoDetail != null ? datosPagina?.filter((x) => x.idPedido === idPedidoDetail) : [];
  const pedidoItems = detail?.[0]?.pedido || [];

  const showPedidoDetails = (e) => {
    setIdPedidoDetail(e);
    setShowPedido(!showPedido);
  }

  const handlePrint = () => {
    setTimeout(() => {
      const content = document.getElementById("pedido_pop");
      if (!content) return;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Pedido</title>
            <style>
              p{
                font-family: arial;
                font-size: 12px;
              }
              button{
                display: none;
              }
              table{
                  width: auto; 
                  font-size: 12px;
                  font-family: Arial;
              }
              table thead th{
                border: 1px solid black;
              }

              table thead th:nth-child(6){
                  display: none;
              }

              table tbody td{
                  border: 1px solid black;
                  font-size: 12px;
              }
              table tbody td:nth-child(1){
                  width: 45px;
                  text-align: right;
              }
              table tbody td:nth-child(2), td:nth-child(4){
                  width: 30px;
                  text-align: center;
              }
              table tbody td:nth-child(3){
                  width: 120px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
              }
              table tbody td:nth-child(4){
                  width: 70px;
                  text-align: center;
              }

              table tbody td:nth-child(6){
                  display: none;
              }

              table tbody td:nth-child(7) span{
                width: 100px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              


              </style>
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }, 100); // 🔥 pequeño delay para dejar que React pinte
  };


    // 🔹 Actualizar estatus en Firebase
    const actualizarEstatus = async (pedidoId, nuevoStatus) => {
      console.log(pedidoId, nuevoStatus)
      try {
        const pedidoRef = doc(db, "pedidos", pedidoId);
        await updateDoc(pedidoRef, { estatus: nuevoStatus });
        
        setPedidosOriginales((prev) =>
          prev.map((p) =>
            p.id === pedidoId ? { ...p, estatus: nuevoStatus } : p
          )
        );
      } catch (error) {
        console.error("Error al actualizar estatus:", error);
      }
    };

  

  return (
    <div className="container_pedidos_admin">
      <Header_admin />

        <div className="container_filtros_pedidos">
            <input
                type="text"
                placeholder="Buscar por nombre"
                value={nombreFiltro}
                onChange={(e) => setNombreFiltro(e.target.value)}
            />
            <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
            />
            <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
            />
            <select
                value={estatusFiltro}
                onChange={(e) => setEstatusFiltro(e.target.value)}
            >
                <option value="">Todos los estatus</option>
                <option value="nuevo">Nuevo</option>
                <option value="surtiendo">Surtiendo</option>
                <option value="en camino">En camino</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
            </select>

            <select
                value={tipoEntregaFiltro}
                onChange={(e) => setTipoEntregaFiltro(e.target.value)}
                >
                <option value="">Todos los tipos de entrega</option>
                <option value="pickUp">PickUp</option>
                <option value="envio">Envío a domicilio</option>
            </select>
            <button onClick={() => {
                setNombreFiltro("");
                setEstatusFiltro("");
                setTipoEntregaFiltro("");
                setFechaInicio("");
                setFechaFin("");
                localStorage.removeItem("filtro_nombre");
                localStorage.removeItem("filtro_estatus");
                localStorage.removeItem("filtro_tipoEntrega");
                localStorage.removeItem("filtro_fechaInicio");
                localStorage.removeItem("filtro_fechaFin");
                }}>
                Limpiar
            </button>
            
        </div>
        

        <table className="table_pedidos_admin">
            <thead> 
                <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Piezas</th>
                    <th>Tipo</th>
                    <th>Entrega</th>
                    <th>Forma de pago</th>
                    <th>Importe</th>
                    <th>Estatus</th>
                    <th>View</th>
                    <th>Opciones</th>
                </tr>
            </thead>
            <tbody>
                {datosPagina.map((item, index) => (
                    <tr key={index}>
                        <td style={{textAlign: 'center'}}>{item.idPedido}</td>
                        <td style={{textTransform: 'Capitalize'}}>{item.usuario?.nombre} {item.usuario?.apellidoPaterno} {item.usuario?.apellidoMaterno}</td>
                        <td>
                            {new Date(item.pedido.fecha < 1000000000000 ? item.pedido.fecha * 1000 : item.pedido.fecha).toLocaleString("es-MX", {day: "2-digit",month: "2-digit",year: "numeric",hour: "2-digit",minute: "2-digit",second: "2-digit",hour12: false})}
                        </td>
                        <td style={{textAlign: 'center'}}>{item.pedido?.pedido.length} Articulos</td>
                        <td style={{textTransform: 'Capitalize'}}>{item.pedido?.tipoEntrega}</td>
                        <td style={{textTransform: 'Capitalize'}}>{item.pedido?.tipoEntrega === 'pickUp' ? item.pedido?.pickupEntrega : `${item.pedido?.direccion[0]?.estado}, ${item.pedido?.direccion[0]?.municipio}`}</td>
                        <td style={{textTransform: 'Capitalize'}}>{item.pedido?.formaPago}</td>
                        <td>$ {item.pedido?.importePedido}</td>           
                        <td><span className={`item_estatus item_${item.pedido.estatus}`}> {item.pedido.estatus} </span></td>
                        <td><button onClick={() => showPedidoDetails(item.idPedido)}>Ver detalle</button></td>
                        <td>
                          <select
                            value={item.pedido.estatus}
                            onChange={(e) =>
                              actualizarEstatus(item.idPedido, e.target.value)
                            }
                          >
                            <option>Selecciona</option>
                            <option value='surtiendo'>Surtiendo</option>
                            <option value='entregado'>Entregado</option>
                            <option value='cancelado'>Cancelado</option>
                          </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Paginación */}
        <div className="pagination_table">
            <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
            <span className="txt_pagination">Página {paginaActual} de {totalPaginas}</span>
            <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>

            <select value={resultadosPorPagina} onChange={(e) => setResultadosPorPagina(Number(e.target.value))}>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={30}>30 por página</option>
                <option value={50}>50 por página</option>
            </select>
            <p>Mostrando {datosPagina.length} de {pedidosFiltrados.length} resultados</p>
        </div>

        {
          showPedido &&(
            <div className="container_popup_pedido">
              <div className="popup_pedido">
                  <button onClick={() => setShowPedido(!showPedido)} className="btn_close_pop">Cerrar</button>
                  <div id="pedido_pop">
                    {detail.map((item, index) => (
                      <div key={index}>
                        {/* ID del pedido */}
                        <h2>Pedido: {item.idPedido}</h2>

                        {/* Datos del usuario */}
                        <h3>Datos del usuario</h3>
                        <p>
                          <strong>Nombre:</strong> {item.usuario.nombre}{" "}
                          {item.usuario.apellidoPaterno} {item.usuario.apellidoMaterno}
                        </p>

                        {item.pedido.direccion?.map((dir, i) => (
                          <div key={i}>
                            <p><strong>Calle:</strong> {dir.calle} #Ext: {dir.numeroExt} Int: {dir.numeroInt} <strong>Colonia:</strong> {dir.colonia} <strong>Municipio:</strong> {dir.municipio} <strong>Estado:</strong> {dir.estado} <strong>CP:</strong> {dir.cp}</p>
                            <p><strong>Referencias:</strong> {dir.referencias}</p>
                          </div>
                        ))}

                        <button onClick={handlePrint} className="btn_print_ped">Imprimir</button>

                        {/* Tabla con los productos del pedido */}
                        <table className="table_orden">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Cantidad</th>
                              <th>Nombre</th>
                              <th>Precio</th>
                              <th>Importe</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.pedido.pedido?.map((prod, idx) => (
                              <tr key={idx}>
                                <td>{prod.codigo}</td>
                                <td>{prod.pedido}</td>
                                <td>{prod.nombre}</td>
                                <td>{formatoMoneda(prod.precio)}</td>
                                <td>{formatoMoneda(prod.importe)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          )
        }


    </div>
  );
};


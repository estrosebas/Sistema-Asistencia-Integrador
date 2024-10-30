
import React, { useState } from "react";
import QRCode from "qrcode-generator";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./UserPanel.css";

const UserPanel = () => {
  const [vistaActiva, setVistaActiva] = useState("historial");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [dni, setDni] = useState("");
  const [qrCodeHtml, setQrCodeHtml] = useState("");

  // Fechas de ejemplo para asistencia e inasistencia
  const fechasAsistencia = ["2024-11-01", "2024-11-03", "2024-11-07"];
  const fechasInasistencia = ["2024-11-02", "2024-11-04"];

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

  const seleccionarVista = (id) => {
    setVistaActiva(id);
    if (window.innerWidth <= 768) setMenuAbierto(false);
  };

  const opcionesMenu = [
    { id: "historial", icon: "fa-clock", label: "Historial", action: () => seleccionarVista("historial") },
    { id: "codigoQR", icon: "fa-qrcode", label: "Código QR", action: () => seleccionarVista("codigoQR") },
  ];

  // Función para generar el código QR
  const generateQrCode = (data) => {
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();
    setQrCodeHtml(qr.createImgTag(8));
  };

  // Función para determinar el estilo de los días en el calendario
  const marcarFechas = ({ date }) => {
    const fechaFormateada = date.toISOString().split("T")[0];

    if (fechasAsistencia.includes(fechaFormateada)) {
      return "asistencia"; // Clase CSS para días con asistencia
    } else if (fechasInasistencia.includes(fechaFormateada)) {
      return "inasistencia"; // Clase CSS para días con inasistencia
    }
    return null;
  };

  

  return (
    <div id="user-panel">
      <div className="container-fluid">
        <div className={`panel-lateral ${menuAbierto ? "show" : "collapsed"} ${modoOscuro ? "modo-oscuro" : ""}`}>
          <div className="menu-navegacion">
            <div className="nav-item">
              <button className="toggler" onClick={toggleMenu}>
                <span className="icono fa-solid fa-bars"></span>
                {menuAbierto && <span className="link-text">Menu</span>}
              </button>
            </div>
            {opcionesMenu.map(({ id, icon, label, action }) => (
              <div className="nav-item" key={id}>
                <button
                  className={`link-text ${vistaActiva === id ? "activo" : ""}`}
                  onClick={action}
                >
                  <span className={`icono fas ${icon}`}></span>
                  {menuAbierto && <span className="link-text">{label}</span>}
                </button>
              </div>
            ))}
            <div className="nav-item">
              <button className="link-text" onClick={() => console.log("Cerrar Sesión")}>
                <span className="icono fas fa-sign-out-alt"></span>
                {menuAbierto && <span className="link-text">Cerrar Sesión</span>}
              </button>
            </div>
          </div>
          {menuAbierto && (
            <div className="nav-item" style={{ marginTop: 'auto' }}>
              <button className="link-text" onClick={toggleModoOscuro}>
                <span className="icono fas fa-moon"></span>
                {menuAbierto && <span className="link-text">{modoOscuro ? "Modo Claro" : "Modo Oscuro"}</span>}
              </button>
            </div>
          )}
        </div>

        <div className={`contenido-principal ${menuAbierto ? "expanded" : "collapsed"}`}>
          {vistaActiva === "historial" ? (
            <div>
              <h2>Historial de Asistencia</h2>
              <Calendar
                tileClassName={marcarFechas} // Aplica clases CSS a los días según asistencia/inasistencia
              />
            </div>
          ) : vistaActiva === "codigoQR" ? (
            <div>
              <h2>Generar Código QR</h2>
              <input
                type="text"
                placeholder="Ingrese DNI para generar QR"
                className="form-control mb-3"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => generateQrCode(dni)}
              >
                Generar QR
              </button>
              <div
                className="mt-3 qr-output"
                dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
              ></div>
            </div>
          ) : (
            <h2>Vista no disponible</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;


// import React, { useState } from "react";
// import QRCode from "qrcode-generator";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./UserPanel.css";
// const AdminDashboard: React.FC = () => {
//   const [activeView, setActiveView] = useState("historial");
//   const [qrCodeData, setQrCodeData] = useState<string>(""); // Almacenar el dato para generar el QR
//   const generateQrCode = (data: string) => {
//     const qr = QRCode(0, "L");
//     qr.addData(data);
//     qr.make();
//     return qr.createImgTag(4); // Generar el QR como imagen
//   };
//   const users = [
//     {
//       id: 1,
//       name: "Danny Venturas",
//       registrationDate: "2024-01-01",
//       lastActivity: "2024-10-10",
//     },
//     {
//       id: 2,
//       name: "Diego Sebastián",
//       registrationDate: "2024-01-02",
//       lastActivity: "2024-10-09",
//     },
//     {
//       id: 3,
//       name: "Winston Apaza",
//       registrationDate: "2024-01-03",
//       lastActivity: "2024-10-08",
//     },
//     {
//       id: 4,
//       name: "Cristopher Torres",
//       registrationDate: "2024-01-04",
//       lastActivity: "2024-10-07",
//     },
//     // Puedes añadir más usuarios aquí
//   ];

//   const renderView = () => {
//     switch (activeView) {
//       case "historial":
//         return (
//           <>
//             <h2 className="mb-4">Historial de Usuarios</h2>
//             <div className="mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Buscar por ID de usuario"
//                 // Aquí puedes agregar un manejador de eventos para realizar la búsqueda
//                 // onChange={handleSearch}
//               />
//             </div>
//             <table className="table table-bordered table-hover">
//               <thead className="table-success">
//                 <tr>
//                   <th>ID de Usuario</th>
//                   <th>Nombre</th>
//                   <th>Fecha de Registro</th>
//                   <th>Última Actividad</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user, index) => (
//                   <tr key={index}>
//                     <td>{user.id}</td>
//                     <td>{user.name}</td>
//                     <td>{user.registrationDate}</td>
//                     <td>{user.lastActivity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         );
//       case "codigo-qr":
//         return (
//           <>
//             <h2 className="mb-4">Código QR</h2>
//             <div>
//               <h3>Generar Código QR</h3>
//               <input
//                 type="text"
//                 className="form-control mb-3"
//                 placeholder="Ingrese texto para generar QR"
//                 onChange={(e) => setQrCodeData(e.target.value)} // Almacena el valor
//               />
//               <button
//                 className="btn btn-primary"
//                 onClick={() => setQrCodeData(qrCodeData)}
//               >
//                 Generar QR
//               </button>
//               <div
//                 className="mt-3"
//                 dangerouslySetInnerHTML={{
//                   __html: qrCodeData ? generateQrCode(qrCodeData) : "",
//                 }} // Renderiza el QR generado
//               ></div>
//             </div>
//           </>
//         );

//       default:
//         return <h2>Vista no disponible</h2>;
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-3 bg-primary text-white p-4">
//           <div className="bg-secondary rounded p-3 mb-4">
//             <div className="text-center mb-3 py-5">
//               <img
//                 src="/assets/admin.png"
//                 alt="Admin"
//                 className="rounded-circle"
//               />
//             </div>
//             <h4 className="text-center">ADMINISTRADOR</h4>
//             <p className="text-center">Usuario: Diego Gonzales</p>
//           </div>
//           <div className="d-grid gap-2">
//             <button
//               className="btn btn-info py-3 mb-2"
//               onClick={() => setActiveView("historial")}
//             >
//               Historial
//             </button>
//             <button
//               className="btn btn-info py-3 mb-2"
//               onClick={() => setActiveView("codigo-qr")}
//             >
//               Codigo QR
//             </button>
//             <button className="btn btn-info py-3 mb-2">Cerrar Sesión</button>
//           </div>
//         </div>
//         <div className="col-md-9 p-4">{renderView()}</div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

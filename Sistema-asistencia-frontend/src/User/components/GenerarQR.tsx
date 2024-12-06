import React, { useEffect, useState } from "react";
import QRCode from "qrcode-generator";
import "./estilos/GenerarQR.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const GenerarQR: React.FC = () => {
  const [qrCodeHtml, setQrCodeHtml] = useState<string>("");

  // Función para generar el código QR
  const generateQrCode = (data: string) => {
    if (!data) {
      alert("Por favor, ingrese un DNI válido.");
      return;
    }
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();
    setQrCodeHtml(qr.createImgTag(8));
  };

  useEffect(() => {
    // Obtener el DNI del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userDni = userData.dni;

    if (userDni) {
      generateQrCode(userDni);
    }
  }, []);

  // Función para descargar el código QR
  const downloadQrCode = () => {
    const qr = QRCode(0, "L");
    qr.addData(JSON.parse(localStorage.getItem("userData") || "{}").dni);
    qr.make();
    const imgTag = qr.createImgTag(8);
    const parser = new DOMParser();
    const doc = parser.parseFromString(imgTag, 'text/html');
    const img = doc.querySelector('img');
    if (img) {
      const imgSrc = img.getAttribute('src');
      if (imgSrc) {
        const link = document.createElement("a");
        link.download = "qrcode.jpg";
        link.href = imgSrc;
        link.click();
      }
    }
  };

  return (
    <div className="contenedor-padre">
      <div className="generar-contenedor">
        <h2>Código QR Generado</h2>
        <div
          className="mt-3 qr-output text-center"
          dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
        ></div>
        <button className="btn btn-primary download-btn" onClick={downloadQrCode}>
          Descargar QR
        </button>
      </div>
    </div>
  );
};

export default GenerarQR;

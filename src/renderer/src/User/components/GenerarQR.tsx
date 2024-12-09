// GenerarCodigoQR.tsx
import React, { useState } from "react";
import QRCode from "qrcode-generator";
import "./estilos/GenerarQR.css"

const GenerarQR: React.FC = () => {
  const [dni, setDni] = useState<string>("");
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

  return (
    <div id="user-generar">
    <div className="generar-contenedor">
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
        className="mt-3 qr-output text-center"
        dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
      ></div>
    </div>
    </div>
  );
};

export default GenerarQR;
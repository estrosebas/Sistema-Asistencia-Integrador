import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Row, Col, Button, Alert, Dropdown } from "react-bootstrap";
import { BrowserMultiFormatReader, Exception, Result } from "@zxing/library";
import "./estilos/Asistencia.css";
import axios from "axios";

// Interfaz para el registro manual de asistencia
interface RegistroManual {
  dni: string;
  evento: string;
}

// Interfaz para los datos del QR escaneado
interface QRDataType {
  id: string;
  hora: string;
  evento: string;
}

// Interfaz para los eventos
interface Evento {
  id: number;
  nombreEvento: string;
}

// URL de la API
const API_URL = import.meta.env.VITE_API_URL;

const Asistencia: React.FC = () => {
  // Estados para manejar los datos del QR, eventos seleccionados, registro manual, etc.
  const [qrData, setQrData] = useState<QRDataType | null>(null);
  const [eventoQRSeleccionado, setEventoQRSeleccionado] = useState<string>("");
  const [eventoManualSeleccionado, setEventoManualSeleccionado] = useState<string>("");
  const [registroManual, setRegistroManual] = useState<RegistroManual>({
    dni: "",
    evento: "",
  });
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ultimoEscaneo, setUltimoEscaneo] = useState<{ [key: string]: number }>({});
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");

  // Referencias para el video y el lector de QR
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const eventoQRSeleccionadoRef = useRef<string>("");

  // Función para verificar el tiempo entre escaneos
  const verificarTiempoEscaneo = (dni: string): boolean => {
    const tiempoActual = Date.now();
    const ultimoTiempo = ultimoEscaneo[dni] || 0;
    const diferencia = (tiempoActual - ultimoTiempo) / 1000 / 60;

    if (diferencia < 5) {
      setMensajeError(`El DNI ${dni} ya fue escaneado recientemente.`);
      setTimeout(() => setMensajeError(null), 2000);
      return false;
    }

    setUltimoEscaneo((prev) => ({ ...prev, [dni]: tiempoActual }));
    return true;
  };

  // Función para obtener los eventos del usuario
  const fetchEventos = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.usuarioId;

    if (!userId) {
      console.error("El ID del usuario no está disponible en el localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/auth/eventos?usuarioId=${userId}`
      );
      if (response.data.success) {
        setEventos(response.data.data);
      } else {
        console.error("No se encontraron eventos");
      }
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
    }
  };

  // Función para procesar el código QR escaneado
  const procesarQR = async (qrCode: string) => {
    const eventoActual = eventoQRSeleccionadoRef.current;
    console.log("Contenido escaneado:", qrCode);
    console.log("Evento procesado:", eventoActual);

    if (!verificarTiempoEscaneo(qrCode)) return;

    const horaRegistro = new Date().toLocaleTimeString("es-ES", { hour12: false });

    const nuevoQRData = { id: qrCode, hora: horaRegistro, evento: eventoActual };
    setQrData(nuevoQRData);

    try {
      await registrarAsistencia(qrCode, eventoActual);
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  // Función para registrar la asistencia
  const registrarAsistencia = async (dni: string, idEvento: string) => {
    const fechaRegistro = new Date();
    fechaRegistro.setHours(fechaRegistro.getHours() - 5); // Ajuste por zona horaria
    const fechaFormateada = fechaRegistro
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    try {
      const response = await axios.post(
        `${API_URL}/auth/registrar-asistencia`,
        {
          dni,
          idEvento,
          fechaRegistro: fechaFormateada,
        }
      );

      if (!response.data.success) {
        throw new Error("Error al registrar la asistencia");
      }
    } catch (error) {
      throw error;
    }
  };

  // Función para iniciar la cámara y el lector de QR
  const startCamera = async () => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      if (videoRef.current) {
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result: Result | null, error: Exception | undefined) => {
            if (result) {
              procesarQR(result.getText());
            }
            if (error && !(error instanceof Exception)) {
              console.error("Error escaneando el QR:", error);
            }
          }
        );
      }
    } catch (error) {
      console.error("Error al iniciar la cámara:", error);
    }
  };

  // Función para manejar el cambio de evento en el escáner QR
  const handleEventoQRChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoEvento = e.target.value;
    setEventoQRSeleccionado(nuevoEvento);
    eventoQRSeleccionadoRef.current = nuevoEvento; // Actualiza el valor del ref
  };

  // Función para manejar el registro manual de asistencia
  const handleRegistroManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registroManual.dni && eventoManualSeleccionado) {
      try {
        await registrarAsistencia(registroManual.dni, eventoManualSeleccionado);
        setQrData({
          id: registroManual.dni,
          hora: new Date().toLocaleTimeString("es-ES", { hour12: false }),
          evento: eventoManualSeleccionado,
        });
        setRegistroManual({ dni: "", evento: "" });
      } catch (error) {
        console.error("Error en el registro manual:", error);
      }
    }
  };

  // Efecto para cargar los eventos y comenzar la cámara al montar el componente
  useEffect(() => {
    fetchEventos();
    startCamera();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  return (
    <div className="asistencia-container">
      <h2 className="mb-4">Registro de Asistencia</h2>

      {mensajeError && (
        <Alert variant="danger" className="text-center">
          {mensajeError}
        </Alert>
      )}

      {qrData && (
        <div className="datos-escaneados-container mb-4">
          <strong>DNI:</strong> {qrData.id} | <strong>Evento:</strong>{" "}
          {qrData.evento} | <strong>Hora:</strong> {qrData.hora}
        </div>
      )}

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Escáner QR</Card.Header>
            <Card.Body>
              <Form.Select
                value={eventoQRSeleccionado}
                onChange={handleEventoQRChange}
                required
              >
                <option value="">Seleccionar evento para QR</option>
                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id.toString()}>
                    {evento.nombreEvento}
                  </option>
                ))}
              </Form.Select>
              <video ref={videoRef} style={{ width: "100%" }} autoPlay />
              {devices.length > 1 && (
                <Dropdown>
                  <Dropdown.Toggle>Cambiar Cámara</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {devices.map((device) => (
                      <Dropdown.Item
                        key={device.deviceId}
                        onClick={() => setCurrentDeviceId(device.deviceId)}
                        active={device.deviceId === currentDeviceId}
                      >
                        {device.label || `Cámara ${devices.indexOf(device) + 1}`}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Registro Manual</Card.Header>
            <Card.Body>
              <Form.Select
                value={eventoManualSeleccionado}
                onChange={(e) => setEventoManualSeleccionado(e.target.value)}
                required
              >
                <option value="">Seleccionar evento para registro manual</option>
                {eventos.map((evento) => (
                  <option key={evento.id} value={evento.id.toString()}>
                    {evento.nombreEvento}
                  </option>
                ))}
              </Form.Select>
              <Form onSubmit={handleRegistroManual}>
                <Form.Control
                  value={registroManual.dni}
                  onChange={(e) =>
                    setRegistroManual((prev) => ({
                      ...prev,
                      dni: e.target.value,
                    }))
                  }
                  placeholder="Ingrese DNI"
                />
                <Button className= "btn-success" type="submit">Registrar Asistencia</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Asistencia;

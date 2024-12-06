import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Row, Col, Button, Alert, Dropdown } from "react-bootstrap";
import { BrowserMultiFormatReader, Exception, Result } from "@zxing/library";
import "./estilos/Asistencia.css";
import axios from "axios";
interface RegistroManual {
  dni: string;
  evento: string;
}

interface QRDataType {
  id: string;
  hora: string;
  evento: string;
}

interface Evento {
  id: number;
  nombreEvento: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const Asistencia: React.FC = () => {
  const [qrData, setQrData] = useState<QRDataType | null>(null);
  const [registroManual, setRegistroManual] = useState<RegistroManual>({
    dni: "",
    evento: "",
  });
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ultimoEscaneo, setUltimoEscaneo] = useState<{ [key: string]: number }>(
    {}
  );
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const verificarTiempoEscaneo = (qrCode: string): boolean => {
    const tiempoActual = Date.now();
    const ultimoTiempo = ultimoEscaneo[qrCode] || 0;
    const diferencia = (tiempoActual - ultimoTiempo) / 1000 / 60;

    if (diferencia < 5) {
      setMensajeError(`El QR ${qrCode} ya fue escaneado recientemente.`);
      setTimeout(() => setMensajeError(null), 2000);
      return false;
    }

    setUltimoEscaneo((prev) => ({ ...prev, [qrCode]: tiempoActual }));
    return true;
  };
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
        console.log("Eventos cargados:", response.data.data);
        setEventos(response.data.data);
      } else {
        console.error("No se encontraron eventos");
      }
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
    }
  };

  const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventoSeleccionado = e.target.value;
    setEventoSeleccionado(eventoSeleccionado);
    console.log("Evento seleccionado:", eventoSeleccionado);
  };

  const procesarQR = async (qrCode: string) => {
    console.log("=== PROCESANDO QR ===");
    console.log("QR Escaneado:", qrCode);
    console.log("evento = ", eventoSeleccionado);

    if (!eventoSeleccionado) {
      console.warn("No se puede procesar QR: Evento no seleccionado");
      setMensajeError("Por favor, seleccione un evento");
      return;
    }

    if (!verificarTiempoEscaneo(qrCode)) {
      console.warn("No se puede procesar QR: Escaneo reciente");
      return;
    }

    const horaRegistro = new Date().toLocaleTimeString("es-ES", {
      hour12: false,
    });

    const nuevoQRData = {
      id: qrCode,
      hora: horaRegistro,
      evento:
        eventos.find((e) => e.id.toString() === eventoSeleccionado)
          ?.nombreEvento || eventoSeleccionado,
    };

    setQrData(nuevoQRData);

    try {
      console.log("Intentando registrar asistencia:", nuevoQRData);
      await registrarAsistencia(qrCode, eventoSeleccionado);
      console.log("Asistencia registrada exitosamente");
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  const registrarAsistencia = async (dni: string, idEvento: string) => {
    const fechaRegistro = new Date();
    fechaRegistro.setHours(fechaRegistro.getHours() - 5);
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

      console.log("Respuesta del servidor:", response.data);

      if (!response.data.success) {
        throw new Error("Error al registrar la asistencia");
      }
    } catch (error) {
      console.error("Error en registrarAsistencia:", error);
      throw error;
    }
  };

  const handleError = (error: Exception) => {
    console.error("Error escaneando el QR:", error);
  };

  const startCamera = async (deviceId?: string) => {
    console.log("Iniciando cámara...");
    // Initialize ZXing code reader
    codeReaderRef.current = new BrowserMultiFormatReader();

    try {
      // Get available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Dispositivos de video encontrados:", videoDevices);
      setDevices(videoDevices);

      // If no device ID provided, use first device or environment facing
      const selectedDeviceId =
        deviceId ||
        videoDevices.find((d) => d.label.toLowerCase().includes("back"))
          ?.deviceId ||
        videoDevices[0]?.deviceId;

      console.log("Dispositivo de cámara seleccionado:", selectedDeviceId);

      if (videoRef.current && selectedDeviceId) {
        await codeReaderRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result: Result | null, error: Exception | undefined) => {
            if (result) {
              console.log("QR leído:", result.getText());
              procesarQR(result.getText());
            }
            if (error && !(error instanceof Exception)) {
              handleError(error);
            }
          }
        );

        // Set current device ID
        setCurrentDeviceId(selectedDeviceId);
      }
    } catch (error) {
      console.error("Error al iniciar la cámara:", error);
    }
  };

  const switchCamera = (deviceId: string) => {
    // Stop current scanning
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }

    // Start with selected camera
    startCamera(deviceId);
  };

  useEffect(() => {
    fetchEventos();
    startCamera();

    console.log("DEBUGGING: eventoSeleccionado changed:", eventoSeleccionado);

    // Verify eventos are loaded
    console.log("DEBUGGING: Available eventos:", eventos);

    // Cleanup function
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const handleRegistroManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registroManual.dni && registroManual.evento) {
      try {
        await registrarAsistencia(registroManual.dni, registroManual.evento);
        setQrData({
          id: registroManual.dni,
          hora: new Date().toLocaleTimeString("es-ES", {
            hour12: false,
          }),
          evento: registroManual.evento,
        });
        setRegistroManual({ dni: "", evento: "" });
      } catch (error) {
        console.error(error);
      }
    }
  };

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
          <div className="datos-escaneados-content">
            <strong>DNI:</strong> {qrData.id}
            <span className="separador">|</span>
            <strong>Evento:</strong> {qrData.evento}
            <span className="separador">|</span>
            <strong>Hora:</strong> {qrData.hora}
          </div>
        </div>
      )}

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Escáner QR</h5>
            </Card.Header>
            <Card.Body>
              <div className="video-container">
                <video
                  ref={videoRef}
                  style={{ width: "100%" }}
                  autoPlay
                  playsInline
                />
                {devices.length > 1 && (
                  <Dropdown className="mt-2">
                    <Dropdown.Toggle variant="secondary" id="camera-dropdown">
                      Cambiar Cámara
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {devices.map((device) => (
                        <Dropdown.Item
                          key={device.deviceId}
                          onClick={() => switchCamera(device.deviceId)}
                          active={device.deviceId === currentDeviceId}
                        >
                          {device.label ||
                            `Cámara ${devices.indexOf(device) + 1}`}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
              <div className="evento-selector mt-3">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Seleccionar Evento
                  </Form.Label>
                  <Form.Select
                    value={eventoSeleccionado}
                    onChange={handleEventoChange}
                    className="form-select-lg"
                  >
                    <option value="">Seleccionar evento</option>
                    {eventos.map((evento) => (
                      <option key={evento.id} value={evento.id.toString()}>
                        {evento.nombreEvento}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Registro Manual</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleRegistroManual}>
                <Form.Group className="mb-3">
                  <Form.Label>DNI de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={registroManual.dni}
                    onChange={(e) =>
                      setRegistroManual((prev) => ({
                        ...prev,
                        dni: e.target.value,
                      }))
                    }
                    placeholder="Ingrese el DNI"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Evento</Form.Label>
                  <Form.Select
                    value={registroManual.evento}
                    onChange={(e) =>
                      setRegistroManual((prev) => ({
                        ...prev,
                        evento: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Seleccionar evento</option>
                    {eventos.map((evento) => (
                      <option key={evento.id} value={evento.id.toString()}>
                        {evento.nombreEvento}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="danger"
                    onClick={() => setRegistroManual({ dni: "", evento: "" })}
                  >
                    Cancelar
                  </Button>
                  <Button variant="success" type="submit">
                    Registrar Asistencia
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Asistencia;

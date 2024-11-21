import React, { useState, useRef, useEffect } from "react";
import { Card, Form, Row, Col, Alert, Button } from "react-bootstrap";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import "./estilos/Asistencia.css";

interface RegistroManual {
  id: string;
  grupo: string;
}

interface QRDataType {
  id: string;
  hora: string;
  grupo: string;
}

const Asistencia: React.FC = () => {
  const [qrData, setQrData] = useState<QRDataType | null>(null);
  const [mensaje, setMensaje] = useState<{
    tipo: string;
    texto: string;
  } | null>(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>("");
  const [ultimoEscaneo, setUltimoEscaneo] = useState<{ [key: string]: number }>(
    {}
  );
  const [registroManual, setRegistroManual] = useState<RegistroManual>({
    id: "",
    grupo: "",
  });
  const [escaneando, setEscaneando] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  const mostrarMensaje = (tipo: string, texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 2000);
  };

  const verificarTiempoEscaneo = (qrCode: string): boolean => {
    const tiempoActual = Date.now();
    const ultimoTiempo = ultimoEscaneo[qrCode] || 0;
    const diferencia = (tiempoActual - ultimoTiempo) / 1000 / 60;

    if (diferencia < 5) {
      mostrarMensaje(
        "warning",
        `Espere ${Math.ceil(5 - diferencia)} minutos para volver a registrar`
      );
      return false;
    }
    return true;
  };

  const validarGrupo = (): boolean => {
    if (!grupoSeleccionado) {
      mostrarMensaje("warning", "Seleccione un grupo antes de escanear");
      return false;
    }
    return true;
  };

  const obtenerCookie = (nombre: string): string | null => {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${nombre}=`);
    return partes.length === 2
      ? partes.pop()?.split(";").shift() || null
      : null;
  };

  const procesarQR = async (qrCode: string) => {
    if (!validarGrupo() || !verificarTiempoEscaneo(qrCode)) {
      return;
    }

    const horaRegistro = new Date().toLocaleTimeString("es-ES", {
      hour12: false,
    });

    const userId = obtenerCookie("user_id");
    if (!userId) {
      mostrarMensaje("danger", "No se encontró el ID de usuario");
      return;
    }

    const nuevoQRData = {
      id: qrCode,
      hora: horaRegistro,
      grupo: grupoSeleccionado,
    };

    setQrData(nuevoQRData);
    setUltimoEscaneo((prev) => ({ ...prev, [qrCode]: Date.now() }));

    try {
      await registrarAsistencia(userId, "1"); // Asumiendo eventoId = "1"
      mostrarMensaje("success", "Asistencia registrada correctamente");
    } catch (error) {
      mostrarMensaje("danger", "Error al registrar la asistencia");
      console.error(error);
    }
  };

  const iniciarEscaneo = async () => {
    if (!codeReader.current) {
      codeReader.current = new BrowserMultiFormatReader();
    }

    if (videoRef.current && !escaneando) {
      setEscaneando(true);
      try {
        await codeReader.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, err) => {
            if (result) {
              procesarQR(result.getText());
            } else if (err && !(err instanceof NotFoundException)) {
              console.error("Error escaneando el QR:", err);
              mostrarMensaje("danger", "Error al leer el código QR");
            }
          }
        );
      } catch (error) {
        console.error("Error al iniciar el escáner:", error);
        mostrarMensaje("danger", "Error al iniciar el escáner");
        setEscaneando(false);
      }
    }
  };

  const detenerEscaneo = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setEscaneando(false);
    }
  };

  const registrarAsistencia = async (idUsuario: string, idEvento: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/add-asiste`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario,
          idEvento,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al registrar la asistencia");
    }
  };

  useEffect(() => {
    iniciarEscaneo();
    return () => {
      detenerEscaneo();
    };
  }, [grupoSeleccionado]);

  const handleGrupoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrupoSeleccionado(e.target.value);
    if (mensaje?.texto === "Seleccione un grupo antes de escanear") {
      setMensaje(null);
    }
  };

  const handleRegistroManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registroManual.id && registroManual.grupo) {
      const horaRegistro = new Date().toLocaleTimeString("es-ES", {
        hour12: false,
      });

      try {
        await registrarAsistencia(registroManual.id, "1");
        setQrData({
          id: registroManual.id,
          hora: horaRegistro,
          grupo: registroManual.grupo,
        });
        mostrarMensaje("success", "Asistencia registrada correctamente");
        setRegistroManual({ id: "", grupo: "" });
      } catch (error) {
        mostrarMensaje("danger", "Error al registrar la asistencia manual");
        console.error(error);
      }
    }
  };

  return (
    <div className="asistencia-container">
      <h2 className="mb-4">Registro de Asistencia</h2>

      {mensaje && (
        <Alert
          variant={mensaje.tipo}
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{
            zIndex: 1000,
            backgroundColor:
              mensaje.tipo === "warning"
                ? "rgba(255, 243, 205, 0.9)"
                : undefined,
            borderColor:
              mensaje.tipo === "warning"
                ? "rgba(255, 238, 186, 0.9)"
                : undefined,
            color: mensaje.tipo === "warning" ? "#856404" : undefined,
          }}
        >
          {mensaje.texto}
        </Alert>
      )}

      {qrData && (
        <div className="datos-escaneados-container mb-4">
          <div className="datos-escaneados-content">
            <strong>ID:</strong> {qrData.id}
            <span className="separador">|</span>
            <strong>Grupo:</strong> {qrData.grupo}
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
                <video ref={videoRef} className="qr-video" />
              </div>

              <div className="grupo-selector mt-3">
                <Form.Group>
                  <Form.Label className="fw-bold">Seleccionar Grupo</Form.Label>
                  <Form.Select
                    value={grupoSeleccionado}
                    onChange={handleGrupoChange}
                    className="form-select-lg"
                  >
                    <option value="">Seleccionar grupo</option>
                    <option value="Grupo A">Grupo A</option>
                    <option value="Grupo B">Grupo B</option>
                    <option value="Grupo C">Grupo C</option>
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
                  <Form.Label>ID de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={registroManual.id}
                    onChange={(e) =>
                      setRegistroManual((prev) => ({
                        ...prev,
                        id: e.target.value,
                      }))
                    }
                    placeholder="Ingrese el ID"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Grupo</Form.Label>
                  <Form.Select
                    value={registroManual.grupo}
                    onChange={(e) =>
                      setRegistroManual((prev) => ({
                        ...prev,
                        grupo: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Seleccionar grupo</option>
                    <option value="Grupo A">Grupo A</option>
                    <option value="Grupo B">Grupo B</option>
                    <option value="Grupo C">Grupo C</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="danger"
                    onClick={() => setRegistroManual({ id: "", grupo: "" })}
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

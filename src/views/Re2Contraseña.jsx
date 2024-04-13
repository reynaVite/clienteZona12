import "../css/Login.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Select } from "antd";
import { UserOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { Subtitulo, Notificacion, Contenido } from "../components/Titulos";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Form, Input, Button, message, Progress } from "antd";
import { ScrollToTop } from "../components/ScrollToTop";
import CryptoJS from 'crypto-js'; // Importa CryptoJS

export function Re2Contraseña() {
  const [formValues, setFormValues] = useState({ correo: '', token: '' });
  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };
  const [form] = Form.useForm();
  const [token, setToken] = useState("");
  const [tokenValido, setTokenValido] = useState(false);

  const [codigo, setCodigo] = useState(""); // Estado para almacenar el código ingresado por el usuario
  const handleCodigoChange = (e) => {
    setCodigo(e.target.value);
  };

  // Agregar un estado para almacenar el token generado
  const [tokenGenerado, setTokenGenerado] = useState(null);
  // Función para manejar la generación del token

  const handleContinuar = async () => {
    try {
      const { correo, token } = formValues;
    

      // Realizar la solicitud al servidor para verificar el token
      const response = await axios.post("http://localhost:3000/verificar-codigo", {
        curp,
        token,
      });
      // Manejar la respuesta del servidor
      console.log("Respuesta del servidor:", response.data);
      if (response.data.valid) {
        message.success("Código válido. Procede con el cambio de contraseña.");
        setShowPasswordUpdate(true);
        // Aquí puedes realizar cualquier acción adicional después de verificar el token
      } else {
        message.error("Código no válido o ha caducado.");
      }
    } catch (error) {
      console.error("Error al verificar el código de recuperación:", error);
      message.error("Error al verificar el código de recuperación. Por favor, inténtelo de nuevo.");
    }
  };

  const [generatingCode, setGeneratingCode] = useState(false); // Estado para controlar si se está generando el código
  const handleGenerarToken = async () => {
    try {
      setGeneratingCode(true); // Establecer el estado como verdadero al iniciar la generación del código
      const response = await axios.post("http://localhost:3000/generar-token-y-enviar-correo", { curp });
      setToken(response.data.token);
      message.success("Código generado y enviado por correo");
    } catch (error) {
      message.error("Error al generar el código. Por favor, inténtelo de nuevo.");
    } finally {
      setGeneratingCode(false); // Establecer el estado como falso al finalizar la generación del código, independientemente del resultado
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const [userName, setUserName] = useState(null);
  const [pregunta, setPregunta] = useState(null);
  const [tipoPregunta, setTipoPregunta] = useState(null);
  const [correo, setCorreo] = useState(null);
  const { Option } = Select;
  const [key, setKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [tipoRecuperacion, setTipoRecuperacion] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState(null);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);

  const [contrasenaFortaleza, setContrasenaFortaleza] = useState(0);
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setContrasenaFortaleza({
        score: 0,
        nivelSeguridad: "Baja",
        color: "red"
      });
      return;
    }

    const specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
    const specialCharsCount = (password.match(specialChars) || []).length;
    score += specialCharsCount > 3 ? 3 : specialCharsCount;

    const numbers = /\d/g;
    const numbersCount = (password.match(numbers) || []).length;
    score += numbersCount > 3 ? 3 : numbersCount;

    const upperCaseLetters = /[A-Z]/g;
    const upperCaseCount = (password.match(upperCaseLetters) || []).length;
    score += upperCaseCount > 3 ? 3 : upperCaseCount;

    const lowerCaseLetters = /[a-z]/g;
    const lowerCaseCount = (password.match(lowerCaseLetters) || []).length;
    score += lowerCaseCount > 3 ? 3 : lowerCaseCount;

    let nivelSeguridad = "Baja";
    let color = "red";
    let progressPercentage = 25;

    if (score >= 6) {
      nivelSeguridad = "Medio";
      color = "orange";
      progressPercentage = 50;
    }
    if (score >= 9) {
      nivelSeguridad = "Alto";
      color = "green";
      progressPercentage = 100;
    }

    setContrasenaFortaleza({
      score: progressPercentage,
      nivelSeguridad,
      color
    });
  };

  const getPasswordStrengthText = (nivelSeguridad) => {
    switch (nivelSeguridad) {
      case "Baja":
        return "La fortaleza de la contraseña es baja. Te recomendamos mejorarla.";
      case "Medio":
        return "La fortaleza de la contraseña es media. ¡Sigue mejorando!";
      case "Alto":
        return "La fortaleza de la contraseña es alta. ¡Excelente elección!";
      default:
        return "";
    }
  };

  const mensaje = getPasswordStrengthText(contrasenaFortaleza.nivelSeguridad); // Llamada a la función para obtener el mensaje

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    calculatePasswordStrength(password);
  };

  const hasMinimumLength = (value) => value.length <= 12;
  const hasUpperCase = (value) => /[A-Z]/.test(value);
  const hasLowerCase = (value) => /[a-z]/.test(value);
  const hasNumber = (value) => /\d/.test(value);
  const hasSpecialChar = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const hasNoSpaces = (value) => !/\s/.test(value);

  useEffect(() => {
    obtenerNombreUsuario();
    obtenerPregunta();
    obtenerCorreo();
  }, []);

  useEffect(() => {
    if (pregunta) {
      obtenerTipoPregunta();
    }
  }, [pregunta]);

  const obtenerNombreUsuario = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/obtener-nombre/${curp}`
      );

      if (response.data.nombre) {
        const { nombre, aPaterno, aMaterno } = response.data;
        setUserName(`${nombre} ${aPaterno} ${aMaterno}`);
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
    }
  };

  const obtenerPregunta = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/obtener-pregunta/${curp}`
      );
      if (response.data.pregunta) {
        const { pregunta } = response.data;
        setPregunta(`${pregunta}`);
      } else {
        console.error("Error al obtener el nombre del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
    }
  };

  const obtenerTipoPregunta = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/obtener-tipo-pregunta/${pregunta}`
      );
      if (response.data.tipo_pregunta) {
        const { tipo_pregunta } = response.data;
        setTipoPregunta(`${tipo_pregunta}`);
      }
    } catch (error) {
      console.error("Error al obtener el tipo de pregunta:", error);
    }
  };

  const obtenerCorreo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/obtener-correo/${curp}`
      );
      if (response.data.correo) {
        const { correo } = response.data;
        setCorreo(`${correo}`);
      } else {
        console.error("Error al obtener el correo del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener el correo del usuario:", error);
    }
  };

  const { state } = location;
  const { curp } = state || {};
  const handleRecuperacionChange = (value) => {
    setTipoRecuperacion(value);
  };

  const onFinishh = async (values) => {
    try {
      console.log("", values);

      if (tipoRecuperacion === "pregunta") {
        // Lógica existente para pregunta secreta
        const response = await axios.post(
          "http://localhost:3000/recuperar-contrasena",
          {
            curp,
            respuesta: values.respuesta,
          }
        );

        console.log("", response.data);

        if (response.data.success) {
          setDecryptedPassword(response.data.decryptedPassword);
          setKey((prevKey) => prevKey + 1);
          message.success("Datos correctos");
          setShowPasswordUpdate(true);
        } else {
          message.error("Datos incorrectos");
        }
      }


      else if (tipoRecuperacion === "correo") {
        <Form.Item>
          <Button type="primary" onClick={handleGenerarToken} style={{ color: 'black' }}>
            Generar Token
          </Button>
        </Form.Item>
      }
    } catch (error) {
      message.error("La respuesta no es correcta.");
    }
  };
  

  const onFinishActualizarContraseña = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/actualizar-contrasena",
        {
          curp,
          contrasenaActual: values.contrasenaActual,
          nuevaContrasena: values.nuevaContrasena,
        }
      );

      
      if (response.data.success) {
        message.success("Contraseña actualizada exitosamente");
        navigate("/Login");
      } else {
        message.error(
          "Error al actualizar la contraseña. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      console.error(
        "Error al procesar solicitud de actualización de contraseña:",
        error
      );
      message.error(
        "Error al procesar solicitud de actualización de contraseña. Por favor, inténtelo de nuevo."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(<Contenido conTit={"Completa todos los campos."} />);
  };



  return (
    <>
      <Header />
      <div className="Simon">
        <ScrollToTop />
        <div className="login-box">
          <Subtitulo subTit={"Recuperación de contraseña"} />
          <Contenido conTit={"Paso 2/2: Datos de usuario"} />
          <br></br>

          <Form
            name="Re2Contrasena"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinishh}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}

          >
            {userName ? <Contenido conTit={`Nombre: ${userName}`} /> : null}
            {curp ? <Contenido conTit={`Curp: ${curp}`} /> : null}

            <br></br>

            <Contenido conTit={"Tipo de recuperación:"} />
            <Form.Item
              name="tipoRecuperacion"
              rules={[
                {
                  required: true,
                  message: (
                    <Notificacion noti={"Seleccione un tipo de recuperación"} />
                  ),
                },
              ]}
            >
              <Select
                placeholder={"Ejemplo: Pregunta secreta..."}
                suffixIcon={<IdcardOutlined />}
                onChange={handleRecuperacionChange}
              >
                <Option value="correo">Correo electrónico </Option>
                <Option value="pregunta">Pregunta secreta</Option>
              </Select>
            </Form.Item>

            {tipoRecuperacion === "correo" && (
              <>
                {" "}
                {correo ? (
                  <Contenido conTit={`Enviar código al correo: ${correo}`} />
                ) : null}
                <Form.Item>
                  <Button type="primary" onClick={handleGenerarToken}    style={{ color: 'black' }}>
                    Generar código
                  </Button>

                  {generatingCode && <p>Generando código, por favor espere...</p>} {/* Mostrar el texto de espera si se está generando el código */}


                </Form.Item>
                <Contenido conTit={"Código de recuperación."} />
                <Form.Item
                  name="token"
                  rules={[
                    {
                      required: true,
                      message: (
                        <Notificacion
                          noti={"Ingrese el código de recuperación"}
                        />
                      ),
                    }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Ingrese el token de recuperación"
                    name="token"
                    value={formValues.token}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={handleContinuar} disabled={!formValues.token}    style={{ color: 'black' }}>
                    Continuar
                  </Button>
                </Form.Item>
              </>


            )}


            {tipoRecuperacion === "pregunta" && (
              <>
                {tipoPregunta ? <Contenido conTit={`${tipoPregunta}`} /> : null}
                <Form.Item
                  name="respuesta"
                  rules={[
                    {
                      required: true,
                      message: (
                        <Notificacion
                          noti={"Ingrese la respuesta a la pregunta"}
                        />
                      ),
                    },
                    {
                      pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ0-9\s]{3,30}$/,
                      message: "Solo letras, números, longitud entre 3 y 30.",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Ingrese la respuesta"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={!formValues.respuesta}  style={{ color: 'black' }}>
                    Enviar
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>

          {/* Condición para mostrar el campo de actualización de contraseña */}
          {showPasswordUpdate && (
            <Form
              name="ActualizarContraseñaForm"
              form={form}
              initialValues={{ remember: true }}
              onFinish={onFinishActualizarContraseña}
              onFinishFailed={onFinishFailed}
              onValuesChange={handleFormValuesChange}
            >
              <Contenido conTit={"Nueva contraseña:"} />
              <Form.Item
                name="nuevaContrasena"
                rules={[
                  {
                    required: true,
                    message: (
                      <Notificacion noti={"Ingrese su nueva contraseña"} />
                    ),
                  },
                  {
                    validator: async (_, value) => {
                      try {
                        if (typeof value !== "string") {
                          throw new Error("");
                        }
                        if (/\s/.test(value)) {
                          throw new Error(
                            "La contraseña no puede contener espacios."
                          );
                        }
                        if (!hasMinimumLength(value)) {
                          throw new Error(
                            "La contraseña debe tener máximo 12 caracteres."
                          );
                        }
                        if (!hasUpperCase(value)) {
                          throw new Error(
                            "La contraseña debe contener al menos una letra mayúscula."
                          );
                        }
                        if (!hasLowerCase(value)) {
                          throw new Error(
                            "La contraseña debe contener al menos una letra minúscula."
                          );
                        }
                        if (!hasNumber(value)) {
                          throw new Error(
                            "La contraseña debe contener al menos un número."
                          );
                        }
                        if (!hasSpecialChar(value)) {
                          throw new Error(
                            "La contraseña debe contener al menos un carácter especial."
                          );
                        }
                        return Promise.resolve();
                      } catch (error) {
                        throw new Error(error.message);
                      }
                    },
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Ejemplo: Ejemplo00#"
                  onChange={handlePasswordChange}
                />
              </Form.Item>
              {mensaje && <div>{mensaje}</div>} {/* Mostrar el mensaje */}
              <Progress percent={contrasenaFortaleza.score} status="active" strokeColor={contrasenaFortaleza.color} />

              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={!formValues.nuevaContrasena} style={{ color: 'black' }}>
                  Actualizar Contraseña
                </Button>
              </Form.Item>
            </Form>
          )}

          <Link to="/ReContraseña">
            <Button type="primary" style={{ marginBottom: "16px"  , color:"black" }} >
              Ir atrás
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

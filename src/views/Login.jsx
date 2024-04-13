import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { Form, Input, Button, Select, message, notification } from "antd";
import {
  CheckCircleOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Subtitulo, Contenido } from "../components/Titulos";
import ReCAPTCHA from "react-google-recaptcha";
import { CSPMetaTag } from "../components/CSPMetaTag";
import imagen from "../img/Si.jpg";

const { Option } = Select;

export function Login() {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [buttonBlocked, setButtonBlocked] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false); // Estado de carga del botón

  // Función para manejar cambios en los valores del formulario
  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  {
 
  }

  const [userRole, setUserRole] = useState(null);
  const onChange = () => {
    console.log("Recapcha");
  };

  const navigate = useNavigate();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const onFinish = async (values) => {
    setButtonLoading(true); // Activar el estado de carga del botón

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          curp: values.curp,
          contrasena: values.contrasena,
        }
      );

      if (response.data.success) {
        console.log("Inicio de sesión exitoso");
        message.success("Inicio de sesión exitoso");
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("userCURP", formValues.curp); 
        localStorage.setItem("userPlantel", response.data.plantel);


        const userRole = response.data.role;
        setUserRole(userRole);


        if (userRole === 1 || userRole === 2 || userRole === 3) {
          navigate("/Inicio");
        } else {
          navigate("/");
        }
      } else {
        // Inicio de sesión fallido
        message.error(response.data.message || "Credenciales incorrectas");
        const updatedFailedAttempts = failedAttempts + 1;
        setFailedAttempts(updatedFailedAttempts);

        // Si hay 3 intentos fallidos, actualizar estado_cuenta a 2
        if (updatedFailedAttempts === 3) {
          try {
            message.error("Cuenta bloqueada.");
            await axios.post(
              "http://localhost:3000/updateEstadoCuenta",
              {
                curp: values.curp,
              }
            );
            setButtonBlocked(true); // Bloquear el botón
          } catch (error) {
            console.error("Error al actualizar estado_cuenta:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error("Inicio de sesión fallido: Usuario no encontrado.");
    } finally {
      setButtonLoading(false); // Desactivar el estado de carga del botón
    }
  };


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Por favor, completa todos los campos.");
  };
  return (
    <>
      <CSPMetaTag />
      <Header />
      <main className="flex lg:flex-row md:flex-col celular:flex-col">
        <ScrollToTop />
        <div className="lg:basis-2/5 mx-10 md:basis-5/5 celular:basis-4/5">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-center">
            Ingresa a tu cuenta
          </h2>
          <Form
            name="loginForm"
            className="flex lg:flex-col w-auto mt-10 md:flex-col celular:flex-col"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}
          >
            
            <Contenido conTit={"Ingrese su CURP:"} />
            <Form.Item
              name="curp"
              className="text-xl"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || typeof value !== "string") {
                      throw new Error("Ingrese su CURP");
                    }
                    const trimmedValue = value.trim();
                    if (/[a-z]/.test(trimmedValue)) {
                      throw new Error("La CURP solo debe contener mayúsculas");
                    }
                    const uppercasedValue = trimmedValue.toUpperCase();
                    const pattern = /^[A-Z]{4}\d{6}[HM]{1}[A-Z\d]{5}[0-9A-Z]{2}$/;
                    if (uppercasedValue.length !== 18) {
                      throw new Error(
                        "La CURP debe tener 18 letras mayúsculas/números)"
                      );
                    }
                    if (!pattern.test(uppercasedValue)) {
                      throw new Error("La CURP no es válida");
                    }
                    if (value !== trimmedValue) {
                      throw new Error(
                        "La CURP no debe contener espacios al inicio, en medio o al final"
                      );
                    }
                  },
                },
              ]}
            >
              <Input
                prefix={<CheckCircleOutlined />}
                placeholder="Ejemplo: MAPA850210MVERXXA1"
                className="lg:w-3/3 mb-5 py-2 px-3 mt-1 text-base shadow-md "
              />
            </Form.Item>

            <Contenido conTit={"Contraseña:"} />
            <Form.Item
              name="contrasena"
              rules={[
                {
                  required: true,
                  message: "Ingrese su contraseña",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Ingrese su contraseña"
                className="lg:w-3/3 mb-5 py-2 px-3 mt-1 text-base shadow-md"
              />
            </Form.Item>

            <div className="w-fit">
              <Link to="/ReContraseña">
                <p className="text-base py-5 -mt-10  hover:scale-110 hover:translate-x-2">
                  ¿Olvidó su contraseña?
                </p>
              </Link>
            </div>

            <Form.Item
              name="recaptcha"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value) {
                      throw new Error("Por favor, completa el reCAPTCHA");
                    }
                  },
                },
              ]}
            >
              <ReCAPTCHA
                sitekey="6LfPh4UpAAAAADrQnchMkx5WoF9InHXo0jYAt2JC"
                onChange={onChange}
              />
            </Form.Item>

            {messageText && (
              <p style={{ color: "red", textAlign: "center" }}>{messageText}</p>
            )}

            {buttonBlocked && (
              <div style={{ color: "red", marginTop: "10px" }}>
                Su cuenta ha sido bloqueada. Revise su correo para instrucciones
                de recuperación.
              </div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue_uno text-white h-11 text-lg w-3/4 
                hover-text-grays
                md:w-2/4
                celular:w-2/4 celular:mb-5 celular:mt-3"
                loading={buttonLoading}
                disabled={
                  !formValues.curp ||
                  !formValues.contrasena ||
                  !formValues.recaptcha ||
                  buttonBlocked||buttonLoading
                }
              >
                Ingresar
              </Button>
            </Form.Item>


          </Form>
        </div>
        <div className="lg:basis-3/5 lg:block md:hidden celular:hidden">
          <img
            src={imagen}
            alt=""
            className="lg:w-screen lg:block md:hidden celular:hidden object-cover lg:h-full "
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

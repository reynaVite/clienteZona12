import "../css/Login.css";
import axios from "axios";
import { CheckCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { ScrollToTop } from "../components/ScrollToTop";
import { Subtitulo, Contenido } from "../components/Titulos";

export function ReContraseña() {

  const [formValues, setFormValues] = useState({});
  const handleFormValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [curpExists, setCurpExists] = useState(null);

  const onFinish = async (values) => {
    try {
      const curpExistsResponse = await axios.post(
        "http://localhost:3000/verificar-curp",
        {
          curp: values.curp,
        }
      );

      const curpExists = curpExistsResponse.data.exists;
      const usuarioDeBaja = curpExistsResponse.data.usuarioDeBaja;

      if (curpExists) {
        if (usuarioDeBaja) {
          message.error("El usuario está dado de baja");
        } else {
          message.success("Datos correctos");
          navigate("/Re2Contraseña", {
            state: {
              curp: values.curp,
            },
          });
        }
      } else {
        message.error("La CURP no está registrada");
      }
    } catch (error) {
      console.error("Error al verificar existencia:", error);

      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        message.error("Error. Por favor, inténtalo de nuevo.");
      } else {
        message.error("Error inesperado. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Por favor, completa todos los campos.");
  };

  return (
    <>
      <Header />
      <div className="Simon">
        <ScrollToTop />
        <div className="login-box">
          <Subtitulo subTit={"Recuperación de contraseña"} />
          <Contenido conTit={"Paso 1/2: Autentificación"} />
          <br></br>

          <Form
            name="ReContrasena"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}

          >
            <Contenido conTit={"Curp:"} />
            <Form.Item
              name="curp"
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
                    const pattern = /^[A-Z\d]{4}\d{6}[HM]{1}[A-Z\d]{5}[0-9A-Z]{2}$/;
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
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!formValues.curp}
                style={{ color: 'black' }}
              >
                Continuar
              </Button>

            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}

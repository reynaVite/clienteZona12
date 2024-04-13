import React, { useState } from "react";
import { RobotOutlined } from "@ant-design/icons";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Affix, FloatButton } from "antd";
import Contenido from "../components/ChatBot";
import { Subtitulo, Titulo } from "../components/Titulos";
import "../css/Preguntas.css";
import { CSPMetaTag } from "../components/CSPMetaTag";
import { Presentacion } from "../components/Presntacion";
import icono from "../img/pregunta.png";
import CardPregunta from "../components/Pregunta";

export function Preguntas() {
  const [showChatBot, setShowChatBot] = useState(false);

  const handleOnClick = () => {
    setShowChatBot(!showChatBot);
  };
  return (
    <>
      <CSPMetaTag />
      <Affix>
        <Header />
      </Affix>
      <Presentacion
        tit={"Preguntas frecuentes"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white 
            celular:translate-x-2"
          />
        }
      />
      <CardPregunta
        pregunta={"¿Cuál es el procedimiento para registrarse en el sistema?"}
        respuesta={" El procedimiento formal implica enviar una solicitud al supervisor designado. La determinación de aceptación o rechazo de la solicitud recae en el supervisor, y el solicitante recibirá notificación por correo electrónico respecto a esta decisión. En caso de que la solicitud sea aceptada, se requiere completar el registro proporcionando exclusivamente el CURP (Clave Única de Registro de Población), seguido por el establecimiento de una contraseña y la inclusión de otros datos solicitados."}
      />

<CardPregunta
  pregunta={"¿Cuál es el procedimiento para recuperar la contraseña si la cuenta ha sido bloqueada?"}
  respuesta={"Para recuperar la contraseña, el usuario debe acceder al apartado designado como \"¿Olvidó su contraseña?\" en la página de inicio de sesión. Posteriormente, se solicitará al usuario ingresar su CURP (Clave Única de Registro de Población), y si la información es correcta, se le permitirá restaurar su contraseña mediante dos métodos previamente establecidos."}
/>



      {/* CHATBOT */}
      <div>
        <FloatButton onClick={handleOnClick} icon={<RobotOutlined />} />
        {showChatBot && (
          <div
            style={{
              position: "fixed",
              bottom: 75,
              right: 45,
              overflow: "auto",
              zIndex: 1000,
            }}
          >
            <Contenido />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

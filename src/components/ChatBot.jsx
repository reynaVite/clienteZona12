import React, { Component } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components"; 
import botAvatar from "../img/robot.png";
import userAvatar from "../img/persona.png";   

const theme = {
  background: "#f5f8fb",
  headerBgColor: "#00314A",
  headerFontColor: "#fff",
  headerFontSize: "20px",
  botBubbleColor: "#8098A5",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#000",
};

class Contenido extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <ChatBot
          botAvatar={botAvatar}
          userAvatar={userAvatar}  // Add this line to set the user avatar
          steps={[
            {
              id: "1",
              message:
                "Hola usuario. Soy tu asistente virtual, ¿cómo te llamas?",
              trigger: "2",
            },
            {
              id: "2",
              user: true,
              validator: (value) => {
                if (/^[A-ZÁÉÍÓÚ]{1}[a-záéíóú]{2,15}$/.test(value)) {
                  return true;
                } else {
                  return "Por favor ingrese un nombre valido.";
                }
              },
              trigger: "3",
            },
            {
              id: "3",
              message: "Hola {previousValue}, Encantado(a) de conocerte!",
              trigger: "4",
            },
            {
              id: "4",
              message: "¿Necesitas ayuda?",
              trigger: "5",
            },
            {
              id: "5",
              options: [
                { value: "y", label: "Si", trigger: "6A" },
                { value: "n", label: "No", trigger: "6B" },
              ],
            },
            {
              id: "6A",
              message: "¡Excelente! Dime que estas buscando...",
              trigger: "seleccion",
            },
            {
              id: "6B",
              message: "Lo siento si no puedo ser de ayuda para usted. Hasta luego",
              end: true,
            },
            {
              id: "seleccion",
              options: [
                { value: "f", label: "Como iniciar sesión", trigger: "7A" },
                { value: "b", label: "Como recuperar contraseña  ", trigger: "7B" },
              ],
            },
            {
              id: "7A",
              message:
                "Ingresa a la sección login, llena todos los campos y presiona el botón “Ingresar”",
            },
            {
              id: "7B",
              message:
                "Ingresa a la sección login, en la parte de abajo dice “¿Olvidó su contraseña?”, ingresa y llena lo solicitado. Puede recuperar su contraseña con el número de teléfono o mediante una pregunta secreta.",
            } 
          ]}
        />
      </ThemeProvider>
    );
  }
}

export default Contenido;

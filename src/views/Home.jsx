// src/views/Home.jsx
import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Subtitulo, Titulo } from "../components/Titulos";
import "../css/Inicio.css";
import { ScrollToTop } from "../components/ScrollToTop";
import inicio from "../img/imagenUno.jpg";
import { CSPMetaTag } from "../components/CSPMetaTag";
import { Divider, Image, Affix } from "antd";
import { Carrusel } from "../components/Carrusel"; 
import ConnectionStatus from "../components/ConnectionStatus";  
import { getAuth, signInAnonymously } from "firebase/auth";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase"; // Asegúrate de que la ruta sea correcta
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export function Home() {
  // Función para autenticarse
  const loguearse = () => {
    signInAnonymously(getAuth())
      .then(usuario => console.log(usuario))
      .catch(error => console.error("Error de autenticación:", error));
  };

  // Función para activar la recepción de mensajes
  const activarMensajes = async () => {
    const token = await getToken(messaging, {
      vapidKey: "BGUQaLFE9uIkwN1JxgqkPjcG9gokURPLsQQyX2UiS-9_sintKkxO3cG5TgKnIzZi02VOspT-KJNV4qmIJlhb9e8"
    }).catch(error => console.log("Tuviste un error al generar el token"));

    if (token) console.log("tu token:", token);
    if (!token) console.log("no tienes token");
  };

  // Efecto para manejar la recepción de mensajes
  useEffect(() => {
    const unsubscribe = onMessage(messaging, message => {
      console.log("tu mensaje:", message);
      toast(message.notification.title); // Mostrar notificación
    });
 
    return () => unsubscribe();
  }, []);

  return (
    <>
      <CSPMetaTag />
      <Affix>
        <Header />
      </Affix>
      <Carrusel />

      <Divider className="chiUwu" />
      <main className="flex items-center justify-center">
        <section className="container text-center mb-5 p-4 font-custom">
          <h1 className="text-4xl py-2 font-semibold"> BIENVENIDO</h1>
          <h2 className="text-2xl py-8 font-semibold"> Zona 012 </h2>
          <ConnectionStatus />
          <Divider />

          <p className="p-4 text-lg text-left leading-10">
            Supervisión Escolar Sistema Indígena Numero 12 de Huazalingo Hidalgo
            es una unidad económica registrada desde 2014-12 que se dedica a la
            actividad económica Actividades administrativas de instituciones de
            bienestar social clasificada por (SCIAN) 931610, con domicilio en ,
            Col. Guillermo Rossell, Huazalingo, Huazalingo, Hidalgo C.P. 43070,
            . Puedes contactarlos a través de 7711499741, o visitando su sitio
            web . Toda la información sobre esta empresa se ha obtenido a través
            de fuentes públicas del gobierno de Huazalingo, Hidalgo México.
          </p>
          <section className="container flex lg:flex-row md:flex flex-col mt-10">
            <div className="basis-1/2">
              <Image className="lg:min-w-max md:w-1/2" src={inicio} />
            </div>
            <div className="basis-1/2 text-left m-10 px-10">
              <h3 className="text-2xl font-semibold">Información relevante</h3>
              <p className="mt-6 text-lg leading-10">
                Es una unidad económica registrada desde 2014-12 que se dedica a
                la actividad económica, actividades administrativas de
                instituciones de bienestar social
              </p>
            </div>
          </section>

          {/* Botones para loguearse y activar mensajes */}
          <button onClick={loguearse} className="btn-loguearse">Loguearse</button>
          <button onClick={activarMensajes} className="btn-activar-mensajes">Recibir noti</button>
        </section>
      </main>

      <Footer />
      <ToastContainer /> {/* Componente para mostrar las notificaciones */}
    </>
  );
}

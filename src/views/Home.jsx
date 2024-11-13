import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Divider, Image, Affix } from "antd";
import { Subtitulo, Titulo } from "../components/Titulos";
import { ScrollToTop } from "../components/ScrollToTop";
import { Carrusel } from "../components/Carrusel"; 
import ConnectionStatus from "../components/ConnectionStatus";  
import { ToastContainer, toast } from "react-toastify";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/react";
import "../css/Inicio.css";
import inicio from "../img/imagenUno.jpg";
import "react-toastify/dist/ReactToastify.css";

export function Home() {
  useEffect(() => {
    // Google Analytics - Evento de Visualización de Página
    ReactGA.send({ hitType: "pageview", page: "/Inicio" });

    // Sentry - Evento de Carga de Página
    Sentry.captureMessage("Home page loaded", "info");

    // Evento de Firebase para autenticación anónima
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Usuario autenticado anónimamente");
      })
      .catch((error) => {
        // Sentry - Error de Firebase Auth
        Sentry.captureException(error);
        console.error("Error de autenticación anónima:", error);
      });

    // Evento de Desplazamiento (Scroll) en GA
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (scrollPercentage > 0.5) {
        ReactGA.event({
          category: "Home",
          action: "Scrolled 50%",
          label: "User scrolled halfway down the page",
        });
      }
      if (scrollPercentage > 0.9) {
        ReactGA.event({
          category: "Home",
          action: "Scrolled 90%",
          label: "User reached the end of the page",
        });
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Manejo de error de carga de imagen
  const handleImageError = (error) => {
    // Sentry - Error en Carga de Imagen
    Sentry.captureException(new Error("Error al cargar imagen de inicio"));
    console.error("Error al cargar imagen:", error);
  };

  return (
    <>
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
              <Image
                className="lg:min-w-max md:w-1/2"
                src={inicio}
                onError={handleImageError} // Manejo de error de carga de imagen
              />
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
 
        </section>
      </main>

      <Footer />
      <ToastContainer /> {/* Componente para mostrar las notificaciones */}
    </>
  );
}

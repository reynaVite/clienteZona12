import React from "react";

import { ScrollToTop } from "../components/ScrollToTop";
import { Header } from "../components/Header";

import { Footer } from "../components/Footer";

import "../css/Terminos.css";

import { Link } from "react-router-dom";

import { FloatButton, Divider } from "antd";

export function Cookies() {
  return (
    <>
      <Header />

      <div className=" flex flex-col justify-center items-center leading-8 m-10">
        <h2 className="text-2xl font-bold mb-5">Política de cookies</h2>
        <Divider className="chiUwu" />
        <ScrollToTop />
        <section className="container text-balance">
          <p className="">
            Esta política de cookies explica cómo la Zona 012 utilizan cookies y
            tecnologías similares para reconocerlo cuando visita nuestra
            aplicación, incluidas, entre otras, cualquier URL relacionada, móvil
            o localizada. versiones y dominios/subdominios relacionados ("Sitios
            web").{" "}
          </p>
          <p>
            Explica qué son estas tecnologías y por qué las utilizamos, así como
            las opciones sobre cómo controlarlas.
          </p>

          <h3 className="font-bold my-4">¿Qué es una Cookie?</h3>
          <p>
            Una cookie es un pequeño archivo de texto que se almacena en su
            computadora u otro dispositivo conectado a internet para identificar
            su navegador, proporcionar análisis, recordar información sobre
            usted, como su preferencia de idioma o información de inicio de
            sesión. Son completamente seguros y no pueden usarse para ejecutar
            programas ni enviar virus a su dispositivo.
          </p>

          <h3 className="font-bold my-4">¿Por qué utilizamos cookies?</h3>
          <p>
            Utilizamos cookies propias y/o de terceros en nuestra aplicación
            para diversos fines, tales como:
          </p>
          <ul className="list-inside list-disc mx-10 leading-8 mt-4">
            <li>
              Para facilitar el funcionamiento y la funcionalidad de nuestra
              aplicación.
            </li>
            <li>
              Para mejorar su experiencia con nuestra aplicación y hacer la
              navegación más rápida y sencilla.
            </li>
            <li>
              Para permitirnos crear una experiencia de usuario personalizada
              para usted y para que podamos entender que es útil y de interés
              para usted.
            </li>
            <li>
              Analizar cómo se utiliza nuestra aplicación y cual seria una mejor
              manera de personalizarla.
            </li>
            <li>
              Identificar prospectos futuros y personalizar las interacciones de
              marketing y ventas con ellos.
            </li>
          </ul>

          <h3 className="font-bold my-4">¿Qué tipo de cookies se usarán?</h3>
          <p>
            Las cookies pueden ser cookies de sesión o cookies persistentes. Una
            cookie de sesión caduca automáticamente cuando cierra su navegador.
            Una cookie persistente permanecerá hasta que caduque o usted elimine
            sus cookies. Las fechas de caducidad se establecen en las propias
            cookies; algunos pueden caducar después de unos minutos, mientras
            que otros pueden caducar después de varios años. Las cookies
            colocadas por el sitio web que estás visitando se denominan "cookies
            de origen".
          </p>
          <p>
            Las cookies estrictamente necesarias son necesarias para que nuestra
            aplicación funcione y no se pueden desactivar en nuestros sistemas.
            Son esenciales para permitirle navegar por la aplicación y utilizar
            sus funciones. Si elimina o desactiva estas cookies, no podemos
            garantizar que podrá utilizar nuestra aplicación.
          </p>

          <h3 className="font-bold my-4">Cookies esenciales</h3>
          <p>
            Utilizamos cookies esenciales para que nuestra aplicación funcione.
            Estas cookies son estrictamente necesarias para habilitar funciones
            básicas como la seguridad, la administración de la red, sus
            preferencias de cookies y la accesibilidad. Sin ellos no podrías
            utilizar los servicios básicos. Puede desactivarlos cambiando la
            configuración de su navegador, pero esto puede afectar el
            funcionamiento de los sitios web, tales como:
          </p>
          <ul className="list-inside list-disc mx-10 leading-8 mt-4">
            <li>Cookies de autenticación.</li>
            <li>Cookies de sesión.</li>
            <li>Cookies de seguridad.</li>
            <li>Cookies de carga balanceada.</li>
            <li>Cookies de preferencias de idioma.</li>
          </ul>

          <h3 className="font-bold my-4">
            Cookies de rendimiento y funcionalidad
          </h3>
          <p>
            Estas cookies se utilizan para mejorar el rendimiento y la
            funcionalidad de nuestra aplicación, pero no son esenciales para su
            uso. Sin embargo, sin estas cookies, es posible que determinadas
            funciones, como los vídeos, no estén disponibles o que se le
            solicite que introduzca sus datos de inicio de sesión cada vez que
            visite la aplicación, ya que no podremos recordar que ha iniciado
            sesión anteriormente, tales como:
          </p>
          <ul className="list-inside list-disc mx-10 leading-8 mt-4">
            <li>Cookies de preferencia.</li>
            <li>Cookies de rendimiento.</li>
            <li>Cookies de analítica.</li>
            <li>Cookies de caché.</li>
          </ul>

          <h3 className="font-bold my-4">Cookies no necesarias</h3>
          <p>
            Este sitio web utiliza cookies para mejorar la experiencia del
            usuario y garantizar su correcto funcionamiento. Sin embargo,
            queremos informarte que no utilizamos cookies de marketing, cookies
            de análisis y personalización y cookies para redes sociales en este
            sitio. No recopilamos ni procesamos información con fines
            publicitarios.
          </p>
          <p>
            Al navegar por este sitio, aceptas el uso de cookies esenciales y
            aquellas que contribuyen al rendimiento y la funcionalidad del
            sitio. Puedes gestionar tus preferencias de cookies en cualquier
            momento a través de la configuración de tu navegador.{" "}
          </p>

          <h3 className="font-bold my-4">¿Cómo gestionar las cookies?</h3>
          <p>
            La mayoría de los navegadores le permiten controlar las cookies a
            través de sus preferencias de 'configuración'. Sin embargo, si
            limita la capacidad de los sitios web para configurar cookies, puede
            empeorar su experiencia general de usuario, ya que ya no estará
            personalizada para usted. También puede impedirle guardar
            configuraciones personalizadas, como la información de inicio de
            sesión. Los fabricantes de navegadores proporcionan páginas de ayuda
            relacionadas con la gestión de cookies en sus productos.
          </p>

          <h3 className="font-bold my-4">
            Bloquear y deshabilitar cookies y tecnologías similares
          </h3>
          <p>
            Donde quiera que esté, también puede configurar su navegador para
            bloquear cookies y tecnologías similares, pero esta acción puede
            bloquear nuestras cookies esenciales e impedir que nuestra
            aplicación funcione correctamente, y es posible que no pueda
            utilizar todas sus funciones y servicios en su totalidad. También
            debe tener en cuenta que también puede perder cierta información
            guardada (por ejemplo, detalles de inicio de sesión guardados,
            preferencias del sitio) si bloquea las cookies en su navegador.
            Diferentes navegadores ponen a su disposición diferentes controles.
            Deshabilitar una cookie o categoría de cookie no elimina la cookie
            de su navegador; deberá hacerlo usted mismo desde su navegador; debe
            visitar el menú de ayuda de su navegador para obtener más
            información.
          </p>

          <h3 className="font-bold my-4">
            Cambios en nuestra política de cookies
          </h3>
          <p>
            Podemos cambiar nuestro Servicio y nuestras políticas, y es posible
            que necesitemos realizar cambios en esta política de cookies para
            que reflejen con precisión nuestro servicio y nuestras políticas. A
            menos que la ley exija lo contrario, le notificaremos (por ejemplo,
            a través de nuestro servicio) antes de realizar cambios en esta
            política de cookies y le daremos la oportunidad de revisarlos antes
            de que entren en vigor. Luego, si continúa utilizando el Servicio,
            estará sujeto a la política de cookies actualizada. Si no desea
            aceptar esta o cualquier política de cookies actualizada, puede
            eliminar su cuenta.
          </p>

          <h3 className="font-bold my-4">Tu consentimiento</h3>
          <p>
            Al utilizar nuestra aplicación y registrar una cuenta, por la
            presente usted acepta nuestra Política de cookies y acepta sus
            términos.
          </p>

          <h3 className="font-bold my-4">Contáctanos</h3>
          <p>Correo electrónico: zona012huazalingo@gmail.com</p>
          <p>Número: +52 771-191-3179</p>
        </section>
      </div>

      <FloatButton.BackTop />
      <Footer />
    </>
  );
}

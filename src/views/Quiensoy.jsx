import React from "react";

import { Header } from "../components/Header";

import { Footer } from "../components/Footer";

import { Subtitulo, Titulo } from "../components/Titulos";

import url from "../img/imagenDos.jpg";

import "../css/Quien.css";
import { Affix, Divider } from "antd";
import { Presentacion } from "../components/Presntacion";
import icono from "../img/acerca.png";

export function Quien() {
  return (
    <>
      <Affix>
        <Header />
      </Affix>
      <Presentacion
        tit={"¿Quienes somos?"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white 
            celular:translate-x-2"
          />
        }
      />

      <Divider className="chiUwu" />
      <div
        className="flex lg:flex-row lg:justify-center items-center 
      md:flex-col
      celular:flex-col"
      >
        <div
          className="lg:basis-1/2 lg:w-max m-6 lg:order-1 
        md:order-2 md:items-center md:justify-center md:basis-1/4 
        celular:order-2
        "
        >
          <img src={url} alt="" className="lg:w-full md:w-full md:m-auto" />
        </div>

        <div
          className="lg:basis-1/2 lg:text-lg leading-8 lg:order-2  
        md:order-1 md:m-10 md:text-lg
        celular:text-base celular:m-8"
        >
          <h2 className="text-4xl font-semibold py-10">Somos zona 012!!</h2>
          <p>
            Nuestra misión en la Zona Escolar de Escuelas Primarias Indígenas es
            proporcionar una educación de calidad que sea accesible, inclusiva y
            equitativa para todos los niños de nuestras comunidades indígenas.
            Nos esforzamos por preservar y promover la rica diversidad cultural
            y lingüística de nuestras comunidades a través de un currículo que
            refleje sus valores y tradiciones únicas. Estamos comprometidos a
            fomentar un ambiente de aprendizaje seguro, respetuoso y acogedor
            que permita a cada estudiante alcanzar su máximo potencial.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

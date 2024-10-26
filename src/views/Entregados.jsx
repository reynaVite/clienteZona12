import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion"; 
import axios from "axios";
import { Card, Button } from "antd";
import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/calendario.png";
import { Affix } from "antd";
import "../css/Login.css";

export function Entregados() {
  const [actividadesEntregadas, setActividadesEntregadas] = useState([]);

  useEffect(() => {
    obtenerActEntre();
  }, []);

  const obtenerActEntre = async () => {
    try {
      const response = await axios.get("https://servidor-zonadoce.vercel.app/consultarPDF");
      setActividadesEntregadas(response.data); 
    } catch (error) {
      console.error("Error al obtener actividades entregadas:", error);
    }
  };

  const agruparActividadesPorTitulo = () => {
    return actividadesEntregadas.reduce((acc, actividad) => {
      if (!acc[actividad.titulo]) {
        acc[actividad.titulo] = [];
      }
      acc[actividad.titulo].push(actividad);
      return acc;
    }, {});
  };

  const actividadesAgrupadas = agruparActividadesPorTitulo();

  const verPDF = async (id) => {
    try {
      const response = await axios.get(`https://servidor-zonadoce.vercel.app/obtenerPDF/${id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
    }
  };

  return (
    <>
      <Affix>
        <Header />
      </Affix>
      <Presentacion
        tit={"Entregables de actividades"}
        icono={<img src={icono} className="lg:w-[280px] text-white celular:translate-x-2 lg:z-50" alt="Icono de calendario" />}
      />
      <div className="lg:w-10/12 lg:m-auto">
        <ScrollToTop />
        <div className="mt-5">
          <h2 className="mt-8 text-2xl font-bold text-center">Actividades Entregadas</h2>
          {Object.keys(actividadesAgrupadas).map(titulo => (
            <div key={titulo} className="p-6">
              <h3 className="text-xl font-bold">{titulo}</h3>
              <div className="grid gap-4 mt-4">
                {actividadesAgrupadas[titulo].map(actividad => (
                  <Card key={actividad.id} title={`CURP: ${actividad.curp}`}>
                    <p>ID Actividad: {actividad.id}</p>
                    <Button onClick={() => verPDF(actividad.id)}>Ver PDF</Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

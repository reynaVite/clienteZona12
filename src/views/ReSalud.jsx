import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { Space, Table, Spin, Tag, Button, Select, Affix, message, Modal, Alert, Form, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import icono from "../img/salud.png"; 
import jsPDF from "jspdf";

import { UserOutlined, LockOutlined, CheckCircleOutlined, PhoneOutlined, IdcardOutlined, DownloadOutlined } from "@ant-design/icons";

import { Subtitulo, Titulo } from "../components/Titulos";

export function ReSalud() {
 
  const handleDescargarTabla = async () => {
    try {
      const response = await axios.get("http://localhost:3000/saludAlumRe", { responseType: "blob" });
      const blob = response.data;
      
      // Convertir el Blob en una cadena de texto
      const reader = new FileReader();
      reader.onload = function(event) {
        const data = event.target.result;
        
        // Crear un nuevo documento PDF
        const doc = new jsPDF();
        
        // Agregar el contenido del Blob como texto al PDF
        doc.text(data, 10, 10);
        
        // Descargar el PDF
        doc.save("tabla_salud_alumnos.pdf");
      };
      reader.readAsText(blob);
    } catch (error) {
      console.error("Error al descargar la tabla de salud de los alumnos:", error);
      message.error("Error al descargar la tabla de salud de los alumnos");
    }
  };


  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Panel de salud"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50"
          />
        }
      />
      <Titulo tit={"Datos médicos del alumno"} />
       

      
      <div style={{ textAlign: "center" }}>
        <Button type="primary" style={{ color: 'black' }} onClick={handleDescargarTabla} icon={<DownloadOutlined /> }>
          Descargar Tabla
        </Button>
      </div><br></br>
      <Footer />
    </>
  );
}

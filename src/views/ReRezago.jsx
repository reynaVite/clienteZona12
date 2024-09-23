import React from "react";
import { Button } from "antd";
import axios from "axios";
import jsPDF from "jspdf";
import {
  Chart,
  BarElement,
  LinearScale,
  BarController,
  CategoryScale,
} from "chart.js";
import logo from "../img/2.png";
import hidalgo from "../img/hidalgo.png";

Chart.register(BarElement, LinearScale, BarController, CategoryScale);

const downloadPDF = async (datos) => {
  const pdf = new jsPDF("p", "pt", "letter");

  // Cargar imágenes con calidad reducida
  const imgLogo = new Image();
  imgLogo.src = logo;
  const imgHidalgo = new Image();
  imgHidalgo.src = hidalgo;

  imgLogo.onload = () => {
    imgHidalgo.onload = () => {
      pdf.addImage(imgLogo, "PNG", 450, 30, 100, 80, undefined, "FAST");
      pdf.addImage(imgHidalgo, "PNG", 350, 30, 80, 80, undefined, "FAST");

      // Añadir información general
      let yPos = 50;
      pdf.text(`Reporte de Evaluación`, 50, yPos);
      yPos += 20;
      pdf.text(`Total de alumnos: ${datos.length}`, 50, yPos);
      yPos += 30;

      // Opciones para cada habilidad
      const opcionesHabilidades = {
        habilidad_lectura: ["Bajo", "Medio", "Alto"],
        habilidad_escritura: ["Bajo", "Medio", "Alto"],
        habilidad_matematica: ["Bajo", "Medio", "Alto"],
        participacion: ["Bajo", "Medio", "Alto"],
        comportamiento: ["Malo", "Regular", "Bueno"],
      };

      const habilidades = [
        "habilidad_lectura",
        "habilidad_escritura",
        "habilidad_matematica",
        "participacion",
        "comportamiento",
      ];

      habilidades.forEach((habilidad, index) => {
        const conteoOpciones = opcionesHabilidades[habilidad].reduce(
          (acc, opcion) => {
            acc[opcion] = 0;
            return acc;
          },
          {}
        );

        datos.forEach((alumno) => {
          const valor = alumno[habilidad];
          if (valor in conteoOpciones) {
            conteoOpciones[valor]++;
          }
        });

        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 200;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const data = {
          labels: Object.keys(conteoOpciones),
          datasets: [
            {
              label: habilidad,
              data: Object.values(conteoOpciones),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        };

        const options = {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          animation: false,
        };

        new Chart(ctx, {
          type: "bar",
          data,
          options,
        });

        // Añadir gráfico al PDF
        setTimeout(() => {
          const imgData = canvas.toDataURL("image/jpeg", 0.5); // Reducir calidad de imagen al 50%
          pdf.text(`Gráfico de ${habilidad}`, 50, yPos);
          pdf.addImage(
            imgData,
            "JPEG",
            50,
            yPos + 20,
            canvas.width / 2,
            canvas.height / 2
          ); // Escalar imagen
          yPos += canvas.height / 2 + 50;

          // Limpiar el canvas
          canvas.parentNode.removeChild(canvas);
          if (index === habilidades.length - 1) {
            // Guardar y descargar el PDF
            pdf.save("reporte.pdf");
          }
        }, 500); // Reducir el tiempo de espera
      });
    };
  };
};

const obtenerDatos = async () => {
  try {
    const response = await axios.get("http://localhost:3000/rezagoAlumno");
    console.log("Datos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

const handleClick = async () => {
  try {
    const response = await obtenerDatos();
    downloadPDF(response);
  } catch (error) {
    console.error("Error al obtener los datos o descargar el PDF:", error);
  }
};

const ReRezago = () => {
  return (
    <div>
      <Button
        onClick={handleClick}
        type="primary"
        style={{
          marginBottom: "1rem",
          color: "black",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Descargar reporte
      </Button>
    </div>
  );
};

export default ReRezago;

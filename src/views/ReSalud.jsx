import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { Space, Table, Spin, Tag, Button, Select, Affix, message, Modal, Alert, Form, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import icono from "../img/salud.png";
import jsPDF from "jspdf";

import logo from "../img/2.png";
import hidalgo from "../img/hidalgo.png";

import { UserOutlined, LockOutlined, CheckCircleOutlined, PhoneOutlined, IdcardOutlined, DownloadOutlined } from "@ant-design/icons";

import { Chart, BarElement, LinearScale, BarController, CategoryScale } from 'chart.js';
Chart.register(BarElement, LinearScale, BarController, CategoryScale);

import { Subtitulo, Titulo } from "../components/Titulos";


const downloadPDF = async (datos) => {
  // Iniciar la creación del PDF
  const pdf = new jsPDF('p', 'pt', 'letter');
  let alumnosConAlergias = 0; // Declaración fuera del ámbito condicional

  // Establecer la fuente y el tamaño de fuente predeterminados para todo el PDF
  pdf.setFont('times');
  pdf.setFontSize(12);

  // Eliminar el canvas existente si lo hay
  const canvasExistente = document.getElementById('grafica');
  if (canvasExistente) {
    canvasExistente.parentNode.removeChild(canvasExistente);
  }

  const datosSaludAlumnos = datos.filter(alumno => alumno.salud && alumno.salud.length > 0);

  // Obtener los pesos y estaturas de los alumnos
  const datosPesoAlumnos = [];
  const datosEstaturaAlumnos = [];
  datosSaludAlumnos.forEach(alumno => {
    const peso = alumno.salud.find(dato => dato.categoria === 'Peso');
    const estatura = alumno.salud.find(dato => dato.categoria === 'Estatura');
    if (peso && estatura) {
      datosPesoAlumnos.push(parseFloat(peso.valor));
      datosEstaturaAlumnos.push(parseFloat(estatura.valor));
    }
  });

  // Obtener etiquetas de alumnos
  const etiquetasAlumnos = datosSaludAlumnos.map((alumno, index) => `Alumno ${index + 1}`);

  // Calcular promedio de peso
  const sumaPesos = datosPesoAlumnos.reduce((total, peso) => total + peso, 0);
  const promedioPeso = sumaPesos / datosPesoAlumnos.length;

  // Calcular promedio de estatura
  const sumaEstaturas = datosEstaturaAlumnos.reduce((total, estatura) => total + estatura, 0);
  const promedioEstatura = sumaEstaturas / datosEstaturaAlumnos.length;

  // Agregar imágenes al PDF
  const imgLogo = new Image();
  imgLogo.src = logo;
  const imgHidalgo = new Image();
  imgHidalgo.src = hidalgo;

  imgLogo.onload = () => {
    imgHidalgo.onload = () => {
      pdf.addImage(imgLogo, 'PNG', 450, 30, 100, 80);
      pdf.addImage(imgHidalgo, 'PNG', 350, 30, 80, 80);

      // Agregar información general al PDF
      const { curp, grado_id, grupo, plantel_nombre } = datos[0].resultadosConCurp;
      let yPos = 50;
      pdf.text(`Docente: ${curp}`, 50, yPos);
      yPos += 20;
      pdf.text(`Plantel: ${plantel_nombre}`, 50, yPos);
      yPos += 20;
      pdf.text(`Grado: ${grado_id}`, 50, yPos);
      pdf.text(`Grupo: ${grupo}`, 100, yPos);
      yPos += 30;
      pdf.text(`Total de alumnos: ${datosSaludAlumnos.length}`, 50, yPos);
      yPos += 20;

      // Mostrar la suma en la consola
      pdf.text(`Gráfico de Peso`, 250, yPos);
      yPos += 20;
      pdf.text(`Promedio de peso: ${promedioPeso.toFixed(2)} kg`, 50, yPos);
      yPos += 20;

      // Crear el lienzo para la gráfica de peso con un tamaño específico
      const canvasPeso = document.createElement('canvas');
      canvasPeso.id = 'graficaPeso';
      const canvasWidth = 500; // Ancho deseado
      const canvasHeight = 200; // Alto deseado
      canvasPeso.width = canvasWidth;
      canvasPeso.height = canvasHeight;

      document.body.appendChild(canvasPeso);
      const ctxPeso = canvasPeso.getContext('2d');

      const dataPeso = {
        labels: etiquetasAlumnos,
        datasets: [{
          label: 'Peso',
          data: datosPesoAlumnos,
          backgroundColor: 'rgba(128, 0, 128, 0.2)', // Morado con una opacidad del 20%
          borderColor: 'rgba(128, 0, 128, 1)', // Morado sólido
          borderWidth: 1
        }]
      };

      const optionsPeso = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      const graficaPeso = new Chart(ctxPeso, {
        type: 'bar',
        data: dataPeso,
        options: optionsPeso
      });

      // Renderizar la gráfica de peso
      graficaPeso.render();


      // Mostrar la suma en la consola
      console.log("Datos de peso de los alumnos:", datosPesoAlumnos);
      console.log("Etiquetas de los alumnos:", etiquetasAlumnos);

      // Agregar espacio entre gráficas
      yPos += canvasHeight + 50;

      // Mostrar la gráfica de estatura
      pdf.text(`Gráfico de Estatura`, 250, yPos);
      yPos += 20;
      pdf.text(`Promedio de estatura: ${promedioEstatura.toFixed(2)} cm`, 50, yPos);
      yPos += 20;

      // Crear el lienzo para la gráfica de estatura con un tamaño específico
      const canvasEstatura = document.createElement('canvas');
      canvasEstatura.id = 'graficaEstatura';
      canvasEstatura.width = canvasWidth;
      canvasEstatura.height = canvasHeight;

      document.body.appendChild(canvasEstatura);
      const ctxEstatura = canvasEstatura.getContext('2d');

      const dataEstatura = {
        labels: etiquetasAlumnos,
        datasets: [{
          label: 'Estatura',
          data: datosEstaturaAlumnos,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      };

      const optionsEstatura = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      const graficaEstatura = new Chart(ctxEstatura, {
        type: 'bar',
        data: dataEstatura,
        options: optionsEstatura
      });

      // Renderizar la gráfica de estatura
      graficaEstatura.render();

      if (datos && datos.length > 0) {

        if (datos && datos.length > 0) {
          alumnosConAlergias = datos.filter(item => item.alergias && item.alergias.length > 0).length;
        } else {
          console.error("El objeto 'datos' está indefinido o vacío.");
        }

      }


      /// Contar la cantidad de alumnos con alergias y clasificarlas por tipo de alergia
      const alergiasPorTipo = {};
      datos.forEach(alumno => {
        if (alumno.alergias && alumno.alergias.length > 0) {
          alumno.alergias.forEach(alergia => {
            const tipoAlergia = alergia.alergia;
            if (!alergiasPorTipo[tipoAlergia]) {
              alergiasPorTipo[tipoAlergia] = 0;
            }
            alergiasPorTipo[tipoAlergia]++;
          });
        }
      });
      // Crear un gráfico de barras para la cantidad de alumnos con alergias
      const canvasAlergias = document.createElement('canvas');
      canvasAlergias.id = 'graficaAlergias';
      canvasAlergias.width = canvasWidth;
      canvasAlergias.height = canvasHeight;

      document.body.appendChild(canvasAlergias);
      const ctxAlergias = canvasAlergias.getContext('2d');

      const dataAlergias = {
        labels: Object.keys(alergiasPorTipo),
        datasets: [{
          label: 'Cantidad de Alumnos',
          data: Object.values(alergiasPorTipo),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };

      const optionsAlergias = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      const graficaAlergias = new Chart(ctxAlergias, {
        type: 'bar',
        data: dataAlergias,
        options: optionsAlergias
      });

      // Renderizar la gráfica de alergias
      graficaAlergias.render();

      // Contar la cantidad de alumnos por tipo de discapacidad
      const discapacidadesPorTipo = {};
      datos.forEach(alumno => {
        if (alumno.discapacidad && alumno.discapacidad.length > 0) {
          alumno.discapacidad.forEach(discapacidad => {
            const tipoDiscapacidad = discapacidad.nombre;
            if (!discapacidadesPorTipo[tipoDiscapacidad]) {
              discapacidadesPorTipo[tipoDiscapacidad] = 0;
            }
            discapacidadesPorTipo[tipoDiscapacidad]++;
          });
        }
      });

      // Crear el array de datos para el gráfico de barras de discapacidades
      const dataDiscapacidades = {
        labels: Object.keys(discapacidadesPorTipo),
        datasets: [{
          label: 'Cantidad de Alumnos',
          data: Object.values(discapacidadesPorTipo),
          backgroundColor: 'rgba(255, 159, 64, 0.2)', // Anaranjado con una opacidad del 20%
          borderColor: 'rgba(255, 159, 64, 1)', // Anaranjado sólido
          borderWidth: 1
        }]
      };


      // Crear un lienzo para el gráfico de barras de discapacidades
      const canvasDiscapacidades = document.createElement('canvas');
      canvasDiscapacidades.id = 'graficaDiscapacidades';
      canvasDiscapacidades.width = canvasWidth;
      canvasDiscapacidades.height = canvasHeight;

      document.body.appendChild(canvasDiscapacidades);
      const ctxDiscapacidades = canvasDiscapacidades.getContext('2d');

      const optionsDiscapacidades = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      const graficaDiscapacidades = new Chart(ctxDiscapacidades, {
        type: 'bar',
        data: dataDiscapacidades,
        options: optionsDiscapacidades
      });

      // Renderizar la gráfica de discapacidades
      graficaDiscapacidades.render();


      // Contar la cantidad de alumnos por tipo de vacuna
      const vacunasPorTipo = {};
      datos.forEach(alumno => {
        if (alumno.vacunas && alumno.vacunas.length > 0) {
          alumno.vacunas.forEach(vacuna => {
            const tipoVacuna = vacuna.nombre;
            if (!vacunasPorTipo[tipoVacuna]) {
              vacunasPorTipo[tipoVacuna] = 0;
            }
            vacunasPorTipo[tipoVacuna]++;
          });
        }
      });

      // Crear el array de datos para el gráfico de barras de vacunas
      const dataVacunas = {
        labels: Object.keys(vacunasPorTipo),
        datasets: [{
          label: 'Cantidad de Alumnos',
          data: Object.values(vacunasPorTipo),
          backgroundColor: 'rgba(50, 205, 50, 0.2)', // Verde con una opacidad del 20%
          borderColor: 'rgba(50, 205, 50, 1)', // Verde sólido
          borderWidth: 1
        }]
      };


      // Crear un lienzo para el gráfico de barras de vacunas
      const canvasVacunas = document.createElement('canvas');
      canvasVacunas.id = 'graficaVacunas';
      canvasVacunas.width = canvasWidth;
      canvasVacunas.height = canvasHeight;

      document.body.appendChild(canvasVacunas);
      const ctxVacunas = canvasVacunas.getContext('2d');

      const optionsVacunas = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      const graficaVacunas = new Chart(ctxVacunas, {
        type: 'bar',
        data: dataVacunas,
        options: optionsVacunas
      });

      // Renderizar la gráfica de vacunas
      graficaVacunas.render();



      setTimeout(() => {
        // Generar las imágenes de las gráficas en formato PNG
        const imgDataPeso = canvasPeso.toDataURL('image/png');
        const imgDataEstatura = canvasEstatura.toDataURL('image/png');
        const imgDataAlergias = canvasAlergias.toDataURL('image/png');
        const imgDataDiscapa = canvasDiscapacidades.toDataURL('image/png');
        const imgDataVacunas = canvasVacunas.toDataURL('image/png');

        // Agregar la imagen de la gráfica de peso al PDF 
        pdf.addImage(imgDataPeso, 'PNG', 50, 220, canvasWidth, canvasHeight);

        // Agregar la imagen de la gráfica de estatura al PDF
        pdf.addImage(imgDataEstatura, 'PNG', 50, yPos, canvasWidth, canvasHeight);

        // Eliminar los canvas de las gráficas
        canvasPeso.parentNode.removeChild(canvasPeso);
        canvasEstatura.parentNode.removeChild(canvasEstatura);
        canvasAlergias.parentNode.removeChild(canvasAlergias);
        canvasDiscapacidades.parentNode.removeChild(canvasDiscapacidades);
        canvasVacunas.parentNode.removeChild(canvasVacunas);

        // Agregar una nueva página para los datos de alergias, discapacidades y vacunas
        pdf.addPage();

        let yPosAlergias = 50; // Posición vertical inicial para los datos de alergias

        pdf.text(`Gráfico de alergias`, 250, yPosAlergias);
        pdf.addImage(imgDataAlergias, 'PNG', 50, 70, canvasWidth, canvasHeight);

        pdf.text(`Gráfico de discapacidades`, 250, 300);
        pdf.addImage(imgDataDiscapa, 'PNG', 50, 300, canvasWidth, canvasHeight);

        pdf.text(`Gráfico de vacunas`, 250, 530);
        pdf.addImage(imgDataVacunas, 'PNG', 50, 530, canvasWidth, canvasHeight);

        // Guardar y descargar el PDF
        pdf.save("reporte.pdf");
      }, 3000); // Esperar 3 segundos antes de generar el PDF
    };
  };
};











const obtenerGrado_Grupo = async () => {
  try {
    const response = await axios.get("http://localhost:3000/ObtenerGruGra");
    console.log("Datos obtenidos:", response.data);
    return response.data; // Devuelve los datos obtenidos para usarlos en otra parte del código
  } catch (error) {
    console.error("Error al obtener valores de las categorias:", error);
  }
};


const handleClick = async () => {
  try {
    // Llama a la función obtenerGrado_Grupo para obtener los datos
    const response = await obtenerGrado_Grupo();

    // Llama a la función downloadPDF con los datos obtenidos
    downloadPDF(response);
  } catch (error) {
    console.error("Error al obtener los datos o descargar el PDF:", error);
  }
};


export function ReSalud() {

  return (
    <>
      <Affix>
        <Header />
      </Affix>
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
      <main className="max-w-full lg:flex flex-row justify-center"> {/* Añadido justify-center para centrar horizontalmente */}
      <Button 
      onClick={handleClick} 
      type="primary" 
      style={{ marginBottom: '1rem', color: 'black', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      Descargar reporte
    </Button>
      </main>
      <Footer />
    </>
  );
}

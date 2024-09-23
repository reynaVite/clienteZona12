import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Affix, message, Modal, Upload } from "antd";
import axios from "axios";
import { Table } from "antd";
import { Titulo } from "../components/Titulos";
import moment from 'moment';
import 'moment/locale/es';
import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/evidencia.png";
import "../css/Login.css";

export function Evidencias() {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [fileList, setFileList] = useState([]); 

  const obtenerActividades = async () => {
    try {
      const userRole = localStorage.getItem("userRole") || "guest"; // Obtener el rol del usuario
      const response = await axios.get("http://localhost:3000/consultarActividadesId", {
        params: { role: userRole } // Enviar el rol como parámetro
      });
      console.log("Actividades obtenidas:", response.data);
  
      // Filtrar actividades que no tienen registros en evidenciasPDF para la CURP actual
      const actividadesFiltradas = await Promise.all(response.data.map(async (actividad) => {
        const existe = await verificarExistencia(actividad.id);
        return { ...actividad, existe };
      }));
  
      setActividades(actividadesFiltradas.filter(actividad => !actividad.existe));
    } catch (error) {
      console.error("Error al obtener las actividades:", error);
    }
  };
  

  useEffect(() => {
    obtenerActividades();
  }, []);

 

  const handleEntregar = (record) => {
    setActividadSeleccionada(record);
  };

  const handleCloseModal = () => {
    setActividadSeleccionada(null);
    setFileList([]); // Limpiar la lista de archivos al cerrar el modal
  };

  const handleFileChange = ({ file, fileList }) => {
    // Limitar la cantidad de archivos a 1
    if (fileList.length > 1) {
      message.error('Solo se permite subir un archivo.');
      return false; // Detener la subida de archivos adicionales
    }
    setFileList(fileList);
  };
  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error('Por favor, selecciona un archivo PDF para subir.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);
    formData.append('actividadId', actividadSeleccionada.id);
  
    // Obtener la CURP del localStorage
    const userCURP = localStorage.getItem("userCURP") || ""; 
    formData.append('curp', userCURP); // Añadir la CURP al FormData
  
    try {
      const response = await axios.post("http://localhost:3000/subirPdf", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        message.success('Archivo PDF subido exitosamente');
        handleCloseModal();
        obtenerActividades();
      } else {
        message.error('Error al subir el archivo PDF');
      }
    } catch (error) {
      console.error('Error al subir el archivo PDF:', error);
      message.error('Error al subir el archivo PDF');
    }
  };
  
  
  const verificarExistencia = async (actividadId) => {
    const userCURP = localStorage.getItem("userCURP") || ""; // Obtener CURP del localStorage
    try {
      const response = await axios.get(`http://localhost:3000/verificarExistencia/${actividadId}`, {
        params: { curp: userCURP } // Enviar CURP como parámetro de consulta
      });
      return response.data.existe; // Devuelve true o false
    } catch (error) {
      console.error('Error al verificar la existencia:', error);
      return false; // Manejo de errores
    }
  };
  
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Fecha Solicitada",
      dataIndex: "fecha_sol",
      key: "fecha_sol",
      render: (text) => moment(text).format('LL')
    },
    {
      title: "Hora Solicitada",
      dataIndex: "hora_sol",
      key: "hora_sol",
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleEntregar(record)} icon={<EditOutlined />}>Entregar</Button>
        </div>
      )
    }
  ];

  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Evidencias"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50"
          />
        }
      />
      <div className="lg:w-10/12 lg:m-auto">
        <ScrollToTop />
        <section className="basis-3/4 mx-5">
          <Titulo tit={"Lista de actividades"} />
          <div className="overflow-x-auto">
            <Table
              bordered
              columns={columns}
              dataSource={actividades}
              className="snap-x"
              rowKey="id"
            />
          </div>
        </section>
      </div>

      <Footer />

      <Modal
        title="Detalles de la actividad"
        visible={!!actividadSeleccionada}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>Cerrar</Button>,
          <Button key="submit"   onClick={handleSubmit}>Entregar PDF</Button>
        ]}
      >
        {actividadSeleccionada && (
          <div style={{ textAlign: 'left', padding: '5px' }}>
            <div>
              <strong>ID:</strong> {actividadSeleccionada.id}
            </div>
            <div>
              <strong>{actividadSeleccionada.titulo}</strong>
            </div>
            <div>
              <strong>Descripción:</strong> {actividadSeleccionada.descripcion}
            </div>
            <div>
              <strong>Fecha y hora solicitada:</strong> {moment(actividadSeleccionada.fecha_sol).format('LL')},  {actividadSeleccionada.hora_sol}
            </div>

            <div style={{ marginTop: '20px' }}>
              <Upload
                accept="application/pdf"
                listType="text"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Evitar la carga automática de archivos
                maxCount={1} // Limitar a 1 archivo
              >
                <Button icon={<UploadOutlined />} disabled={fileList.length >= 1}>Seleccionar PDF</Button>
              </Upload>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
}

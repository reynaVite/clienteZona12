import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Affix, message, Form, Upload, Modal } from "antd";
import axios from "axios";
import { Table } from "antd";

import { Contenido, Titulo } from "../components/Titulos";
import moment from 'moment';
import 'moment/locale/es';

import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/evidencia.png";
import "../css/Login.css";

export function Evidencias() {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [imagenList, setImagenList] = useState([]);

  const obtenerActividades = async () => {
    try {
      const response = await axios.get("http://localhost:3000/consultarActividadesId");
      console.log("Actividades obtenidas:", response.data);
      setActividades(response.data);
    } catch (error) {
      console.error("Error al obtener las actividades:", error);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  const handleUploadChange = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} archivo subido exitosamente`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} fallo al subir el archivo.`);
    }
  };

  const handleChange = (allValues) => {
    console.log(allValues);
  };

  const handleEntregar = (record) => {
    setActividadSeleccionada(record);
  };

  const handleCloseModal = () => {
    setActividadSeleccionada(null);
    setImagenList([]); // Limpiar la lista de imágenes al cerrar el modal
  };

  const handleImagenChange = ({ file, fileList }) => {
    // Limitar la cantidad de archivos a 5
    if (fileList.length > 5) {
      message.error('Solo se permiten subir hasta 5 imágenes.');
      return false; // Detener la subida de archivos adicionales
    }
    setImagenList(fileList);
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

      {/* Modal para mostrar detalles de la actividad */}
      <Modal
        title="Detalles de la actividad"
        visible={!!actividadSeleccionada}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>Cerrar</Button>
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
                accept="image/*"
                listType="picture"
                fileList={imagenList}
                onChange={handleImagenChange}
                multiple={true}
                beforeUpload={() => false} // Evitar la carga automática de archivos
                maxCount={5} // Limitar a 5 imágenes
              >
                <Button icon={<UploadOutlined />} disabled={imagenList.length >= 5}>Seleccionar Imágenes</Button>
              </Upload>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
}

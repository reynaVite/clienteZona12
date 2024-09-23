import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { EditOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Affix, message, Modal, Upload } from "antd";
import axios from "axios";
import { Table } from "antd";
import { Titulo } from "../components/Titulos";
import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/evidencia.png";
import "../css/Login.css";

export function CambiosEvidencia() {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await axios.get("http://localhost:3000/ConcultarevidenciasPDF");
        setActividades(response.data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };

    fetchActividades();
  }, []);

  const handleEntregar = (record) => {
    setActividadSeleccionada(record);
  };

  const handleCloseModal = () => {
    setActividadSeleccionada(null);
    setFileList([]);
  };

  const handleEliminar = async (record) => {
    try {
      await axios.delete(`http://localhost:3000/eliminarEvidencia/${record.id}`);
      setActividades(actividades.filter(item => item.id !== record.id));
      message.success('Actividad eliminada correctamente');
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      message.error('Error al eliminar actividad');
    }
  };

  const handleEditar = (record) => {
    setActividadSeleccionada(record);
    setEditModalVisible(true);
  };

  const handleEditarSubmit = async () => {
    if (fileList.length === 0) {
      message.error('Por favor, selecciona un archivo PDF para subir.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);
    formData.append('actividadId', actividadSeleccionada.id);

    try {
      await axios.put(`http://localhost:3000/editarEvidencia/${actividadSeleccionada.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setEditModalVisible(false);
      message.success('Archivo PDF actualizado correctamente');
      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar actividad:", error);
      message.error('Error al actualizar actividad');
    }
  };

  const handleDescargar = async (record) => {
    try {
      const response = await axios.get(`http://localhost:3000/descargarEvidencia/${record.id}`, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evidencia_${record.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup the URL object after download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar archivo:", error);
      message.error('Error al descargar archivo');
    }
  };

  const handleFileChange = ({ file, fileList }) => {
    if (fileList.length > 1) {
      message.error('Solo se permite subir un archivo.');
      return false;
    }
    setFileList(fileList);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Descripción de la Agenda",
      dataIndex: "descripcion_agenda",
      key: "descripcion_agenda",
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleEditar(record)} icon={<EditOutlined />}>Editar</Button>
          <Button onClick={() => handleEliminar(record)} icon={<DeleteOutlined />}>Eliminar</Button>
          <Button onClick={() => handleDescargar(record)} icon={<DownloadOutlined />}>Descargar</Button>
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
        title="Actualizar archivo PDF"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setEditModalVisible(false)}>Cancelar</Button>,
          <Button key="submit"  onClick={handleEditarSubmit}>Guardar</Button>
        ]}
      >
        {actividadSeleccionada && (
          <div style={{ textAlign: 'left', padding: '5px' }}>
            <div>
              <strong>ID:</strong> {actividadSeleccionada.id}
            </div>
            <div>
              <strong>Descripción de la Agenda:</strong> {actividadSeleccionada.descripcion_agenda}
            </div>
            <div style={{ marginTop: '20px' }}>
              <Upload
                accept="application/pdf"
                listType="text"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                maxCount={1}
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

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
import { uploadBytes, getDownloadURL, ref } from "firebase/storage"; // Importaciones necesarias de Firebase
import { storage } from "../firebase/config"; // Importa tu configuración de Firebase
import { v4 as uuidv4 } from "uuid"; // Importar v4 para generar nombres únicos


export function CambiosEvidencia() {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const curp = localStorage.getItem("userCURP") || ""; // Obtener la CURP del usuario
        const response = await axios.get("https://servidor-zonadoce.vercel.app/ConcultarevidenciasPDF", {
          params: { curp } // Enviar la CURP como parámetro de consulta
        });
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
      await axios.delete(`https://servidor-zonadoce.vercel.app/eliminarEvidencia/${record.id}`);
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


  const uploadFileToFirebase = async (file) => {
    const uniqueFileName = `${uuidv4()}-${file.name}`; // Genera un nombre único para el archivo
    const storageRef = ref(storage, `agenda/${uniqueFileName}`); // Sube a la carpeta agenda
    try {
      const snapshot = await uploadBytes(storageRef, file); // Sube el archivo a Firebase
      const downloadURL = await getDownloadURL(snapshot.ref); // Obtén la URL de descarga
      return downloadURL;
    } catch (error) {
      console.error('Error al subir el archivo a Firebase:', error);
      message.error('Error al subir el archivo a Firebase.');
      return null;
    }
  };

  

const handleEditarSubmit = async () => {
  if (fileList.length === 0) {
    message.error('Por favor, selecciona un archivo PDF para subir.');
    return;
  }

  const file = fileList[0].originFileObj; // Obtén el archivo seleccionado
  const pdfUrl = await uploadFileToFirebase(file); // Sube el archivo a Firebase y obtén la URL

  if (!pdfUrl) return; // Si no se pudo subir el archivo, detén el proceso

  try {
    const response = await axios.put(`https://servidor-zonadoce.vercel.app/editarEvidencia/${actividadSeleccionada.id}`, {
      pdfUrl // Envía la nueva URL del PDF al servidor para que se actualice en la base de datos
    });

    if (response.status === 200) {
      message.success('Archivo PDF actualizado correctamente');
      setEditModalVisible(false);
      handleCloseModal();
      // Aquí puedes actualizar la lista de actividades o hacer una nueva consulta
    } else {
      message.error('Error al actualizar la evidencia.');
    }
  } catch (error) {
    console.error('Error al actualizar la evidencia:', error);
    message.error('Error al actualizar la evidencia.');
  }
};
  const handleVerPdf = async (record) => {
    try {
      const response = await axios.get(`https://servidor-zonadoce.vercel.app/descargarEvidencia/${record.id}`);
      
      if (response.data && response.data.url) {
        const url = response.data.url;  // Obtener la URL de Firebase
        window.open(url, '_blank'); // Abrir la URL en una nueva pestaña
      } else {
        message.error('URL del archivo no encontrada');
      }
    } catch (error) {
      console.error("Error al obtener la URL del archivo:", error);
      message.error('Error al obtener la URL del archivo');
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
          <Button onClick={() => handleVerPdf(record)} icon={<DownloadOutlined />}>Ver PDF</Button>
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

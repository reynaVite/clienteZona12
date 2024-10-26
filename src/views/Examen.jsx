import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Presentacion } from "../components/Presntacion";
import { Button, Select, message, Affix, Form, Card, Input } from "antd";
import { PlusOutlined, EnterOutlined } from "@ant-design/icons";
import icono from "../img/hombre.png";
import { Titulo } from "../components/Titulos";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/config"; // Importa correctamente tu configuración de Firebase
import { v4 as uuidv4 } from 'uuid'; // Importar v4 para generar nombres únicos

const { Option } = Select;

export function Examen() {
  const [fileList1, setFileList1] = useState([]); // Para el primer PDF
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState(null); // Almacenar el archivo seleccionado temporalmente

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch("https://servidor-zonadoce.vercel.app/getMaterias");
        const data = await response.json();
        setMaterias(data);
      } catch (error) {
        console.error('Error al obtener las materias:', error);
        message.error('Error al obtener las materias.');
      }
    };

    fetchMaterias();
  }, []);

  // Función para subir archivo a Firebase Storage
  const uploadFile = async (file) => {
    if (!file) return;

    const uniqueFileName = `${uuidv4()}-${file.name}`; // Generar un nombre único para el archivo
    const storageRef = ref(storage, `examen/${uniqueFileName}`); // Subir con el nombre único
    try {
      // Subir archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Devolver la URL del PDF

    } catch (error) {
      console.error('Error al subir el archivo:', error);
      message.error('Error al subir el archivo.');
    }
  };

  const handleSubmitExamen = async () => {
    if (!file) {
      message.error('Por favor, selecciona un archivo PDF.');
      return;
    }
    if (!opcionSeleccionada) {
      message.error('Por favor, selecciona una opción.');
      return;
    }
    if (!descripcion) {
      message.error('Por favor, proporciona una descripción.');
      return;
    }

    try {
      const pdfUrl = await uploadFile(file); // Subir el archivo antes de enviar el formulario
      if (pdfUrl) {
        const curp = localStorage.getItem("userCURP"); // Obtener la CURP del localStorage

        // Crear un objeto con los datos del examen
        const examenData = {
          opcion: opcionSeleccionada,
          descripcion,
          curp,
          pdfUrl // Incluir la URL del PDF
        };

        // Enviar los datos al backend
        const response = await fetch("https://servidor-zonadoce.vercel.app/submitExamen", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(examenData)
        });

        if (response.ok) {
          message.success('Examen enviado exitosamente.');
        } else {
          message.error('Error al enviar el examen.');
        }
      }
    } catch (error) {
      console.error('Error al enviar el examen:', error);
      message.error('Error al enviar el examen.');
    }
  };

  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Examen"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50"
          />
        }
      />

      <div className="lg:w-10/12 lg:m-auto p-6">
        <Titulo tit={"Elaboración de nuevo examen"} />

        <Card
          bordered={false}
          style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Form layout="vertical">
            <Form.Item
              label="Selecciona una materia"
              required
              style={{ marginBottom: '24px' }}
            >
              <Select
                value={opcionSeleccionada}
                onChange={setOpcionSeleccionada}
                placeholder="Selecciona una opción"
                style={{ width: '100%' }}
              >
                {materias.map(materia => (
                  <Option key={materia.value} value={materia.value}>
                    {materia.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Descripción del examen"
              required
              style={{ marginBottom: '24px' }}
            >
              <Input.TextArea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                placeholder="Introduce una descripción del examen"
              />
            </Form.Item>

            <Form.Item
              label="Selecciona el primer archivo PDF"
              required
              style={{ marginBottom: '24px' }}
            >
              <div>
                <Button icon={<PlusOutlined />} style={{ width: '100%' }}>
                  Seleccionar PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files[0])} // Guardar archivo seleccionado
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <Button onClick={handleSubmitExamen} icon={<EnterOutlined />} style={{ width: '100%' }}>
                Enviar Examen
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}

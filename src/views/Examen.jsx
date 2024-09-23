import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Presentacion } from "../components/Presntacion";
import { Button, Upload, Select, message, Affix, Form, Card, Input } from "antd";
import { PlusOutlined, EnterOutlined } from "@ant-design/icons";
import icono from "../img/hombre.png";
import { Titulo } from "../components/Titulos";
const { Option } = Select;

export function Examen() {
  const [fileList, setFileList] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch("http://localhost:3000/getMaterias");
        const data = await response.json();
        setMaterias(data);
      } catch (error) {
        console.error('Error al obtener las materias:', error);
        message.error('Error al obtener las materias.');
      }
    };

    fetchMaterias();
  }, []);

  const handleFileChange = ({ file, fileList }) => {
    if (fileList.length > 1) {
      message.error('Solo se permite subir un archivo PDF.');
      return false;
    }
    setFileList(fileList);
  };

  const handleSubmitExamen = async () => {
    if (fileList.length === 0) {
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

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);
    formData.append('opcion', opcionSeleccionada);
    formData.append('descripcion', descripcion); // Añadir la descripción al FormData

    try {
      const response = await fetch("http://localhost:3000/submitExamen", {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        message.success('Examen enviado exitosamente.');
        setFileList([]);
        setOpcionSeleccionada(null);
        setDescripcion(""); // Limpiar la descripción
      } else {
        message.error('Error al enviar el examen.');
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
              label="Selecciona un archivo PDF"
              required
              style={{ marginBottom: '24px' }}
            >
              <Upload
                accept="application/pdf"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Evitar la carga automática de archivos
                maxCount={1} // Limitar a 1 archivo
                showUploadList={{ showPreviewIcon: false }} // Ocultar íconos de vista previa
              >
                <Button icon={<PlusOutlined />} style={{ width: '100%' }}>
                  Seleccionar PDF
                </Button>
              </Upload>
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

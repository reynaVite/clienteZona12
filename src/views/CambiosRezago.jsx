import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, message, Spin } from "antd";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function ModificarEliminarRegistros() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        const response = await axios.get("https://servidor-zonadoce.vercel.app/rezagoAlumno");
        setRegistros(response.data);
      } catch (error) {
        console.error("Error al obtener registros:", error);
        message.error("Error al obtener registros.");
      } finally {
        setLoading(false);
      }
    };

    obtenerRegistros();
  }, []);

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setIsEditing(true);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(
        `https://servidor-zonadoce.vercel.app/rezagoAlumno/${values.idAlumnos}`,
        values
      );
      message.success("Registro actualizado correctamente.");
      setIsEditing(false);
      setRegistros((prevRegistros) =>
        prevRegistros.map((reg) =>
          reg.idAlumnos === values.idAlumnos ? values : reg
        )
      );
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      message.error("Error al actualizar el registro.");
    }
  };

 

  const handleDelete = async (idAlumnos) => {
    try {
      await axios.delete(`https://servidor-zonadoce.vercel.app/rezagoAlumno/${idAlumnos}`);
      message.success("Registro eliminado correctamente.");
      setRegistros((prevRegistros) =>
        prevRegistros.filter((reg) => reg.idAlumnos !== idAlumnos)
      );
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      message.error("Error al eliminar el registro.");
    }
  };
// Datos de ejemplo, asegúrate de que tengan las propiedades correctas
const data = [
  { idAlumnos: 1, nombre: 'Juan', aPaterno: 'Pérez', aMaterno: 'Gómez' },
  { idAlumnos: 2, nombre: 'Ana', aPaterno: 'López', aMaterno: 'Martínez' }
];

  const columns = [
   
    {
      title: 'Nombre Completo',
      key: 'nombre_completo',
      render: (text, record) => {
        // Verificar si las propiedades existen
        if (record && record.nombre && record.aPaterno && record.aMaterno) {
          return `${record.nombre} ${record.aPaterno} ${record.aMaterno}`;
        }
        return 'Reyna Vite Vera'; // Mensaje de fallback
      },
    },
    {
      title: "¿Sabe leer?",
      dataIndex: "habilidad_lectura",
      key: "habilidad_lectura",
    },
    {
      title: "¿Sabe escribir?",
      dataIndex: "habilidad_escritura",
      key: "habilidad_escritura",
    },
    {
      title: "¿Posee habilidades matemáticas?",
      dataIndex: "habilidad_matematica",
      key: "habilidad_matematica",
    },
    {
      title: "¿Participa en clase?",
      dataIndex: "participacion",
      key: "participacion",
    },
    {
      title: "Comportamiento",
      dataIndex: "comportamiento",
      key: "comportamiento",
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, record) => (
        <div>
          <Button onClick={() => handleEdit(record)} className="mr-2">
            Editar
          </Button>
          <Button onClick={() => handleDelete(record.idAlumnos)} type="danger">
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="w-10/12 mx-auto my-4">
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={registros}
              rowKey="idAlumnos"
              bordered
              className="bg-white shadow-md rounded-lg"
            />
            <Modal
              title="Editar Registro"
              visible={isEditing}
              onCancel={() => setIsEditing(false)}
              footer={null}
            >
              <Form form={form} onFinish={handleUpdate} layout="vertical">
                <Form.Item name="idAlumnos" label="ID" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="habilidad_lectura" label="¿Sabe leer?">
                  <Input />
                </Form.Item>
                <Form.Item name="habilidad_escritura" label="¿Sabe escribir?">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="habilidad_matematica"
                  label="¿Posee habilidades matemáticas?"
                >
                  <Input />
                </Form.Item>
                <Form.Item name="participacion" label="¿Participa en clase?">
                  <Input />
                </Form.Item>
                <Form.Item name="comportamiento" label="Comportamiento">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button   htmlType="submit" className="mr-2">
                    Guardar
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

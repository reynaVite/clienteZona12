import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { Space, Table, Spin, Button, Select, Card, Affix, message, Modal, Form, Row, Col, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import icono from "../img/salud.png";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { Subtitulo, Titulo } from "../components/Titulos";
import styled from "styled-components";

export function SaludDatos() {
  const [categotriOptions, setcategotriOptions] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [catego, setCatego] = useState("");
  const [categoria, setCategoria] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [valor, setValor] = useState("");
  const [registrosOriginales, setRegistrosOriginales] = useState([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState(null);
  const [valorIdSeleccionado, setValorIdSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [vacunasData, setVacunasData] = useState([]);
  const [alergiasData, setAlergiasData] = useState([]);
  const [discapacidadData, setDiscapaData] = useState([]);
  const [idAlumnos, setIdAlumnos] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false); // Estado de carga del botón
 

  const StyledTable = styled(Table)`
  .selected-row {
    background-color: #e6f7ff; /* Color azul claro */
  }
`;

  const showDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categoria");
      setcategotriOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de las categorias:", error);
    }
  };


  const obtenerRegistros = async () => {
    try {
      const response = await axios.get("http://localhost:3000/saludAlum");
      setRegistros(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      message.error("Error al obtener registros");
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    obtenerRegistros();
  }, []);

  useEffect(() => {
    setRegistrosFiltrados([...registrosOriginales]);
  }, [registrosOriginales]);


  const handleRegistrarClick = (id, idAlumno) => {
    setCurrentId(id);
    setId(id);
    setIdAlumnos(idAlumno);
    setModalVisible(true);
  };


  const handleUpdate = async () => {
    setButtonLoading(true); 
    try {
      if (valor.trim() === "") {
        message.error("Por favor, complete todos los campos.");
        return;
      }

      // Actualizar el registro específico en la base de datos
      await axios.post("http://localhost:3000/actualizarSalud", {
        id: id,
        idAlumnos: idAlumnos,
        valor: valor.trim()
      });

      // Actualizar el registro específico en los registros filtrados
      const updatedFilteredRecords = registrosFiltrados.map(record => {
        if (record.id === id) {
          return { ...record, valor: valor.trim() };
        }
        return record;
      });
      setRegistrosFiltrados(updatedFilteredRecords);

      message.success("Datos de salud actualizados correctamente.");
      setModalVisible(false);
      setCategoria("");
      setValor("");
    } catch (error) {
      console.error("Error al actualizar los datos de salud:", error);
      message.error("Error al actualizar los datos de salud");
    }finally {
      setButtonLoading(false); 
    }
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/saludAlumBorrar`, { data: { id: deleteId } });
      message.success("Registro eliminado correctamente.");
      obtenerRegistros();
      setRegistrosFiltrados();
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      message.error("Error al eliminar el registro");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const handleVerDato = async (idAlumno) => {
    try {
      setSelectedAlumnoId(idAlumno);
      console.log("ID del alumno:", idAlumno);
      await consultarBackend(idAlumno);
      await discapacidad(idAlumno);
      await vacunas(idAlumno); 
      const filteredRecords = registros.filter(record => record.idAlumno === idAlumno);
      setRegistrosFiltrados(filteredRecords);
    } catch (error) {
      console.error("Error al manejar la visualización de datos:", error); 
    }
  };


  const consultarBackend = async (idAlumno) => {
    // Realiza aquí la consulta al backend utilizando Axios u otra biblioteca
    try {
      // Ejemplo de consulta al backend utilizando Axios
      const response = await axios.get(`http://localhost:3000/ConsultarUnicos/${idAlumno}`);
      const responseData = response.data;
      console.log("Respuesta del backend:", response.data);

      // Actualizar el estado con los datos de las vacunas
      setAlergiasData(responseData);
    } catch (error) {
      console.error("Error al consultar el backend:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
    }
  };


  const discapacidad = async (idAlumno) => {
    // Realiza aquí la consulta al backend utilizando Axios u otra biblioteca
    try {
      // Ejemplo de consulta al backend utilizando Axios
      const response = await axios.get(`http://localhost:3000/ConsultarDiscapacifdada/${idAlumno}`);
      // Procesar la respuesta del backend, si es necesario
      const responseData = response.data;
      console.log("Respuesta del backend:", response.data);

      // Actualizar el estado con los datos de las vacunas
      setDiscapaData(responseData);
    } catch (error) {
      console.error("Error al consultar el backend:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const vacunas = async (idAlumno) => {
    try {
      const response = await axios.get(`http://localhost:3000/ConsultarVacunas/${idAlumno}`);
      const responseData = response.data;

      // Actualizar el estado con los datos de las vacunas
      setVacunasData(responseData);
    } catch (error) {
      console.error("Error al consultar el backend:", error);
      alert("Hubo un error al consultar el backend. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1
    },

    {
      title: "Nombre / apellido paterno y materno",
      key: "nombreCompleto",
      render: (_, record) => (
        <span>{record.nombreAlumno} {record.aPaternoAlumno} {record.aMaternoAlumno}</span>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, record) => (
        <Button size="middle" onClick={() => handleVerDato(record.idAlumno)}>Ver datos</Button>
      ),
    },

  ];

  const uniqueRecords = registros.reduce((acc, curr) => {
    if (!acc[curr.idAlumno]) {
      acc[curr.idAlumno] = curr;
    }
    return acc;
  }, {});

  const uniqueRecordsArray = Object.values(uniqueRecords).sort((a, b) => {
    const nameA = `${a.nombreAlumno} ${a.aPaternoAlumno} ${a.aMaternoAlumno}`.toUpperCase();
    const nameB = `${b.nombreAlumno} ${b.aPaternoAlumno} ${b.aMaternoAlumno}`.toUpperCase();
    return nameA.localeCompare(nameB);
  });

  const salud = [
    {
      title: "Categoría",
      dataIndex: "nombreCategoria",
      key: "nombreCategoria",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Acciones de salud",
      key: "action",
      render: (_, record) => (
        <>
          <Button size="middle" onClick={() => handleRegistrarClick(record.id, record.idAlumno)}>Editar</Button>
          <Button size="middle" onClick={() => showDeleteModal(record.id)}>Borrar</Button>
        </>
      ),
    },
  ];


  const vacunasColumns = [
    {
      title: "Vacunas",
      dataIndex: "nombre",
      key: "nombre",
    }
  ];

  const alergiasColumns = [
    {
      title: "Alergias",
      dataIndex: "alergia",
      key: "alergia",
    }
  ];

  const discapacidadColumns = [
    {
      title: "Discapacidades",
      dataIndex: "nombre",
      key: "nombre",
    }
  ];


  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Panel de salud"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2"
          />
        }
      />
      <Titulo tit={"Datos médicos del alumno"} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={10}>
            <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                {loading ? (
                  <Spin size="large" />
                ) : (
                  <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
                    <StyledTable
                      columns={columns}
                      dataSource={uniqueRecordsArray}
                      bordered
                      rowClassName={(record) => (record.idAlumno === selectedAlumnoId ? 'selected-row' : '')}
                      sticky={{ position: "sticky", top: 0 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={10}>
            <div style={{ textAlign: "center", maxWidth: "600px" }}>
              {loading ? (
                <Spin size="large" />
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Table
                    columns={salud}
                    dataSource={registrosFiltrados}
                    bordered
                    sticky={{ position: "sticky", top: 0 }}
                  />
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                      <Table
                        columns={vacunasColumns}
                        dataSource={vacunasData}
                        bordered
                        sticky={{ position: "sticky", top: 0 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Table
                        columns={alergiasColumns}
                        dataSource={alergiasData}
                        bordered
                        sticky={{ position: "sticky", top: 0 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Table
                        columns={discapacidadColumns}
                        dataSource={discapacidadData}
                        bordered
                        sticky={{ position: "sticky", top: 0 }}
                      />
                    </div>
                  </div>
                </Space>
              )}
            </div>
          </Col>
        </Row>
      </div>


      <Modal
        title={`Editar datos de salud del alumno`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancelar
          </Button>,
          <Button key="submit" onClick={() => handleUpdate(selectedAlumnoId) } loading={buttonLoading}>Actualizar</Button>
        ]}
      >
        <Form layout="vertical">
          <label>Valor:</label>
          <Form.Item
            name="valor"
            rules={[
              {
                required: true,
                message: "Ingrese el valor de la categoría",
              }
            ]}
          >
            <Input
              id="valor"
              placeholder="Ejemplo: 150 cm"
              prefix={<UserOutlined />}
              onChange={(e) => {
                const inputValue = e.target.value;
                const valorId = registrosFiltrados.find(record => record.id === currentId)?.valor_id; 
                if (valorId === 1) {
                  if (/^[A-Za-z\u00C0-\u017F\s]*$/.test(inputValue)) {
                    setValor(inputValue);
                  } else {
                    message.error("Ingresa solo letras en este campo.");
                  }
                } else if (valorId === 2) {
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    setValor(inputValue);
                  } else {
                    message.error("Ingresa solo números, incluyendo el punto decimal si es necesario.");
                  }
                } else {
                  setValor(inputValue);
                }
              }}
              value={valor}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirmar eliminación"
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Cancelar
          </Button>,
          <Button key="delete" type="danger" onClick={handleDelete}>
            Eliminar
          </Button>,
        ]}
      >
        <p>¿Está seguro de que desea eliminar este registro?</p>
      </Modal>
      <Footer />
    </>
  );
}
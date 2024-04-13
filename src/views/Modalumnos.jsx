import "../css/Login.css";
import "../css/botones.css";
import { DownOutlined, UserOutlined, DeleteOutlined, EditOutlined, UpOutlined } from '@ant-design/icons';
import { Form, Select, message, Spin, Button, Input, Modal, Row, Col, Card, Pagination } from 'antd';

import { IdcardOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Subtitulo, Notificacion, Contenido } from "../components/Titulos";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";
import { Login } from "./Login";

const { Option } = Select;
const { confirm } = Modal;

export function ModA() {
  const [grupoOptions, setGrupoOptions] = useState([]);
  const [gradoOptions, setGradoOptions] = useState([]);

  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plantel, setPlantel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [valorPreguntaSecreta, setValorPreguntaSecreta] = useState("");
  const [borrarModalVisible, setBorrarModalVisible] = useState(false);

  const [expandedRecords, setExpandedRecords] = useState({});
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const registrosPorPagina = 9; // Número de registros por página

  useEffect(() => {
    obtenerRegistros();
    obtenerGrupo();
    obtenerGrado();
  }, []);


  const GrupoTextos = {
    1: 'A',
    2: 'B',
  };

  const obtenerRegistros = async () => {
    try {
      const response = await axios.get("http://localhost:3000/alumnos", {

      });

      console.log("Respuesta del servidor:", response);
      setRegistros(response.data); // Establecer directamente los datos de los alumnos
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      message.error("Error al obtener registros");
    }
  };

  const obtenerGrado = async () => {
    try {
      const response = await axios.get("http://localhost:3000/grado");
      setGradoOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de grados:", error);
    }
  };

  const obtenerGrupo = async () => {
    try {
      const response = await axios.get("http://localhost:3000/grupo");
      setGrupoOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de grupos:", error);
    }
  };

  const handleVerDetalles = (record) => {
    setSelectedUser(record);
    setModalVisible(true);
  };

  const handleActualizar = (record) => {
    setSelectedUser(record);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const mostrarModalBorrar = (record) => {
    setSelectedUser(record);
    setBorrarModalVisible(true);
  };

  const handleCancelarBorrar = () => {
    setBorrarModalVisible(false);
  };

  const actualizarFormSubmit = async (values) => {
    // Mostrar mensaje de carga
    message.loading({ content: 'Actualizando...', key: 'Actualizando' });
  
    try {
      const response = await axios.post("http://localhost:3000/actualizarAlumno", {
  
        idAlumnos: selectedUser.idAlumnos,

      nombre: values.nombre,
        aPaterno: values.aPaterno,
        aMaterno: values.aMaterno
      });
  
      console.log("Respuesta del servidor:", response);
  
      if (response.data.success) {
        message.success("Datos actualizados correctamente");
        obtenerRegistros();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      message.error("Error al actualizar datos");
    } finally {
      // Ocultar mensaje de carga
      message.destroy('Actualizando');
      setModalVisible(false);
    }
  };
  

  const borrarFormSubmit = async () => {
    message.loading({ content: 'Borrando...', key: 'Borrando' });
    try {
      const response = await axios.post("http://localhost:3000/borrarAlumnos", {
        docenteId: selectedUser.idAlumnos, // Cambia selectedUser.id por selectedUser.idAlumnos
      });

      console.log("Respuesta del servidor:", response);

      if (response.data.success) {
        message.success("Alumno borrado correctamente");
        obtenerRegistros();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al borrar alumno:", error);
      message.error("Error al borrar alumno");
    } finally {
      // Ocultar mensaje de carga
      message.destroy('Borrando');
      setBorrarModalVisible(false);
    }
  };


  const toggleRecordExpansion = (recordId) => {
    setExpandedRecords(prevState => ({
      ...prevState,
      [recordId]: !prevState[recordId]
    }));
  };

  const handlePaginationChange = (pageNumber) => {
    setPaginaActual(pageNumber);
  };

  // Calcular índices para mostrar los registros de acuerdo a la página actual
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = paginaActual * registrosPorPagina;
  const registrosPaginados = registros.slice(indiceInicial, indiceFinal);

  return (
    <>
      <CSPMetaTag />
      <Header />
      <div className="boxAdmin">
        <ScrollToTop />
        <Subtitulo subTit={"Alumnos"} />
        {loading ? (
          <Spin size="large" />
        ) : (
          <Row gutter={[20, 20]}>
            {registrosPaginados.map((registro, index) => (
              <Col key={registro.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card
                  title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}
                  extra={
                    <Button type="text" onClick={() => toggleRecordExpansion(registro.id)}>
                      {expandedRecords[registro.id] ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  }



                  style={{ marginBottom: 16 }}
                >
                  <p><strong>Docente:</strong> {registro.docente_curp}</p>
 
                  {expandedRecords[registro.id] && (
                    <>
                      <strong>Grado:</strong> {registro.grado_id} &nbsp;
                      <strong>Grupo:</strong> {GrupoTextos[registro.grupo_id]}
                    </>
                  )}
                  <div className="acciones ant-space">
                    <Button onClick={() => handleActualizar(registro)} icon={<EditOutlined />}>Actualizar</Button>
                    <Button onClick={() => mostrarModalBorrar(registro)} icon={<DeleteOutlined />}>Borrar</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        {/* Paginación */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Pagination
            total={registros.length}
            pageSize={registrosPorPagina}
            current={paginaActual}
            onChange={handlePaginationChange}
          />
        </div>
        <br></br>
      </div>
      <Footer />

      {/* Ventana emergente de actualizar asignación */}
      <Modal
  title="Actualizar nombre alumno"
  visible={modalVisible}
  onCancel={handleCancel}
  footer={null}
>
  <Form onFinish={actualizarFormSubmit}>
    <p>Alumn@: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>

    <p>Nombre(s):</p>
    <Form.Item
      name="nombre"
      rules={[
        {
          required: true,
          message: <span>Ingrese el nombre(s)</span>
        },
        // Resto de las reglas de validación para el nombre...
        {
          validator: (_, value) => {
            const trimmedValue = value && value.trim();
            if (/^[A-Z]/.test(trimmedValue)) {
              if (value !== trimmedValue) {
                return Promise.reject("No se permiten espacios.");
              }
              return Promise.resolve();
            }
            return Promise.reject(
              "La primera letra debe ser mayúscula."
            );
          },
        },
        {
          pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{3,25}$/,
          message: "Solo letras, longitud entre 3 y 25.",
        },
      ]}
    >
      <Input
        prefix={<UserOutlined />}
        placeholder="Ejemplo: Reyna"
      />
    </Form.Item>

    <p>Apellido Paterno:</p>
    <Form.Item
      name="aPaterno"
      rules={[
        {
          required: true,
          message: <span>Ingrese su apellido paterno</span>
        },
        {
          validator: (_, value) => {
            const trimmedValue = value && value.trim();
            if (/^[A-Z]/.test(trimmedValue)) {
              if (value !== trimmedValue) {
                return Promise.reject(
                  "No se permiten espacios inicio/final."
                );
              }
              return Promise.resolve();
            }
            return Promise.reject(
              "La primera letra debe ser mayúscula."
            );
          },
        },
        {
          pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{3,15}$/,
          message: "Solo letras, longitud entre 3 y 15.",
        },
        // Resto de las reglas de validación para el apellido paterno...
      ]}
    >
      <Input
        prefix={<UserOutlined />}
        placeholder="Ejemplo: Vite"
      />
    </Form.Item>

    <p>Apellido Materno:</p>
    <Form.Item
      name="aMaterno"
      rules={[
        {
          required: true,
          message: <span>Ingrese su apellido materno</span>
        },
        {
          validator: (_, value) => {
            const trimmedValue = value && value.trim();
            if (/^[A-Z]/.test(trimmedValue)) {
              if (value !== trimmedValue) {
                return Promise.reject(
                  "No se permiten espacios al inicio/final."
                );
              }
              return Promise.resolve();
            }
            return Promise.reject(
              "La primera letra debe ser mayúscula."
            );
          },
        },
        {
          pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{3,15}$/,
          message: "Solo letras, longitud entre 3 y 15.",
        },
        // Resto de las reglas de validación para el apellido materno...
      ]}
    >
      <Input
        prefix={<UserOutlined />}
        placeholder="Ejemplo: Vera"
      />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ color: 'black' }}>
        Actualizar
      </Button>
    </Form.Item>
  </Form>
</Modal>


      {/* Ventana emergente de borrar asignación */}
      <Modal
        title="Borrar alumno"
        visible={borrarModalVisible}
        onCancel={handleCancelarBorrar}
        footer={null}
      >
        <p>Alumn@: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>
        <Form onFinish={borrarFormSubmit}>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ color: 'black' }}>
              Borrar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
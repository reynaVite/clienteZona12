import React, { useState, useEffect } from "react";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { Space, Table, Spin, Button, Select, Affix, message, Modal, Form, Input } from "antd";
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

  const [idAlumnos, setIdAlumnos] = useState("");

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

  const obtenerValorCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/valorCategoria");
      setcategoValtriOptions(response.data);
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
    setId(id);
    setIdAlumnos(idAlumno); // Aquí estableces el valor de idAlumnos
    setModalVisible(true);
  };


  const handleGuardarDato = async () => {
    try {
      if (valor.trim() === "") {
        message.error("Por favor, complete todos los campos.");
        return;
      }


      // Si no existe un registro previo, proceder con la actualización
      await axios.post("http://localhost:3000/actualizarSalud", {
        id: id,
        idAlumnos: idAlumnos, // Agregamos el idAlumnos en la solicitud
        categoria: categoria.trim(),
        valor: valor.trim()
      });

      message.success("Datos de salud actualizados correctamente.");
      setModalVisible(false);
      setCategoria("");
      setValor("");
      obtenerRegistros(); // Vuelve a obtener todos los registros
      handleVerDato(selectedAlumnoId); // Actualiza los registros filtrados

      // Actualiza los registros filtrados después de guardar el dato actualizado
      const updatedRecords = registrosFiltrados.map(record => {
        if (record.id === id) {
          return {
            ...record,
            nombreCategoria: categoria.trim(),
            valor: valor.trim()
          };
        } else {
          return record;
        }
      });

      setRegistrosFiltrados(); // Establece los registros filtrados actualizados en el estado
    } catch (error) {
      console.error("Error al actualizar los datos de salud:", error);
      message.error("Error al actualizar los datos de salud");
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
  
      // Llamada a la función para hacer una consulta al backend
      await consultarBackend(idAlumno);
      await discapacidad(idAlumno);
      await vacunas(idAlumno);
      // Filtrar registros basados en el idAlumno
      const filteredRecords = registros.filter(record => record.idAlumno === idAlumno);
      setRegistrosFiltrados(filteredRecords);
    } catch (error) {
      console.error("Error al manejar la visualización de datos:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
    }
  };
  

  const consultarBackend = async (idAlumno) => {
    // Realiza aquí la consulta al backend utilizando Axios u otra biblioteca
    try {
      // Ejemplo de consulta al backend utilizando Axios
      const response = await axios.get(`http://localhost:3000/ConsultarUnicos/${idAlumno}`);
      // Procesar la respuesta del backend, si es necesario
      console.log("Respuesta del backend:", response.data);
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
      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      console.error("Error al consultar el backend:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
    }
  };


  const vacunas = async (idAlumno) => {
    // Realiza aquí la consulta al backend utilizando Axios u otra biblioteca
    try {
      // Ejemplo de consulta al backend utilizando Axios
      const response = await axios.get(`http://localhost:3000/ConsultarDiscapacifdada/${idAlumno}`);
      // Procesar la respuesta del backend, si es necesario
      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      console.error("Error al consultar el backend:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
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
  const alergia = [
    {      
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },{}
  ]
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

      <div className="w-10/12 mx-auto" style={{ textAlign: "center" }}>
        {loading ? (<Spin size="large" />) : (
          <StyledTable
            columns={columns}
            dataSource={uniqueRecordsArray}
            bordered
            rowClassName={(record) => (record.idAlumno === selectedAlumnoId ? 'selected-row' : '')}
          />
        )}
      </div>


      <br></br>

      <div className="w-10/12 mx-auto" style={{ textAlign: "center" }}>
        {loading ? (
          <Spin size="large" />
        ) : (

          <Table columns={salud} dataSource={registrosFiltrados} bordered />
        )}
      </div>
      <div className="flex flex-row  w-11/12 m-auto mt-10 justify-center items-center">
          <div className="basis-1/2">          
            <Table columns={alergia} dataSource={registrosFiltrados} bordered />
          </div>
          <div className="basis-1/2">si</div>
      </div>


      <Modal
        title={`Editar datos de salud del alumno`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancelar
          </Button>,


          <Button key="submit" onClick={() => handleGuardarDato(selectedAlumnoId)}>Actualizar</Button>

        ]}
      >

        <Form layout="vertical">
          <label>Categoría:</label>
          <Form.Item
            name="categoria"
            rules={[
              {
                required: true,
                message: "Seleccione una categoría",
              },
            ]}
          >
            <Select
              placeholder="Ejemplo: Peso.... "
              suffixIcon={<IdcardOutlined />}
              onChange={(value, option) => {
                setCategoria(value.toString());
                setValorIdSeleccionado(option.valor_id.toString()); // Aquí estableces valorIdSeleccionado
                setValor("");
                setError(""); // Limpiar el mensaje de error al cambiar la categoría
              }}
              value={categoria}
            >
              {categotriOptions.map((option) => (
                <Option key={option.value} value={option.value.toString()} valor_id={option.valor_id}>
                  {option.label}
                </Option>
              ))}

            </Select>
          </Form.Item>

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
                if (valorIdSeleccionado === '1') {
                  if (/^[A-Za-z\u00C0-\u017F\s]*$/.test(inputValue)) {
                    setValor(inputValue);
                  } else {
                    message.error("Ingresa solo letras en este campo.");
                  }
                } else if (valorIdSeleccionado === '2') {
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
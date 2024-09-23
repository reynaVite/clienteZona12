import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { UserOutlined, PlusOutlined, UnorderedListOutlined , IdcardOutlined } from "@ant-design/icons";
import {  Card, List, Space, Table, Spin, Tag, Button, Select, Affix, message, Modal, Alert, Form, Input, Row, Col } from "antd";
import axios from "axios";
import icono from "../img/salud.png";
import { Subtitulo, Titulo } from "../components/Titulos";

export function Salud() {
  const [categotriOptions, setcategotriOptions] = useState([]);
  const [categoValtriOptions, setcategoValtriOptions] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [idAlumnos, setIdAlumnos] = useState("");
  const [error, setError] = useState("");
  const [errorval, setErrorval] = useState("");
  const [catego, setCatego] = useState("");
  const [categoval, setCategoval] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [valorIdSeleccionado, setValorIdSeleccionado] = useState('');
  const [showCheckSelect, setShowCheckSelect] = useState(false);
  const [opcionesCheck, setOpcionesCheck] = useState([]);
  const [opcionesSeleccionadasCheck, setOpcionesSeleccionadasCheck] = useState([]);
  const [showCheckSelectAlergias, setShowCheckSelectAlergias] = useState(false);
  const [showCheckSelectVacunas, setShowCheckSelectVacunas] = useState(false);
  const [opcionesSeleccionadasAlergias, setOpcionesSeleccionadasAlergias] = useState([]);
  const [opcionesSeleccionadasVacunas, setOpcionesSeleccionadasVacunas] = useState([]);
  const [alergiasOptions, setAlergiasOptions] = useState([]);
  const [vacunasOptions, setVacunasOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categovalModal, setCategovalModal] = useState("");
  const [categorias, setCategorias] = useState([]); 
  const [showCategories, setShowCategories] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleToggleCategories = () => {
    setShowCategories(!showCategories);
  };
  const handleInputChange = (e, categoria) => {
    const { value } = e.target;
    if (categoria.valor_id == "1" && !/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]*$/.test(value)) {
      setErrorMessage(`El campo ${categoria.label} solo acepta letras y espacios.`);
    } else if (categoria.valor_id == "2" && !/^[0-9.]*$/.test(value)) {
      setErrorMessage(`El campo ${categoria.label} solo acepta números y el punto decimal.`);
    } else {
      setErrorMessage('');
      setInputValues(prevState => ({
        ...prevState,
        [categoria.value]: value
      }));
    }
  };
  
  
  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categoria");
      setCategorias(response.data); // Establece las categorías en el estado
      setcategotriOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de las categorias:", error);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerValorCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3000/valorCategoria");
      setcategoValtriOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de las categorias:", error);
    }
  };

  useEffect(() => {
    const obtenerAlergias = async () => {
      try {
        const response = await axios.get("http://localhost:3000/alergias");
        setAlergiasOptions(response.data);
      } catch (error) {
        console.error("Error al obtener datos de alergias:", error);
      }
    };

    obtenerAlergias();
  }, []);

  useEffect(() => {
    const obtenerVacunas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vacunas");
        setVacunasOptions(response.data);
      } catch (error) {
        console.error("Error al obtener datos de vacunas:", error);
      }
    };

    obtenerVacunas();
  }, []);

  //YAAA
  const handleGuardar = async () => {
    if (catego.trim() === "") {
      setError("Categoria no puede estar vacío.");
    }
    if (categoval.trim() === "") {
      setErrorval("Valor no puede estar vacío.");
    }

    if (catego.trim() === "" || categovalModal.trim() === "") {
      return;
    }
    try {
      await axios.post("http://localhost:3000/Insercategorias", {
        categoria: catego.trim(),
        valor: categovalModal.trim()
      });
      message.success("Categoría guardada correctamente.");
      obtenerCategorias();
      setCategovalModal("");
      setIsModalVisible(false);
      setModalVisible(false);
      setError("");
      setErrorval("");
      setCatego("");
      setCategoval("");
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      message.error("Error al guardar la categoría");
    }
  };

  const handleGuardarDato = async () => {
    try {
      const datosSalud = [];
      const datosExistentes = []; // Almacenar los datos existentes
      let datosNuevosGuardados = false; // Bandera para indicar si se guardaron datos nuevos
  
      categorias.forEach(categoria => {
        if (inputValues[categoria.value]) {
          datosSalud.push({
            idAlumnos: idAlumnos,
            categoria: categoria.value,
            valor: inputValues[categoria.value]
          });
        }
      });
  
      // Validar si los datos ya existen en la base de datos antes de insertar
      await Promise.all(datosSalud.map(async dato => {
        const response = await axios.post("http://localhost:3000/verificarSalAlumn", dato);
        // Verificar si ya existen datos con el mismo idAlumnos y categoria
        if (!response.data.exists) {
          await axios.post("http://localhost:3000/guardarDatosSalud", dato);
          datosNuevosGuardados = true; // Se ha guardado al menos un dato nuevo
        } else {
          datosExistentes.push({
            ...dato,
            categoria: categorias.find(cat => cat.value === dato.categoria).label
          });
        }
      }));
  
      datosExistentes.forEach(dato => {
        message.warning(`¡La categoría "${dato.categoria}" ya está registrada!`);
      });
  
      if (datosNuevosGuardados) {
        message.success("Datos de salud guardados correctamente.");
      }
  
      setModalVisible(false);
      setInputValues({});
    } catch (error) {
      console.error("Error al guardar los datos de salud:", error);
      message.error("Error al guardar los datos de salud");
    }
  };
  
  
   
  //VALORES MULTIVALOR  YAAA
  const handleGuardarDiscapacidades = async () => {
    try {
        // Enviar los datos al backend
        console.log("ID del alumno:", idAlumnos);
        console.log("Opciones seleccionadas de discapacidades:", opcionesSeleccionadasCheck);

        // Verificar si los datos ya existen en la base de datos
        const response = await axios.post("http://localhost:3000/verificarDiscapacidades", {
            idAlumnos: idAlumnos,
            opcionesDiscapacitados: opcionesSeleccionadasCheck
        });

        if (response.data.exists) {
            // Obtener los valores de opcionesDiscapacitados que ya están registrados
            const opcionesRegistradas = response.data.opcionesRegistradas.join(', ');
            // Mostrar mensaje de advertencia con los valores registrados
            message.warning(`La(s) siguiente(s) discapacidad(es) ya están registrada(s): ${opcionesRegistradas}`);
        } else {
            // Los datos no existen en la base de datos, insertar nuevos datos
            await axios.post("http://localhost:3000/guardarDiscapacidades", {
                idAlumnos: idAlumnos,
                opcionesDiscapacitados: opcionesSeleccionadasCheck
            });
            message.success('Las discapacidades se registraron correctamente');
            // Cerrar modal después de la inserción
            setModalVisible(false);
        }

    } catch (error) {
        console.error("Error al guardar los datos de discapacidades:", error);
        message.error("Error al guardar los datos de discapacidades");
    }
};

  
  

  //VALORES MULTIVALOR YAYAYAYAY
  const handleGuardarAlergias = async () => {
    try {
        console.log("ID del alumno:", idAlumnos);
        console.log("Opciones seleccionadas de alergias:", opcionesSeleccionadasAlergias);

        const response = await axios.post("http://localhost:3000/verificarAlergias", {
            idAlumnos: idAlumnos,
            opcionesAlergias: opcionesSeleccionadasAlergias
        });

        if (response.data.exists) {
            const alergiasRegistradas = response.data.alergiasRegistradas.join(', ');
            message.warning(`La(s) siguiente(s) alergia(s) ya están registrada(s): ${alergiasRegistradas}`);
        } else {
            await axios.post("http://localhost:3000/guardarAlergias", {
                idAlumnos: idAlumnos,
                opcionesAlergias: opcionesSeleccionadasAlergias
            });
            message.success('Las alergias se registraron correctamente');
            setModalVisible(false);
        }
    } catch (error) {
        console.error("Error al guardar los datos de alergias:", error);
        message.error("Error al guardar los datos de alergias");
    }
};


  //VALORES MULTIVALOR  
  const handleGuardarVacunas = async () => {
    try {
        // Enviar los datos al backend
        console.log("ID del alumno:", idAlumnos);
        console.log("Opciones seleccionadas de vacunas:", opcionesSeleccionadasVacunas);

        // Verificar si los datos ya existen en la base de datos
        const response = await axios.post("http://localhost:3000/verificarVacunas", {
            idAlumnos: idAlumnos,
            opcionesVacunas: opcionesSeleccionadasVacunas
        });

        if (response.data.exists) {
            // Obtener los valores de opcionesVacunas que ya están registrados
            const vacunasRegistradas = response.data.opcionesRegistradas.join(', ');
            // Mostrar mensaje de advertencia con los valores registrados
            message.warning(`La(s) siguiente(s) vacuna(s) ya están registrada(s): ${vacunasRegistradas}`);
        } else {
            // Los datos no existen en la base de datos, insertar nuevos datos
            await axios.post("http://localhost:3000/guardarVacunas", {
                idAlumnos: idAlumnos,
                opcionesVacunas: opcionesSeleccionadasVacunas
            });
            message.success('Las vacunas se registraron correctamente');
            // Cerrar modal después de la inserción
            setModalVisible(false);
        }

    } catch (error) {
        console.error("Error al guardar los datos de vacunas:", error);
        message.error("Error al guardar los datos de vacunas");
    }
};


  useEffect(() => {
    obtenerCategorias();
    obtenerValorCategorias();
  }, []);

  const handleRegistrarClick = (idAlumnos, nombre) => {
    console.log("ID del alumno:", idAlumnos);
    console.log("Nombre:", nombre);
    setIdAlumnos(idAlumnos);
    setNombreAlumno(nombre); 
    setSecondModalVisible(true);
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleSelectChange = (value) => {
    // Lógica para mostrar el select en forma de check si se selecciona el valor 99
    if (value === "99") {
      setShowCheckSelect(true);
      setShowCheckSelectAlergias(false);
      setShowCheckSelectVacunas(false);
      // Ocultar el selector de alergias cuando se selecciona la opción 99
      obtenerOpcionesCheck(); // Función para obtener los datos del select tipo check desde el backend
    } else if (value === "97") {
      setShowCheckSelect(false); // Ocultar el selector de check
      setShowCheckSelectAlergias(false); // Mostrar el selector de alergias
      setShowCheckSelectVacunas(true);

    } else if (value === "88") {
      setShowCheckSelect(false); // Ocultar el selector de check
      setShowCheckSelectAlergias(true); // Mostrar el selector de alergias
      setShowCheckSelectVacunas(false);
    }
    else {
      setShowCheckSelect(false); // Ocultar el selector de check
      setShowCheckSelectAlergias(false); // Ocultar el selector de alergias
      setShowCheckSelectVacunas(false);
    }
  };

  const obtenerOpcionesCheck = async () => {
    try {
      const response = await axios.get("http://localhost:3000/discapacidad");
      setOpcionesCheck(response.data);
    } catch (error) {
      console.error("Error al obtener datos de discapacidades:", error);
      message.error("Error al obtener datos de discapacidades");
    }
  };
  useEffect(() => {
    obtenerOpcionesCheck();
  }, []);

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleGuardarDatos = async () => {
    try {
      await handleGuardarDato();
      await handleGuardarVacunas();
      await handleGuardarDiscapacidades();
      await handleGuardarAlergias();
      setSecondModalVisible(false); 
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      message.error("Se produjo un error al guardar los datos. Inténtalo de nuevo.");
      // Aquí podrías agregar código para deshacer los cambios realizados, si es necesario
    }
  };
  
  
  
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Za-z\u00C0-\u017F\s]*$/.test(inputValue)) {
      setCatego(inputValue);
      setError("");
    } else {
      setError("El valor de la categoría no puede contener números ni caracteres especiales.");
    }
  };

  // Agrega esta función para ordenar los registros por el nombre completo del alumno
  const ordenarRegistrosPorNombre = (registros) => {
    return registros.sort((a, b) => {
      const nombreCompletoA = `${a.nombre_completo} ${a.apellido_paterno} ${a.apellido_materno}`.toUpperCase();
      const nombreCompletoB = `${b.nombre_completo} ${b.apellido_paterno} ${b.apellido_materno}`.toUpperCase();
      return nombreCompletoA.localeCompare(nombreCompletoB);
    });
  };

  // En el useEffect que obtiene los registros, utiliza la función de ordenamiento
  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        const response = await axios.get("http://localhost:3000/alumnos");
        console.log("Respuesta del servidor:", response);
        const registrosOrdenados = ordenarRegistrosPorNombre(response.data); // Ordena los registros
        setRegistros(registrosOrdenados); // Establece los registros ordenados en el estado
      } catch (error) {
        console.error("Error al obtener registros:", error);
      } finally {
        setLoading(false); // Desactivar el indicador de carga independientemente del resultado
      }
    };

    obtenerRegistros();
  }, []);


  // En el mapeo de la tabla, utiliza los registros ordenados
  const columns = [
    {
      title: "No",
      dataIndex: "idAlumnos",
      key: "idAlumnos",
      render: (text, record, index) => index + 1
    },
    {
      title: "Nombre / apellido paterno y materno",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
    },
    {
      title: "Grado",
      dataIndex: "grado_id",
      key: "grado_id",
    },
    {
      title: "Grupo",
      dataIndex: "nombre_grupo",
      key: "nombre_grupo",
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
    },
    {
      title: "Acciones de salud",
      key: "action",
      render: (_, record) => (
        <Button size="middle" onClick={() => handleRegistrarClick(record.idAlumnos, record.nombre)}>
          Registrar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Panel de salud"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50"
          />
        }
      />
      <Titulo tit={"Datos médicos del alumno"} /> 
      
      <Row justify="center" style={{ marginTop: 50 }}>
      <Col span={20}>
        <Space>
          <label>Categorías:</label>
          <PlusOutlined style={{ cursor: "pointer" }} onClick={handleToggleModal} />
          <UnorderedListOutlined style={{ cursor: "pointer" }} onClick={handleToggleCategories} />
        </Space>
        {showCategories && (
          <Card style={{ width: 300, marginTop: 10 }}>
            <List
              size="small"
              dataSource={categotriOptions}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Space>
                    <span>{item.label}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        )}
      </Col>
        <Modal
          title="Agregar nueva categoría"
          visible={isModalVisible}
          onCancel={handleToggleModal}
          footer={null}
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: 10, width: "100%" }}>
              <label htmlFor="nuevaCategoria">Nueva categoría:</label><br />
              <Input
                id="nuevaCategoria"
                placeholder="Ingrese la nueva categoría"
                style={{ width: "100%" }}
                value={catego}
                onChange={handleChange}
              />
              <div style={{ marginTop: 5, color: "red" }}>{error && <span>{error}</span>}</div>
              <br />
              <label htmlFor="nuevaCategoria">que será en:</label>
              <Form.Item
                name="categoval"
                rules={[
                  {
                    required: true,
                    message: "Selecciona un valor",
                  },
                ]}
              >
                <Select
                  placeholder="Ejemplo: Números.... "
                  suffixIcon={<IdcardOutlined />}
                  onChange={(value) => setCategovalModal(value)}
                  value={categovalModal}
                  style={{ width: "100%" }}
                >
                  {categoValtriOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <div style={{ marginTop: 5, color: "red" }}>{errorval && <span>{errorval}</span>}</div>
              <Button
                type="primary"
                style={{ color: "black", width: "100%" }}
                onClick={handleGuardar}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Modal>
    
    </Row>
 
     
      <div className="w-10/12 mx-auto" style={{ textAlign: "center" }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table columns={columns} dataSource={registros} bordered />
        )}
      </div>
      <br></br>
    
      <Modal
      title={`Registrar salud de ${nombreAlumno}`}
      visible={secondModalVisible}
      onCancel={() => setSecondModalVisible(false)}
      footer={null} // No necesitas un footer en este caso
    >
    
      <Form layout="vertical"> 
              <label>Vacunas:</label>
              <Form.Item
                name="vacunasSelect"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos una vacuna",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona vacunas"
                  onChange={(values) => {
                    console.log("Vacunas seleccionadas:", values);
                    setOpcionesSeleccionadasVacunas(values); 
                  }}
                  style={{ width: "100%" }}
                >
                  {vacunasOptions.map((option) => (
                    <Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <label>Alergias:</label>
              
              <Form.Item
                name="alergiasSelect"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos una alergia",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona alergias"
                  onChange={(values) => {
                    console.log("Alergias seleccionadas:", values);
                    setOpcionesSeleccionadasAlergias(values);
                    // Aquí puedes actualizar el estado con las alergias seleccionadas si es necesario
                  }}
                  style={{ width: "100%" }}
                >
                  {alergiasOptions.map((option) => (
                    <Option key={option.value} value={option.value.toString()}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <label>Discapacidades:</label>
              <Form.Item
                name="checkSelect"
                rules={[
                  {
                    required: true,
                    message: "Seleccione al menos una opción",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Selecciona opciones"
                  onChange={(values) => {
                    console.log("Valores seleccionados:", values);
                    setOpcionesSeleccionadasCheck(values); // Actualizar el estado con las opciones seleccionadas
                  }}
                  style={{ width: "100%" }}
                >
                  {opcionesCheck.map((opcion) => (
                    <Option key={opcion.value} value={opcion.value.toString()}>
                      {opcion.label}
                    </Option>
                  ))}
                </Select>

              </Form.Item>

              {categorias.map(categoria => {
  const shouldRender = categoria.value != "97" && categoria.value != "88" && categoria.value != "99";
  console.log("value:", categoria.value, " - shouldRender:", shouldRender);
  return shouldRender && (
    <div key={categoria.value}>
      <label>{categoria.label}:</label> 
      <Input
        type="text"
        value={inputValues[categoria.value] || ''}
        onChange={(e) => handleInputChange(e, categoria)}
        placeholder={`Ingrese: ${categoria.label}`} // Placeholder dinámico
        required // Hace que el input sea obligatorio
        onKeyPress={(e) => {
          // Si el valor de valor_id es 1, permitir solo letras
          if (categoria.valor_id === "1" && !/[a-zA-Z]/.test(e.key)) {
            e.preventDefault();
          }
          // Si el valor de valor_id es 2, permitir solo números
          if (categoria.valor_id === "2" && isNaN(Number(e.key)) && e.key !== '.') {
            e.preventDefault();
          }
        }}
      /><br/><br/>
    </div>
  );
})}
{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
  

      </Form> 
      <Button type="primary" onClick={handleGuardarDatos} style={{ marginRight: 10, color: "black",}}>
  Guardar
</Button>

    </Modal>
      
      <Footer />
    </>
  );
}

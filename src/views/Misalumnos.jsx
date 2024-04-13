import React, { useState, useEffect, useRef} from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Contenido, Titulo } from "../components/Titulos";
import { Table } from "antd";
import { Input, Button, Space, Select, message, Checkbox, Form ,Modal,Affix} from "antd";
import { DownOutlined, UserOutlined, DeleteOutlined, EditOutlined, UpOutlined,  } from '@ant-design/icons';
import axios from 'axios'; // Importar Axios
import logo from "../img/2.png";
import hidalgo from "../img/hidalgo.png";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const { Search } = Input;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select; // Agregar Option de Select
const optionsSex = ["F", "M"];

const SearchComponent = () => {  
  const userCURP = localStorage.getItem("userCURP") || "";
  const userPlantel = localStorage.getItem("userPlantel") || "";  

  const [modalVisible, setModalVisible] = useState(false); 
  const [borrarModalVisible, setBorrarModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterGenderOptions, setFilterGenderOptions] = useState([]);
  const tableRef = useRef(null);
  const [buttonLoading, setButtonLoading] = useState(false); // Estado de carga del botón
 

  const getplantelText = (userPlantel) => {
  switch (userPlantel) {
    case "1":
      return "Zona 012";
    case "2":
      return "Benito Juárez";
    case "3":
      return "Héroe Agustín";
    default:
      return "Plantel Desconocido";
  }
};

const downloadPDF = () => {
  const pdf = new jsPDF('p', 'pt', 'letter');
  let yPos = 50; // Ajusta la posición inicial según el tamaño de la imagen

  // Agregar imagen
  const imgLogo = new Image();
  imgLogo.src = logo; // Aquí usamos la importación de la imagen
  imgLogo.onload = () => {
    const canvasLogo = document.createElement('canvas');
    canvasLogo.width = imgLogo.width;
    canvasLogo.height = imgLogo.height;
    const ctxLogo = canvasLogo.getContext('2d');
    ctxLogo.drawImage(imgLogo, 0, 0);
    const imgDataLogo = canvasLogo.toDataURL('image/png');

    // Ajustar la posición de la primera imagen
    pdf.addImage(imgDataLogo, 'PNG', 450, 30, 100, 80); // Ajusta los valores según tus preferencias

    // Agregar imagen de Hidalgo
    const imgHidalgo = new Image();
    imgHidalgo.src = hidalgo; // Aquí usamos la importación de la imagen
    imgHidalgo.onload = () => {
      const canvasHidalgo = document.createElement('canvas');
      canvasHidalgo.width = imgHidalgo.width;
      canvasHidalgo.height = imgHidalgo.height;
      const ctxHidalgo = canvasHidalgo.getContext('2d');
      ctxHidalgo.drawImage(imgHidalgo, 0, 0);
      const imgDataHidalgo = canvasHidalgo.toDataURL('image/png');

      // Ajustar la posición de la segunda imagen
      pdf.addImage(imgDataHidalgo, 'PNG', 350, 30, 80, 80); // Ajusta los valores según tus preferencias

      pdf.setFont('times');
      pdf.setFontSize(12);

      pdf.text(`Docente: ${userCURP}`, 50, yPos);
      yPos += 20;

      // Agregar el valor del plantel dependiendo de userPlantel
      const plantelText = getplantelText(userPlantel);
      pdf.text(`Plantel: ${plantelText}`, 50, yPos); // Utilizando la función getplantelText
      yPos += 20;

      pdf.text(`Grado: ${users[0].grado_id}`, 50, yPos);
      pdf.text(`Grupo: ${users[0].nombre_grupo}`, 100, yPos);
      yPos += 30;

      pdf.text("Lista de alumnos:", 50, yPos);
      yPos += 20;

      users.forEach((user, index) => {
        // Imprimir nombre y sexo de cada usuario
        const text = `${index + 1}. ${user.nombre_completo} - ${user.sexo}`;
        pdf.text(text, 50, yPos);
        yPos += 20;
      });

      pdf.save('lista_alumnos.pdf');
    };
  };
};

  
  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const results = users.filter((user) => {
    const nameMatches = !search || user.nombre.toLowerCase().includes(search.toLowerCase());
    const genderMatches = filterGenderOptions.length === 0 || filterGenderOptions.includes(user.sexo);
    return nameMatches && genderMatches;
  });

 
  
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
    setButtonLoading(true); // Activar el estado de carga del botón
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
        showData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      message.error("Error al actualizar datos");
    } finally {
      // Ocultar mensaje de carga 
      setButtonLoading(false); // Desactivar el estado de carga del botón al finalizar el proceso
      setModalVisible(false);
    } 
  };
  

  const borrarFormSubmit = async () => { 
    setButtonLoading(true); // Activar el estado de carga del botón
    try {
      const response = await axios.post("http://localhost:3000/borrarAlumnos", {
        docenteId: selectedUser.idAlumnos, // Cambia selectedUser.id por selectedUser.idAlumnos
      });

      console.log("Respuesta del servidor:", response);

      if (response.data.success) {
        message.success("Alumno borrado correctamente");
        showData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al borrar alumno:", error);
      message.error("Error al borrar alumno");
    } finally {  
      setBorrarModalVisible(false);
      setButtonLoading(false); // Desactivar el estado de carga del botón al finalizar el proceso
    }
  };

  const URL = "http://localhost:3000/alumnos";

  const showData = async () => {
    try {
      const response = await axios.get(URL); // Hacer la solicitud GET al servidor
      
      // Ordenar los datos por nombre completo
      const sortedData = response.data.sort((a, b) => {
        const nombreCompletoA = `${a.nombre} ${a.aPaterno} ${a.aMaterno}`.toLowerCase();
        const nombreCompletoB = `${b.nombre} ${b.aPaterno} ${b.aMaterno}`.toLowerCase();
  
        if (nombreCompletoA < nombreCompletoB) {
          return -1;
        }
        if (nombreCompletoA > nombreCompletoB) {
          return 1;
        }
        return 0;
      });
  
      setUsers(sortedData); // Establecer los datos de los usuarios en el estado, después de ordenarlos
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  
 
 

 
  useEffect(() => {
    showData(); // Llamar a showData al cargar el componente
  }, []);


  
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
    } 
    ,
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
    },
    {
      title: "Acciones",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleActualizar(record)} icon={<EditOutlined />}>Actualizar</Button>
          <Button onClick={() => mostrarModalBorrar(record)} icon={<DeleteOutlined />}>Borrar</Button>
        </div>
      )
    }

    
    
  ];
  return (
    <>
        <Affix>
        <Header />
      </Affix>
      <main className="max-w-full lg:flex flex-row">
        <section className="basis-3/4 mx-5">
          <Titulo tit={"Lista de alumnos"} />
          <div className="overflow-x-auto">
            <Table
              bordered
              columns={columns}
              dataSource={results}
              className="snap-x"
            />
          </div>
        </section>
        <section className="mt-10 basis-1/4 ml-8 rounded-bl-2xl h-fit">
        <Space className="flex flex-col text-left">
            <label htmlFor="" className="text-balance font-bold">
              ¿Desea encontrar a un alumno en específico?
            </label>
            <Search
              placeholder="Ingrese su busqueda"
              value={search}
              onChange={searcher}
              type="text"
              className="form-control w-80 "
            />
            <label className="mt-10 text-[14px] font-bold" htmlFor="">
              Genero
            </label>
         
            <Checkbox.Group
    options={optionsSex}
    value={filterGenderOptions}
    onChange={(values) => {
        if (values.length > 0) {
            // Si se ha seleccionado al menos una opción, establece solo esa opción como filtro de género
            setFilterGenderOptions([values[values.length - 1]]);
        } else {
            // Si no se ha seleccionado ninguna opción, elimina la selección
            setFilterGenderOptions([]);
        }
    }}
    className="text-[14px] accent-blue_uno"
/>


<Button onClick={downloadPDF} type="primary" style={{ marginBottom: '1rem', color: "black" }}>Descargar PDF</Button>

 

          </Space>
           
        </section><br></br><br></br>

        
      </main>
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
      <Button type="primary" htmlType="submit" style={{ color: 'black' }} loading={buttonLoading}>
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
  <p>
    ¿Está seguro de que desea borrar al alumno{' '}
    {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}?
  </p>
  <p>
    Tenga en cuenta que al borrar al alumno, todos los datos relacionados serán eliminados
    permanentemente.
  </p>
  <Form onFinish={borrarFormSubmit}>
    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ color: 'black' }} loading={buttonLoading}>
        Borrar
      </Button>
    </Form.Item>
  </Form>
</Modal>

    </>
  );
};

export default SearchComponent;

import "../css/reg.css";
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Titulo } from "../components/Titulos";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Button, notification, Table, Divider, Input, Affix } from "antd";
import * as XLSX from "xlsx";

const { Dragger } = Upload;

const openNotification = () => {
  notification.error({
    message: "Solo archivos Excel permitidos",
    description: "Asegúrate de subir únicamente archivos Excel con la lista completa de alumnos.",
    placement: "bottomRight",
  });
};

export function Regalu() {
  const [tableData, setTableData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); // Estado de carga del botón
 
  const [cicloEscolar, setCicloEscolar] = useState("2024-2025");

  useEffect(() => {
    setIsButtonDisabled(tableData.length === 0);
  }, [tableData]); // Habilita el botón de registro cuando se extraen datos para la tabla

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(jsonData);  // Guardar los datos en el estado del componente
    };
    reader.readAsArrayBuffer(file);
  };

  const registrarAlumnosEnBD = async () => {
    if (!validateCicloEscolar(cicloEscolar)) {// Validar el formato del ciclo escolar
      notification.error({
        message: "Ciclo escolar inválido",
        description: "Ingresa un ciclo válido (ej. 2024-2025) con el año actual y próximo.",
        placement: "bottomRight",
      });
      return; // Detener la función si el ciclo escolar no es válido
    }
    const datosValidos = tableData.every(alumno => alumno.length === 4);// Verificar si los datos tienen cuatro campos válidos
    if (!datosValidos) {
      notification.error({
        message: "Datos inválidos",
        description: "Cada fila del archivo debe contener cuatro campos: nombre, apellido paterno, apellido materno y sexo.",
        placement: "bottomRight",
      });
      return; // Detener la función si los datos no son válidos
    }
    try {
      const response = await fetch('https://servidor-zonadoce.vercel.app/verificar-asignacion', {// Verificar si el usuario tiene una asignación haciendo una solicitud HTTP
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})  
      });
      const tieneAsignacion = await response.json()
      
      // Verificar si la solicitud fue exitosa y si tiene asignación
      if (response.ok && tieneAsignacion.success) {

      // Si el usuario tiene asignación, continuar con el registro de alumnos
        const dataToSend = {
          alumnos: tableData,
          cicloEscolar: cicloEscolar
        };
        console.log("Datos que se enviarán al backend:", dataToSend);

        // Verificar duplicados antes de enviar los datos al backend
        const duplicadosResponse = await fetch('https://servidor-zonadoce.vercel.app/verificar-duplicados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend) // Envía los datos extraídos del archivo Excel y cicloEscolar al backend para verificar duplicados
        });
        const { duplicadosEncontrados, error } = await duplicadosResponse.json();
        if (error) {// Si hay un error en los datos, mostrar un mensaje de error al usuario
          notification.error({
            message: "Error en los datos",
            description: error,
            placement: "bottomRight"
          });
        } else if (duplicadosEncontrados) {
          notification.warning({
            message: "Algunos alumnos ya están registrados",
            description: "Algunos alumnos que intentas registrar ya están en el sistema. Por favor, revisa los datos e intenta nuevamente.",
            placement: "bottomRight"
          });

        } else {// No se encontraron duplicados, continuar con el registro de alumnos
          setButtonLoading(true); // Activar el estado de carga del botón
          const registroResponse = await fetch('https://servidor-zonadoce.vercel.app/registrar-alumnos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend) // Envía los datos extraídos del archivo Excel y cicloEscolar al backend
          });

          if (registroResponse.ok) {
            // Los datos se almacenaron correctamente en la base de datos
            notification.success({
              message: "Alumnos registrados correctamente",
              placement: "bottomRight"
            });
          } else {
            // Hubo un error al almacenar los datos
            notification.error({
              message: "Error al registrar alumnos",
              description: "Hubo un problema al intentar registrar los alumnos. Por favor, inténtalo de nuevo.",
              placement: "bottomRight"
            });
          }
        }
      }// Si el usuario no tiene asignación, mostrar un mensaje de advertencia
      else {
        notification.warning({
          message: "No tienes una asignación",
          description: "Debes tener una asignación para registrar alumnos.",
          placement: "bottomRight"
        });
      }
    } catch (error) {
      console.error('Error de red:', error);
    }finally {
      setButtonLoading(false); // Desactivar el estado de carga del botón al finalizar el proceso
    }
  };

  const validateCicloEscolar = (cicloEscolar) => {
    const regex = /^\d{4}-\d{4}$/;
    const currentYear = new Date().getFullYear();// Obtener el año actual
    const nextYear = currentYear + 1;// Construir el siguiente año
    const expectedPattern = `${currentYear}-${nextYear}`;// Construir el patrón esperado para el ciclo escolar
    return regex.test(cicloEscolar) && cicloEscolar === expectedPattern;
  };

  const props = {
    name: "file",
    action: "https://servidor-zonadoce.vercel.app/upload",
    maxCount: 1,
    onChange(info) {
      const { status } = info.file;
      console.log("Estado del archivo:", status); // Agregar este registro de consola
      
      if (status === "done") {
        notification.success({
          message: "Archivo cargado correctamente",
          description: `Su archivo ${info.file.name}"  se cargo correctamente, para continuar con el proceso, presionar el boton "Registrar"`,
          placement: "bottomRight"
        });
      } else if (status === "error") {
        message.error(`${info.file.name} No logró subirse el documento.`);
      }
    },
    beforeUpload(file) {
      const isExcel =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        openNotification();
        return false; // No cargues el archivo si no es un archivo de Excel
      } else {
        handleFileUpload(file); // Solo carga el archivo si es un archivo de Excel
        return true;
      }
    },
  };
  
  const generateColumnsAndDataSource = (data) => {
    const columns = data[0].map((header, index) => ({
      title: header,
      dataIndex: index.toString(),
      key: `column-${index}`,
    }));

    const dataSource = data.slice(1).map((row, index) => {
      const rowObject = row.reduce((acc, value, i) => {
        acc[i] = value;
        return acc;
      }, {});
      return { key: `row-${index}`, ...rowObject };
    });

    return { columns, dataSource };
  };

  // Solo generar columnas y origen de datos si tableData tiene datos válidos
  const { columns, dataSource } =
    tableData.length > 0
      ? generateColumnsAndDataSource(tableData)
      : { columns: [], dataSource: [] };
  return (
    <>
      <Affix><Header/></Affix>
      <Titulo tit={"Registrar alumnos"} />
      <div className="container flex flex-row m-auto">
        <div className="basis-2/4 px-6 mb-52">
          <p className="p-5 font-bold text-center text-lg">
            Seleccionar archivo con lista de alumnos
          </p>
          <div className="h-max basis-2/5">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click aquí para subir su lista de alumnos
              </p>
              <p className="ant-upload-hint">
                Si llega a presentar algún problema con la subida de su
                documento, no dude en pedir ayuda y soporte; se tratará de dar
                solución lo antes posible.
              </p>
            </Dragger>
          </div>
          <div className="mt-4 items-start">
            <label >
              Ciclo escolar:
            </label>
            <Input
              placeholder="Ejemplo 2024-2025"
              value={cicloEscolar}
              onChange={(e) => setCicloEscolar(e.target.value)} 
            />
            <Button
              type="primary"
              className="bg-blue_uno text-white h-11 text-lg w-3/4 lg:mb-2 lg:mt-5 
              ease-in-out delay-150 hover-text-grays
              celular:w-2/4 celular:mb-5 celular:mt-3
              duration-75"
              onClick={registrarAlumnosEnBD} // Llama a la función para registrar alumnos en la base de datos
              disabled={isButtonDisabled} loading={buttonLoading}// Deshabilita el botón si no hay datos en la tabla
            >
              Registrar
            </Button>
          </div>
        </div>
        <Divider
          type="vertical"
          className="h-[450px] border border-black opacity-30"
        />
        <div className="container ml-6 basis-3/5">
          <Table columns={columns} dataSource={dataSource} />
        </div>
      </div>
      <Footer />
    </>
  );
}

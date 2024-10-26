import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { DatePicker, TimePicker, Button, Select, Affix, message, Form, Input } from "antd";
import axios from "axios";
import moment from 'moment';
import 'moment/locale/es';
import { ScrollToTop } from "../components/ScrollToTop";
import icono from "../img/calendario.png";
import { Contenido, Notificacion, Titulo } from "../components/Titulos";
import "../css/Login.css";

export function Agenda() {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState(null);
  const [sesionOptions, setSesionOptions] = useState([]);
  const [formValues, setFormValues] = useState({
    titulo: '',
    descripcion: '',
    asignacion: '',
    fecha: null,
    hora: null,
  });

  const obtenerValoresSesion = async () => {
    try {
      const response = await axios.get("https://servidor-zonadoce.vercel.app/sesiones");
      setSesionOptions(response.data);
    } catch (error) {
      console.error("Error al obtener valores de la sesión:", error);
    }
  };


  const handleInsert = async (titulo, descripcion, asignacion, fecha, hora) => {
    try {
      // Formatear fecha y hora
      const formattedFecha = fecha.format('YYYY-MM-DD');
      const formattedHora = hora.format('HH:mm:ss');

      await axios.post("https://servidor-zonadoce.vercel.app/guardarAgenda", {
        titulo: titulo,
        descripcion: descripcion,
        asignacion: asignacion,
        fecha: formattedFecha,
        hora: formattedHora
      });

      message.success("Actividad agendada correctamente.");
    } catch (error) {
      console.error("Error al actualizar los datos de salud:", error);
      message.error("Error al actualizar los datos de salud.");
    }
  };


  useEffect(() => {
    obtenerValoresSesion();
  }, []);

  const handleChange = (changedValues) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
  };

  const isFormComplete = () => {
    const { titulo, descripcion, asignacion, fecha, hora } = formValues;
    return titulo && descripcion && asignacion && fecha && hora;
  };

  // Función para deshabilitar fechas anteriores a la fecha actual
  const disabledDate = (current) => {
    // Deshabilitar fechas anteriores a la fecha actual
    return current && current < moment().startOf('day');
  };

  return (
    <>
      <Affix><Header /></Affix>
      <Presentacion
        tit={"Agenda de la zona"}
        icono={
          <img
            src={icono}
            className="lg:w-[280px] lg:translate-x-32 lg:-translate-y-10 text-white celular:translate-x-2 lg:z-50"
          />
        }
      />
      <div className="lg:w-10/12 lg:m-auto">
        <ScrollToTop />
        <div className="mt-5">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-center">
            Actividades
          </h2>
          <Form
            className="lg:grid grid-rows grid-cols-2 w-12/12 gap-x-4 p-6"
            onValuesChange={(_, allValues) => handleChange(allValues)}
          >
            <div className="flex flex-col">
              <Contenido conTit={"Título de la actividad:"} />
              <Form.Item
                name="titulo"
                rules={[
                  {
                    required: true,
                    message: (
                      <Notificacion noti={"Ingrese el título de la actividad"} />
                    ),
                  },
                  {
                    pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ0-9\s]{3,50}$/,
                    message: "Solo letras, números, longitud entre 3 y 30.",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  className="lg:w-3/3 mb-5 py-2 px-3 mt-1 text-base border border-black border-opacity-30 shadow-md"
                  placeholder="Ejemplo: Reunión..."
                />
              </Form.Item>
            </div>

            <div className="flex flex-col">
              <Contenido conTit={"Descripción:"} />
              <Form.Item
                name="descripcion"
                rules={[
                  {
                    required: true,
                    message: (
                      <Notificacion noti={"Ingrese la descripción de la actividad"} />
                    ),
                  },
                  {
                    pattern: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ0-9\s]{3,1000}$/,
                    message: "Solo letras, números, longitud entre 3 y 100.",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  className="lg:w-3/3 mb-5 py-2 px-3 mt-1 text-base border border-black border-opacity-30 shadow-md"
                  placeholder="Ejemplo: Buen día..."
                />
              </Form.Item>
            </div>

            <div className="flex flex-col">
              <Contenido conTit={"Asignación:"} />
              <Form.Item
                name="asignacion"
                rules={[
                  {
                    required: true,
                    message: "Seleccione su plantel de trabajo",
                  },
                ]}
              >
                <Select
                  placeholder="Ejemplo: Escuela Primaria Bilingüe.... "
                  suffixIcon={<IdcardOutlined />}
                  className="lg:w-3/3 mb-5 h-[42px] mt-1 text-base border border-black border-opacity-30 rounded-md shadow-md"
                >
                  {sesionOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex flex-col">
              <Contenido conTit={"Fecha de finalización:"} />
              <Form.Item
                name="fecha"
                rules={[{ required: true, message: 'Seleccione la fecha de finalización' }]}
              >
                <DatePicker
                  placeholder="Ejemplo: 2024-06-04..."
                  value={fecha}
                  onChange={(date) => {
                    setFecha(date);
                    handleChange({ fecha: date });
                  }}
                  format="YYYY-MM-DD"
                  disabledDate={disabledDate}
                  className="lg:w-3/3 mb-5 h-[42px] mt-1 text-base border border-black border-opacity-30 rounded-md shadow-md"
                />
              </Form.Item>
            </div>




            <div className="flex flex-col">
              <Contenido conTit={"Hora de finalización:"} />
              <Form.Item
                name="hora"
                rules={[{ required: true, message: 'Seleccione la hora de finalización' }]}
              >
                <TimePicker
                  placeholder="Ejemplo: 10:02..."
                  value={hora}
                  onChange={(time) => {
                    setHora(time);
                    handleChange({ hora: time });
                  }}
                  format="HH:mm"
                  className="lg:w-3/3 mb-5 h-[42px] mt-1 text-base border border-black border-opacity-30 rounded-md shadow-md"
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item>
                <Button
                  className="bg-blue_uno text-white h-11 text-lg w-3/4 
              hover:text-gray lg:mt-2 hover:bg-white
              md:w-2/4
              celular:w-2/4 celular:mb-5 celular:mt-3 shadow-md"
                  htmlType="submit"
                  disabled={!isFormComplete()}
                  onClick={() => handleInsert(
                    formValues.titulo,
                    formValues.descripcion,
                    formValues.asignacion,
                    formValues.fecha,
                    formValues.hora
                  )}
                >
                  Continuar
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Presentacion } from "../components/Presntacion";
import { Button, Table, Spin, Checkbox, message, Affix, Modal } from "antd";
import axios from "axios";
import icono from "../img/salud.png";
import { Titulo } from "../components/Titulos";
import "tailwindcss/tailwind.css";

export function RezagoAcademico() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        // Obtiene los alumnos
        const responseAlumnos = await axios.get(
          "http://localhost:3000/alumnos"
        );
        console.log("Respuesta del servidor:", responseAlumnos);
        const registrosOrdenados = ordenarRegistrosPorNombre(
          responseAlumnos.data
        );

        // Filtra los alumnos que ya tienen registros en rezagoAlumno
        const alumnosSinRegistros = await Promise.all(
          registrosOrdenados.map(async (alumno) => {
            try {
              const responseVerificacion = await axios.get(
                `http://localhost:3000/verificar-rezago/${alumno.idAlumnos}`
              );
              return responseVerificacion.data.existe ? null : alumno;
            } catch (error) {
              console.error(
                `Error al verificar el registro del alumno ${alumno.idAlumnos}:`,
                error
              );
              return alumno; // Asume que el alumno debe ser incluido en caso de error en la verificación
            }
          })
        );

        // Filtra los alumnos sin registros
        setRegistros(alumnosSinRegistros.filter(Boolean));
      } catch (error) {
        console.error("Error al obtener registros:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerRegistros();
  }, []);

  const ordenarRegistrosPorNombre = (registros) => {
    return registros.sort((a, b) => {
      const nombreCompletoA = `${a.nombre_completo} ${a.apellido_paterno} ${a.apellido_materno}`.toUpperCase();
      const nombreCompletoB = `${b.nombre_completo} ${b.apellido_paterno} ${b.apellido_materno}`.toUpperCase();
      return nombreCompletoA.localeCompare(nombreCompletoB);
    });
  };

  const handleGuardarRegistroYDetalles = async (record) => {
    const {
      idAlumnos,
      leer,
      escribir,
      habilidad,
      participacion,
      comportamiento,
    } = record;
    try {
      if (
        leer === undefined ||
        escribir === undefined ||
        habilidad === undefined ||
        participacion === undefined ||
        comportamiento === undefined
      ) {
        throw new Error("Debe proporcionar todos los detalles.");
      }

      const datosRegistro = {
        idAlumnos,
        leer,
        escribir,
        habilidad,
        participacion,
        comportamiento,
      };

      const response = await axios.post(
        "http://localhost:3000/guardar-rezago-academico",
        datosRegistro
      );

      message.success(
        "Datos de rezago académico y detalles registrados correctamente"
      );
      // Actualiza los registros después de guardar
      setRegistros((prevRegistros) =>
        prevRegistros.filter((reg) => reg.idAlumnos !== idAlumnos)
      );
    } catch (error) {
      console.error(
        "Error al registrar datos de rezago académico y detalles:",
        error
      );
      message.error("Error al registrar datos de rezago académico y detalles");
    }
  };

  const handleCheckboxChange = (idAlumnos, field, value) => {
    setRegistros((prevRegistros) =>
      prevRegistros.map((record) =>
        record.idAlumnos === idAlumnos ? { ...record, [field]: value } : record
      )
    );
  };

  const handleGuardarTodos = async () => {
    try {
      for (const record of registros) {
        await handleGuardarRegistroYDetalles(record);
      }
      // Re-cargar registros después de guardar todos
      const responseAlumnos = await axios.get("http://localhost:3000/alumnos");
      const registrosOrdenados = ordenarRegistrosPorNombre(
        responseAlumnos.data
      );
      setRegistros(
        registrosOrdenados.filter(
          (alumno) =>
            !registros.find(
              (registro) => registro.idAlumnos === alumno.idAlumnos
            )
        )
      );
      message.success("Todos los registros se han guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar todos los registros:", error);
      message.error("Error al guardar todos los registros.");
    }
  };

  const showConfirmModal = () => {
    setShowModal(true);
  };

  const handleModalOk = () => {
    handleGuardarTodos();
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "idAlumnos",
      key: "idAlumnos",
      render: (text, record, index) => index + 1,
      className: "px-4 py-2 text-center",
    },
    {
      title: "Nombre Completo",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
      className: "px-4 py-2",
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
      className: "px-4 py-2 text-center",
    },
    {
      title: "¿Sabe leer?",
      dataIndex: "leer",
      key: "leer",
      className: "px-4 py-2 text-center",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          <Checkbox
            checked={record.leer === "Sí"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "leer",
                e.target.checked ? "Sí" : null
              )
            }
          >
            Sí
          </Checkbox>
          <Checkbox
            checked={record.leer === "No"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "leer",
                e.target.checked ? "No" : null
              )
            }
          >
            No
          </Checkbox>
        </div>
      ),
    },
    {
      title: "¿Sabe escribir?",
      dataIndex: "escribir",
      key: "escribir",
      className: "px-4 py-2 text-center",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          <Checkbox
            checked={record.escribir === "Sí"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "escribir",
                e.target.checked ? "Sí" : null
              )
            }
          >
            Sí
          </Checkbox>
          <Checkbox
            checked={record.escribir === "No"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "escribir",
                e.target.checked ? "No" : null
              )
            }
          >
            No
          </Checkbox>
        </div>
      ),
    },
    {
      title: "¿Posee habilidades matematicas?",
      dataIndex: "habilidad",
      key: "habilidad",
      className: "px-4 py-2 text-center",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          <Checkbox
            checked={record.habilidad === "Sí"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "habilidad",
                e.target.checked ? "Sí" : null
              )
            }
          >
            Sí
          </Checkbox>
          <Checkbox
            checked={record.habilidad === "No"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "habilidad",
                e.target.checked ? "No" : null
              )
            }
          >
            No
          </Checkbox>
        </div>
      ),
    },
    {
      title: "¿Participa en clase?",
      dataIndex: "participacion",
      key: "participacion",
      className: "px-4 py-2 text-center",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          <Checkbox
            checked={record.participacion === "Sí"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "participacion",
                e.target.checked ? "Sí" : null
              )
            }
          >
            Sí
          </Checkbox>
          <Checkbox
            checked={record.participacion === "No"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "participacion",
                e.target.checked ? "No" : null
              )
            }
          >
            No
          </Checkbox>
        </div>
      ),
    },
    {
      title: "Comportamiento",
      dataIndex: "comportamiento",
      key: "comportamiento",
      className: "px-4 py-2 text-center",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          <Checkbox
            checked={record.comportamiento === "Bueno"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "comportamiento",
                e.target.checked ? "Bueno" : null
              )
            }
          >
            Bueno
          </Checkbox>
          <Checkbox
            checked={record.comportamiento === "Regular"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "comportamiento",
                e.target.checked ? "Regular" : null
              )
            }
          >
            Regular
          </Checkbox>
          <Checkbox
            checked={record.comportamiento === "Malo"}
            onChange={(e) =>
              handleCheckboxChange(
                record.idAlumnos,
                "comportamiento",
                e.target.checked ? "Malo" : null
              )
            }
          >
            Malo
          </Checkbox>
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      className: "px-4 py-2 text-center",
      render: (_, record) => (
        <Button
          size="middle"
          onClick={() => handleGuardarRegistroYDetalles(record)}
          className="bg-blue_uno text-white h-fit text-md lg:w-3/4 
          md:w-2/4
          celular:w-2/4"
        >
          Guardar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Affix>
        <Header />
      </Affix>
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

      <div className="w-10/12 mx-auto my-4">
        <Button
          type="primary"
          onClick={showConfirmModal}
          className="mb-4 bg-blue_uno text-white"
        >
          Guardar Todos
        </Button>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={registros}
            bordered
            rowKey="idAlumnos"
            className="bg-white shadow-md rounded-lg overflow-auto"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>

      <Modal
        title="Confirmación"
        visible={showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Sí"
        cancelText="No"
      >
        <p>¿Está seguro de que desea guardar todos los registros?</p>
      </Modal>

      <Footer />
    </>
  );
}

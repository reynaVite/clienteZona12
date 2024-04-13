import "../css/Login.css";
import "../css/botones.css";
import { DownOutlined } from '@ant-design/icons';
import { Form, Select,Alert, message, Spin, Button, Modal, Row, Col, Card, Pagination } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Titulo, Notificacion, Contenido } from "../components/Titulos";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";
import { Login } from "./Login"; 
const { Option } = Select;
const { confirm } = Modal;

export function AsigGrupo() {
    const [grupoOptions, setGrupoOptions] = useState([]);
    const [gradoOptions, setGradoOptions] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [plantel, setPlantel] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [buttonLoading, setButtonLoading] = useState(false); // Estado de carga del botón
    // Estado para los datos obtenidos de obtenerGrupoDispo
    const [grupoDisponibles, setGrupoDisponibles] = useState([]);


    
    useEffect(() => {
        obtenerGrupoDispo(); 
        obtenerRegistros();
        obtenerGrupo();
        obtenerGrado();
    }, []);

    const plantelTextos = {
        1: 'Zona 12',
        2: 'Benito Juárez',
        3: 'Héroe Agustín'
    };

    const sesionTextos = {
        1: 'Supervisor',
        2: 'Director',
        3: 'Maestro'
    };

    const obtenerGrupoDispo = async () => {
        try {
            const response = await axios.get("http://localhost:3000/grupogradoDispo");
            setGrupoDisponibles(response.data); // Actualiza el estado con los datos obtenidos
        } catch (error) {
            console.error("Error al obtener valores de grupos:", error);
            // Manejar el error
        }
    };
    
    const obtenerRegistros = async () => {
        try {
            const response = await axios.get("http://localhost:3000/docentes_asignacion", {
                params: {
                    plantel: plantel
                }
            });
            console.log("Respuesta del servidor:", response);
            if (response.data.success) {
                setRegistros(response.data.docentes);
                setLoading(false);
            } else {
                message.error(response.data.message);
            }
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

    const handleAceptar = (record) => {
        setSelectedUser(record);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleFormSubmit = async (values) => { 
        setButtonLoading(true); // Activar el estado de carga del botón
 
        try {
            // Verificar si la CURP ya tiene una asignación
            const verificarResponse = await axios.get("http://localhost:3000/verificar_registros_curp", {
                params: {
                    curp: selectedUser.curp
                }
            });

            if (verificarResponse.data.count >= 1) {
                message.info("El docente ya tiene una asignación");
                return;
            }

            // Verificar si el grado y grupo en el plantel ya están asignados
            const verificarGradoGrupoResponse = await axios.get("http://localhost:3000/verificar_asignacion_grado_grupo", {
                params: {
                    plantelId: selectedUser.plantel,
                    grupo: values.grupo,
                    grado: values.grado
                }
            });

            if (verificarGradoGrupoResponse.data.count >= 1) {
                message.info("El grado y grupo en el plantel ya están asignados");
                return;
            }

            // Realizar la asignación del docente
            const response = await axios.post("http://localhost:3000/asignar_grupo_grado", {
                docenteId: selectedUser.curp,
                grupo: values.grupo,
                grado: values.grado,
                plantelId: selectedUser.plantel
            });

            console.log("Respuesta del servidor:", response);

            if (response.data.success) {
                message.success("Docente asignado correctamente");

                // Insertar la CURP del docente en la tabla de alumnos
                const insertarDocenteCurpResponse = await axios.post("http://localhost:3000/insertar_docente_curp_alumnos", {
                    curp: selectedUser.curp,
                    plantelId: selectedUser.plantel,
                    grupo: values.grupo,
                    grado: values.grado
                });
                obtenerRegistros();
                obtenerGrupoDispo();
            } else {
                message.error(response.data.message);
            }
            obtenerRegistros();
            
            obtenerGrupoDispo();
        }  catch (error) {
            console.error("Error al asignar grupo y grado:", error);
            message.error("Error al asignar grupo y grado: " + error.message); // Agregar el mensaje de error al mensaje de la notificación
        }
        finally {
            // Ocultar mensaje de carga
            setButtonLoading(false); // Desactivar el estado de carga del botón
            setModalVisible(false);
        }
    };






    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const renderRegistros = registros.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((registro, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card
                title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}
                style={{ marginBottom: 16 }}
            >
                <p><strong>CURP:</strong> {registro.curp}</p>
                <p><strong>Plantel:</strong> {plantelTextos[registro.plantel]}</p>
                <Button style={{ color: 'black' }} type="primary" onClick={() => handleAceptar(registro)}>
                Asignar grado y grupo
                </Button>
            </Card>
        </Col>
    ));

    return (
        <>
            <CSPMetaTag />
            <Header />
            <div className="boxAdmin">
                <ScrollToTop />
                <Titulo tit={"Maestros del plantel sin asignación"} /> 

<div style={{ width: "50%", margin: "0 auto" }}>
  {grupoDisponibles.length > 0 ? (
    <>
      <p>Grados y grupos con alumnos pero sin asignación de maestro</p>
      <ul>
        {grupoDisponibles.map((grupo, index) => (
          <li key={index} style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "bold" }}>
            Grado: {grupo.grado_id} - Grupo: {grupo.grupo_id === 1 ? 'A' : grupo.grupo_id === 2 ? 'B' : grupo.grupo_id}
          </li>
        ))}
      </ul>
    </>
  ) : (
    <p> </p>
  )}
</div>

<br></br>

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Row gutter={[20, 20]}>
                        {renderRegistros}
                    </Row>
                )}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Pagination
                        current={currentPage}
                        total={registros.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div><br></br>
            <Footer />

            <Modal
                title="Asignar docente"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <p>Docente: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>
                <Form onFinish={handleFormSubmit}>
                    <Contenido conTit={"Grupo"} />
                    <Form.Item
                        name="grupo"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <Notificacion
                                        noti={"Seleccione un grupo"} />
                                ),
                            },
                        ]}
                    >
                        <Select
                            placeholder="Ejemplo: A"
                            suffixIcon={<IdcardOutlined />}
                        >
                            {grupoOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Contenido conTit={"Grado"} />
                    <Form.Item
                        name="grado"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <Notificacion
                                        noti={"Seleccione un grado"} />
                                ),
                            },
                        ]}
                    >
                        <Select
                            placeholder="Ejemplo: 4"
                            suffixIcon={<IdcardOutlined />}
                        >
                            {gradoOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ color: 'black' }} loading={buttonLoading}>
                            Asignar grupo y grado
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

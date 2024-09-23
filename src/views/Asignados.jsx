import "../css/Login.css";
import "../css/botones.css";
import { DownOutlined, DeleteOutlined, EditOutlined, UpOutlined} from '@ant-design/icons';
import { Form, Select, message, Spin, Button, Modal, Row, Col, Card, Pagination } from 'antd';
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

export function Asignados() {
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
    const [buttonLoading, setButtonLoading] = useState(false); // Estado de carga del botón
 
    useEffect(() => {
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

    const GrupoTextos = {
        1: 'A',
        2: 'B', 
    };

    const obtenerRegistros = async () => {
        try {
            const response = await axios.get("http://localhost:3000/asignaciong", {
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
            // Verificar si el grado y grupo ya están asignados al docente en la base de datos
            const verificarAsignacionResponse = await axios.get("http://localhost:3000/verificar_asignacionGG", {
                params: {  
                    grupo: values.grupo,
                    grado: values.grado
                }
            });
    
            if (verificarAsignacionResponse.data.count >= 1) {
                message.info("El grado y grupo ya están asignados al docente");
                return;
            }
    
            // Si los registros no existen, proceder con la actualización
            const response = await axios.post("http://localhost:3000/actualizar_asignacion", {
                docenteId: selectedUser.id, 
                grupo: values.grupo,
                grado: values.grado
            });
    
            console.log("Respuesta del servidor:", response);
    
            if (response.data.success) {
                message.success("Asignación actualizada correctamente");
                obtenerRegistros();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al asignar grupo y grado:", error);
            message.error("Error al asignar grupo y grado");
        } finally {
            // Ocultar mensaje de carga
            message.destroy('Actualizando');
            setModalVisible(false);
        }
    };
    

    const borrarFormSubmit = async () => {
        setButtonLoading(true); // Activar el estado de carga del botón
        try {
            
            const response = await axios.post("http://localhost:3000/borrar_asignacion", {
                docenteId: selectedUser.id,
            });
    
            console.log("Respuesta del servidor:", response);
    
            if (response.data.success) {
                message.success("Asignación borrada correctamente");
                obtenerRegistros();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al borrar asignación:", error);
            message.error("Error al borrar asignación");
        } finally {
            // Ocultar mensaje de carga
            setButtonLoading(false); // Desactivar el estado de carga del botón
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
      <Titulo tit={"Maestros del plantel con asignación"} />
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Row gutter={[20, 20]}>
                        {registrosPaginados.map((registro, index) => (
                            <Col key={registro.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                                <Card
                                    title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}
                                   
                                 
                                   

                                    style={{ marginBottom: 16 }}
                                >
                                    <p><strong>CURP:</strong> {registro.docente_curp}</p>
                                 
                                        <>
                                           <strong>Plantel:</strong> {plantelTextos[registro.docente_plantel]} &nbsp;
                                           <strong>Grado:</strong> {registro.grado_id} &nbsp;
                                           <strong>Grupo:</strong> {GrupoTextos[registro.grupo_id]}
                                        </>
                                     
                                    <div className="acciones ant-space">
                                       { /*<Button   onClick={() => handleActualizar(registro)} icon={<EditOutlined />}>Actualizar</Button>*/}
                                        <Button  onClick={() => mostrarModalBorrar(registro)} icon={<DeleteOutlined />}>Borrar</Button>
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
                title="Actualizar asignación"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}>
                <p>Docente: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>
                <Form onFinish={actualizarFormSubmit}>
                    <Contenido conTit={"Grupo"} />
                    <Form.Item
                        name="grupo"
                        rules={[
                            {
                                required: true,
                                message: <Notificacion noti={"Seleccione un grupo"}/>
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
                                message: <Notificacion noti={"Seleccione un grado"}/>
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
                        <Button type="primary" htmlType="submit" style={{ color: 'black' }}>
                            Asignar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Ventana emergente de borrar asignación */}
            <Modal
                title="Borrar asignación"
                visible={borrarModalVisible}
                onCancel={handleCancelarBorrar}
                footer={null}
            >
                <p>Docente: {selectedUser && `${selectedUser.nombre} ${selectedUser.aPaterno} ${selectedUser.aMaterno}`}</p>
                <Form onFinish={borrarFormSubmit}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ color: 'black' }}   loading={buttonLoading}>
                            Borrar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
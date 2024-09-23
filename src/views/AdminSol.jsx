import "../css/Login.css";
import { Form, Table, Select, message, Spin, Progress, Button, Row, Col, Card, Pagination, Modal } from 'antd';
import { ExclamationCircleOutlined , DownOutlined, UpOutlined } from '@ant-design/icons';
 
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Subtitulo, Titulo,Notificacion, Contenido } from "../components/Titulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSPMetaTag } from "../components/CSPMetaTag";

const { Option } = Select;
const { confirm } = Modal;


export function AdminSol() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 9;

    useEffect(() => {
        obtenerRegistros();
    }, [paginaActual]); // Asegúrate de volver a obtener los registros cuando cambie la página

 
    const obtenerRegistros = async () => {
        try {
            const response = await axios.get("http://localhost:3000/registroSol");
            setRegistros(response.data);
            setLoading(false);
        } catch (error) {
            message.error("Error al obtener registros");
        }
    };

    const handleAceptar = async (record) => {
        confirm({
            title: '¿Estás seguro de aceptar esta solicitud?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer.',
            okText: 'Aceptar',
            cancelText: 'Cancelar',
            okButtonProps: { style: { color: 'black' } }, 
            async onOk() {
                try {
                    const respuesta = await axios.get(`http://localhost:3000/registroSolAcep?curp=${record.curp}`);
                    const datos = respuesta.data;
                    message.success("La solicitud ha sido aceptada con éxito.");
                    obtenerRegistros();
                } catch (error) {
                    message.error("Error al aceptar la solicitud");
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleRechazar = async (record) => {
        confirm({
            title: '¿Estás seguro de rechazar esta solicitud?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer.',
            okText: 'Aceptar',
            cancelText: 'Cancelar',
            okButtonProps: { style: { color: 'black' } }, 
            async onOk() {
                try {
                    const respuesta = await axios.get(`http://localhost:3000/registroSolCan?curp=${record.curp}`);
                    const datos = respuesta.data;
                    message.success("La solicitud ha sido rechazada con éxito. ");
                    obtenerRegistros();
                } catch (error) {
                    message.error("Error al rechazar la solicitud");
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

 


    const handleToggleDetails = (index) => {
        const updatedRegistros = [...registros];
        // Asegúrate de que el índice esté dentro del rango de registros
        if (index >= 0 && index < updatedRegistros.length) {
            // En lugar de acceder directamente a la propiedad, podrías usar un enfoque más seguro
            updatedRegistros[index] = {
                ...updatedRegistros[index],
                showDetails: !updatedRegistros[index].showDetails
            };
            setRegistros(updatedRegistros);
        }
    };

    const handlePaginationChange = (pageNumber) => {
        setPaginaActual(pageNumber);
    };

    const renderRegistros = () => {
        const indiceInicial = (paginaActual - 1) * registrosPorPagina;
        const indiceFinal = paginaActual * registrosPorPagina;
        const registrosPaginados = registros.slice(indiceInicial, indiceFinal);

        return registrosPaginados.map((registro, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card
                    title={`${registro.nombre} ${registro.aPaterno} ${registro.aMaterno}`}
                    style={{ marginBottom: 16 }}
                    extra={
                        <Button
                            type="text"
                            onClick={() => handleToggleDetails(index)}
                        >
                            {registro.showDetails ? <UpOutlined /> : <DownOutlined />}
                        </Button>
                    }
                >
                    <p><strong>CURP:</strong> {registro.curp}</p>
                    {registro.showDetails && (
                        <>
                          
                    {registro.sesion} del plantel {registro.plantel} &nbsp;
                    <p><strong>Correo:</strong> {registro.correo}</p>
                    <div><strong>Solicitud:</strong> {new Date(registro.fecha_solicitud).toLocaleString()}</div>
                   

                        </>
                    )}
                    <div className="acciones ant-space">
                        <Button   onClick={() => handleAceptar(registro)}>Aceptar</Button>
                        <Button   onClick={() => handleRechazar(registro)}>Rechazar</Button>
                    </div>
                </Card>
            </Col>
        ));
    };

    return (
        <>
            <CSPMetaTag />
            <Header />
            <div className="boxAdmin">
                <ScrollToTop />
                <Titulo tit={"Solicitudes de registro"} />
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <>
                        <Row gutter={[20, 20]}>
                            {renderRegistros()}
                        </Row>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Pagination
                                total={registros.length}
                                pageSize={registrosPorPagina}
                                current={paginaActual}
                                onChange={handlePaginationChange}
                            />
                        </div>
                    </>
                )}<br></br>
            </div>
            <Footer />
        </>
    );
}

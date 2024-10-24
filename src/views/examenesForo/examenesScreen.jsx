import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useParams, useLocation } from "react-router-dom";
import Comment from "./Components/Coment";
import { format } from 'date-fns';
import axios from 'axios';
import { Button, Input, message, Form, Modal } from "antd";
import { EnterOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const Comments = () => {
  const [descripcion, setDescripcion] = useState("");
  const [userCurp, setUserCurp] = useState(""); 
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState("");
  
  const { id } = useParams();
  const location = useLocation();
  const exam = location.state?.exam;

  useEffect(() => { 
    const storedCurp = localStorage.getItem("userCURP") || "";
    setUserCurp(storedCurp);
    console.log("CURP del usuario:", storedCurp); // Verifica que se obtiene la CURP del usuario
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/foro");
        const filteredComments = response.data.filter(comment => comment.id_examen === parseInt(id));
        console.log("Comentarios filtrados:", filteredComments); // Verifica los comentarios filtrados
        setComments(filteredComments);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
        message.error("Error al obtener comentarios");
      }
    };

    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getPdf?id=${id}`);
        const { pdfUrl } = response.data; // Obtener la URL del PDF
        setPdfUrl(pdfUrl); // Almacenar la URL en el estado
      } catch (error) {
        console.error("Error al obtener el PDF:", error);
        message.error("Error al obtener el PDF");
      }
    };
  
    fetchPdf();
  }, [id]);
  

  const handleInsert = async () => {
    try {
      const fecha = new Date();
      const hora = new Date();
  
      const formattedFecha = format(fecha, 'yyyy-MM-dd');
      const formattedHora = format(hora, 'HH:mm:ss');
  
      const postData = {
        id: id,
        opinion: descripcion,
        fecha: formattedFecha,
        hora: formattedHora,
        curp: userCurp  || "N/A", // CURP del docente 
      };
  
      console.log("Datos enviados a la ruta guardarForo:", postData);
  
      await axios.post("http://localhost:3000/guardarForo", postData);
      message.success("Comentario guardado correctamente.");
      setComments([...comments, postData]);
      setDescripcion("");
    } catch (error) {
      console.error("Error al guardar el comentario:", error);
      message.error("Error al guardar el comentario");
    }
  };
  
  const handleDelete = (commentId) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de que deseas eliminar este comentario?',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/eliminarComentario/${commentId}`);
          setComments(comments.filter(comment => comment.id !== commentId));
          message.success("Comentario eliminado correctamente.");
        } catch (error) {
          console.error("Error al eliminar el comentario:", error);
          message.error("Error al eliminar el comentario");
        }
      },
      onCancel() {
        console.log('Eliminación cancelada');
      },
    });
  };

  const handleEdit = (commentId) => {
    const commentToEdit = comments.find(comment => comment.id === commentId);
    if (commentToEdit) {
      setEditCommentId(commentId);
      setEditDescripcion(commentToEdit.opinion);
      setIsModalVisible(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const postData = {
        id: editCommentId,
        opinion: editDescripcion,
      };

      await axios.put("http://localhost:3000/actualizarComentario", postData);

      message.success("Comentario actualizado correctamente.");
      setComments(comments.map(comment => comment.id === editCommentId ? { ...comment, opinion: editDescripcion } : comment));
      setIsModalVisible(false);
      setEditDescripcion("");
      setEditCommentId(null);
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
      message.error("Error al actualizar el comentario");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-row items-start p-10 m-4">
        <div className="w-1/2 h-96 mr-4">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="PDF Viewer"
            />
          ) : (
            <div className="bg-gray-400 w-full h-full flex items-center justify-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Placeholder"
              />
            </div>
          )}
        </div>

        <div className="w-1/2">
          <h2 className="text-2xl font-bold">Examen {exam?.numero || id}</h2>
          <p className="text-gray-600 mt-2">
            <strong>Materia:</strong> {exam?.materia || "Cargando..."}<br />
            <strong>Descripción:</strong> {exam?.descripcion || "Cargando..."}<br />
            <strong>CURP:</strong> {exam?.docente_curp || "Cargando..."}<br />
            <strong>Fecha:</strong> {exam?.fecha ? format(new Date(exam.fecha), 'dd/MM/yyyy') : "Cargando..."}<br />
            <strong>Hora:</strong> {exam?.hora || "Cargando..."}
          </p>
          <div className="p-4 border-t border-gray-300">
            <Form.Item required style={{ marginBottom: '24px' }}>
              <Input.TextArea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                placeholder="Introduce una descripción del examen"
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={handleInsert}
                icon={<EnterOutlined />}
                style={{ width: '100%' }}
                disabled={!descripcion.trim()}
              >
                Comentar
              </Button>
            </Form.Item>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">{comments.length} comentarios</h3>
            <div>
              {comments.map((comment, index) => {
                console.log(`Comentario CURP: ${comment.curp}`); // Muestra el CURP del comentario
                console.log(`Comparando CURP del usuario: ${userCurp} con CURP del comentario: ${comment.curp}`); // Verifica la comparación

                return (
                  <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                    <Comment
                      author={comment.curp}
                      avatar="https://cdn-icons-png.freepik.com/512/878/878719.png"
                      content={comment.opinion}
                      datetime={`${format(new Date(comment.fecha), 'dd/MM/yyyy')} ${comment.hora}`}
                    />
                    {comment.curp === userCurp && (
                      <div className="mt-2 flex gap-2">
                        <Button
                          onClick={() => handleEdit(comment.id)}
                          icon={<EditOutlined />}
                          style={{ marginRight: '8px' }}
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(comment.id)}
                          icon={<DeleteOutlined />}
                          danger
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Editar Comentario"
        visible={isModalVisible}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false);
            setEditDescripcion("");
            setEditCommentId(null);
          }}>
            Cancelar
          </Button>,
          <Button key="submit" onClick={handleUpdate} disabled={!editDescripcion.trim()}>
            Editar
          </Button>,
        ]}
        onCancel={() => {
          setIsModalVisible(false);
          setEditDescripcion("");
          setEditCommentId(null);
        }}
      >
        <Form.Item required>
          <Input.TextArea
            value={editDescripcion}
            onChange={(e) => setEditDescripcion(e.target.value)}
            rows={4}
            placeholder="Edita tu comentario"
          />
        </Form.Item>
      </Modal>
      <Footer />
    </>
  );
};

export default Comments;

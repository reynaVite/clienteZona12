import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Subtitulo, Titulo } from "../components/Titulos";
import { Input, Button, message } from "antd";
import axios from "axios";
import "../css/Historial.css";

export function Historial() {
  const [categoria, setCategoria] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z\s]*$/;
    if (regex.test(inputValue) || inputValue === "") {
      setCategoria(inputValue);
      setError("");
    } else {
      setError("Por favor, ingrese solo letras y espacios.");
    }
  };

  const handleGuardar = async () => {
    if (categoria.trim() === "") {
      setError("El campo no puede estar vacío.");
    } else {
      try {
        // Realizar la solicitud HTTP POST a la API para guardar la nueva categoría
        await axios.post("http://localhost:3000/Insercategorias", {
          categoria: categoria.trim()
        });
        message.success("Categoría guardada correctamente.");
        setError("");
      } catch (error) {
        console.error("Error al guardar la categoría:", error);
        message.error("Error al guardar la categoría");
      }
    }
  };

  return (
    <>
      <Header />
      <Titulo tit={"Datos médicos del alumno"} />
      <div className="container">
        <div className="form-container">
          <label htmlFor="nuevaCategoria" style={{ marginLeft: "20px" }}>
            Agregar nueva categoría:
          </label>
          <Input
            id="nuevaCategoria"
            placeholder="Ingrese la nueva categoría"
            style={{ width: "150px" }}
            value={categoria}
            onChange={handleChange}
          />
          <div style={{ marginLeft: "20px", marginTop: "5px", color: "red" }}>
            {error && <span>{error}</span>}
          </div>
          <Button
            type="primary"
            style={{ marginLeft: "10px", color: "black" }}
            onClick={handleGuardar}
          >
            Guardar
          </Button>
        </div>
      </div>
      <br></br>
      <Footer />
    </>
  );
}

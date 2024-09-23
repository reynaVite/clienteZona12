import React from "react";

const formatDate = (dateString) => {
  // Convierte el string de fecha a un objeto Date
  const date = new Date(dateString);

  // Usa toLocaleDateString para formatear la fecha
  return date.toLocaleDateString("es-ES", {
    weekday: 'long', // Opcional: muestra el nombre del día de la semana
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ExamCard = ({ title, description, docente_curp, hora, fecha }) => (
  <div
    className="h-auto w-80 rounded-3xl cursor-pointer 
               shadow-gray-900 shadow-2xl hover:shadow-lg hover:shadow-gray-300 
               transition-all duration-300 hover:scale-105 border-gray-100 hover:border-solid hover:border-black"
  >
    <div className="bg-blue_midle rounded-t-3xl">
      <h3 className="text-xl px-6 py-2 text-white font-bold">{title}</h3>
    </div>
    <div className="p-4">
      <p className="text-gray-600 mt-2 line-clamp-3">{description}</p>
      <p className="text-gray-400 text-sm mt-2">CURP: { docente_curp}</p>
      <p className="text-gray-400 text-sm mt-1">Hora: {hora}</p>
      <p className="text-gray-400 text-sm mt-1">Fecha: {formatDate(fecha)}</p>
    </div>
  </div>
);

export default ExamCard;

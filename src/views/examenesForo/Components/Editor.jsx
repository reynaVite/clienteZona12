// ./Components/Editor.js
import React from 'react';

const Editor = ({ onChange, onSubmit, submitting, value }) => {
  return (
    <div className="p-4 border-t border-gray-300">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Escribe un comentario..."
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows="4" // Asegúrate de que el área de texto tenga suficiente altura
      />
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-blue-500 text-white p-2 rounded shadow-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        {submitting ? 'Enviando...' : 'Comentar'}
      </button>
    </div>
  );
};

export default Editor;

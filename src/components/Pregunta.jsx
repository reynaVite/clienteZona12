import { Divider } from "antd";
import React, { useState } from "react";

const CardPregunta = ({ pregunta, respuesta }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Divider className="chiUwu" />
      <div className="lg:w-full lg:max-w-6xl celular:max-w-sm mx-auto mt-4 hover:scale-105 hover:transition-all hover:duration-300">
        <div className="bg-white shadow-lg rounded my-6">
          <div
            className="px-3 py-3 mb-1 border-b-2  border-gray-900 cursor-pointer "
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-row items-baseline justify-between">
              <p className="text-gray-900 font-semibold">{pregunta}</p>
              <button className="mt-2 text-blue_uno text-2xl font-bold">
                {isOpen ? "-" : "+"}
              </button>
            </div>
            {isOpen && <p className="mt-4 text-gray-600">{respuesta}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPregunta;

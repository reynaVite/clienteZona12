import React from "react";
import { Carousel } from "antd";
import imagensita from "../img/zonita.jpeg";

 
export const Carrusel = () => {
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  return (
    <Carousel autoplay className="h-80 -z-10">
      <div>
        <img src={imagensita} alt="" className="imgCarru h-80 w-screen" />
      </div>
      <div>
        <img src={imagensita} alt="" className="imgCarru h-80 w-screen" />
      </div>
      <div>
        <img src= alt="" className="imgCarru h-80 w-screen" />
      </div>
      <div>
        <img src={imagensita} alt="" className="imgCarru h-80 w-screen" />
      </div>
    </Carousel>
  );
};

import { Affix } from "antd";
import Bracrum from "./breadCrumber";

export const Presentacion = ({ tit, icono }) => {
  return (
    <>
      <section className="bg-blue_uno flex flex-row  lg:h-72 rounded-b-3xl">
        <div
          className="basis-3/5 text-white lg:text-7xl font-semibold p-20 gap-1
          celular:text-3xl celular:p-7"
        >
          {tit}
        </div>
        <div className="basis-2/5 max-h-44 justify-center items-center">
          <div
            className="bg-gray-300 lg:w-10/12 lg:h-60 mt-12 rounded-t-3xl  
            celular:w-8/12 -z-10"
          >
            <p className="">{icono}</p>
          </div>
        </div>
      </section>
      <Bracrum />
    </>
  );
};

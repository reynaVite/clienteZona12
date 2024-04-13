import noau from "../img/no-tocar.png";
import { Link } from "react-router-dom";
const Unauthorized = () => {
  return (
    <>
      <main className="container flex justify-center mx-auto p-20 mt-4 ">
        <div className="basis-1/2 ">
          <img
            src={noau}
            alt=""
            className="-skew-y-12 "
          />
        </div>
        <div className="basis-1/2 p-10 text-center mt-16">
          <h2 className="font-bold text-6xl ">Lo sentimos</h2>
          <h3 className="font-semibold mt-10 text-3xl">
            No cuentas con permisos para acceder a esta pagina
          </h3>
          <Link
            className="text-[#0cb7f2] "
            to={"/Inicio"}
          >
            <p className="mt-5 hover:scale-110 transition-all duration-300">
              Volver a la pantalla de Inicio
            </p>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Unauthorized;

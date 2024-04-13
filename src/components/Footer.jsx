import logo from "../img/logo.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <>
      <footer className="bg-blue_uno text-white space-y-12 p-10 leading-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-9">
          <div className="flex items-center justify-center">
            <img className="w-60 h-60 " src={logo} alt="Logo de la empresa" />
          </div>
          <div>
            <h3 className="text-lg mb-2 font-bold">Contacto</h3>
            <p>Si tienes alguna pregunta, ponte en contacto con nosotros</p>
            <p>
              <strong>Correo electrónico</strong>: zona012huazalingo@gmail.com
            </p>
            <p>
              <strong>Teléfono</strong>: +52 771-191-3179
            </p>
          </div>
          <div>
            <h3 className="text-lg mb-2 font-bold">Enlaces útiles</h3>
            <Link to="/Terminos">
              <p>- Términos y condiciones</p>
            </Link>
            <Link to="/Politicas">
              <p>- Política de privacidad</p>
            </Link>
            <Link to="/Cookies">
              <p>- Política de Cookies</p>
            </Link>
          </div>
          <div>
            <h3 className="text-lg mb-2 font-bold">
              Síguenos en redes sociales
            </h3>
            <p>Facebook</p>
            <p>Twitter</p>
          </div>
          <div>
            <h3 className="text-lg mb-2 font-bold">Nuestra Ubicación</h3>
            <p>
              <strong>Dirección</strong>: Calle Numero 7 Colonia Magisterial,
              San lucas, Huazalingo
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

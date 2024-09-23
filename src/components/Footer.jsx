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
              <strong>Teléfono</strong>: +52 771-149-9741
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
            <h3 className="text-lg mb-2 font-bold">Nuestra Ubicación</h3>
            <p>
              <strong>Dirección</strong>: Colonia Rossell S/N. Mpio. de Huazalingo Hidalgo
            </p>
          </div>


          <div> 
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17278.604159514634!2d-98.51195178683992!3d20.97780946597507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d6d674dc042a25%3A0xa3bad583ea2915ee!2s43070%20Huazalingo%2C%20Hgo.!5e0!3m2!1ses!2smx!4v1724653124656!5m2!1ses!2smx"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </footer>
    </>
  );
};

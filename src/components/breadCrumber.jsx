import { Link, useLocation } from "react-router-dom";

const Bracrum = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Objeto de mapeo para los nombres personalizados
  const nameMap = {
    home: "Inicio",
    Registro: "Registro",
    Login: "Inicio de Sesion",
    Quien: "¿Quienes somos?",

    Preguntas: "Preguntas frecuentes",

    RegA: "Registrar alumnos",
    MiLista: "Lista de alumnos",
    modal: "Modificar lista de alumnos",

    Mapa: "Mapa de navegación", 
    ReContraseña: "Recuperación de contraseña paso 1",
    Re2Contraseña: "Recuperación de contraseña paso 2",
  };

  return (
    <div className="p-5 text-base">
      <Link className="text-black hover:text-[#60bdfc]" to="/">
        Inicio
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        // Usa el nombre personalizado si existe, de lo contrario usa el nombre de la ruta
        const displayName = nameMap[name] || name;

        return (
          <span key={name}>
            <span> / </span>
            {isLast ? (
              <span>{displayName}</span>
            ) : (
              <Link to={routeTo}>{displayName}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
};
export default Bracrum;

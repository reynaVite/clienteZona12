export const routesByRole = {
  "guest": [
    { name: "PreRegistro", path: "/Solicitud" },
    { name: "Registro", path: "/RegistroF" },
    { name: "Iniciar Sesion", path: "/Login" },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },

  ],
  "1": [
    { name: "Inicio", path: "/Inicio" },
    { name: "Usuarios", path: "/AdminRe" },
    
    { name: "Solicitudes", path: "/AdminSol" }, 
   
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },
    { name:"Salir", path:"/Logout"}

  ],
  "2": [
    { name: "Inicio", path: "/Inicio" },
    ,
    {
      name: "Maestros",
      submenu: [
        { name: "Asignar", path: "/AsigGrupo" }, 
        { name: "Asignados", path: "/Asignados" }, 
      ],
    },
 
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name: "Preguntas", path: "/Preguntas" },
    { name: "Mapa", path: "/Mapa" },
    { name:"Salir", path:"/Logout"}

  ],
  "3": [
    { name: "Inicio", path: "/Inicio" }, 

    {
      name: "Salud",
      submenu: [
        { name: "Registro", path: "/Salud" },
        { name: "Datos de salud", path: "/SaludDatos" }, 
      ],
    } ,
    {
      name: "Alumnos",
      submenu: [
        { name: "Registrar", path: "/RegA" },
        { name: "Lista de alumnos", path: "/MiLista" }, 
      ],
    },
    { name: "¿Quiénes somos?", path: "/Quien" },
    { name:"Salir", path:"/Logout"}
  ],
};
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "../views/Home";
import { Login } from "../views/Login";
import { Terminos } from "../views/Terminos";
import { Quien } from "../views/Quiensoy";
import { Politicas } from "../views/Politicas";
import { Cookies } from "../views/Cookies";
import { Regalu } from "../views/RegAlumnos";
import SearchComponent from "../views/Misalumnos";
import { Salud } from "../views/Salud";
import { Preguntas } from "../views/Preguntas";
import { Escoger } from "../views/Escogerexa";
import { Historial } from "../views/Historial";
import { ModA } from "../views/Modalumnos";
import { ReContraseña } from "../views/ReContraseña";
import { Re2Contraseña } from "../views/Re2Contraseña";
import { Registro } from "../views/Registro";
import { RegistroF } from "../views/RegistroF";
import { Solicitud } from "../views/Solicitud";
import { Mapa } from "../views/Mapa";


import { Asignados } from "../views/Asignados";


import { AdminRe } from "../views/AdminRe";
import { AdminRe2 } from "../views/AdminRe2";
import { AdminSol } from "../views/AdminSol";
import NotFound from "../errores/404";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/Login",
    element: <Login/>,
  },
  {
    path: "/Terminos",
    element: <Terminos/>,
  },
  {
    path: "/Quien",
    element: <Quien />,
  },
  {
    path: "/Politicas",
    element: <Politicas />,
  },
  {
    path: "/Cookies",
    element: <Cookies />,
  },
  {
    path: "/RegA",
    element: <Regalu />,
  },
  {
    path: "/MiLista",
    element: <SearchComponent/>,
  },
  {
    path: "/Salud",
    element: <Salud />,
  },
  {
    path: "/Preguntas",
    element: <Preguntas />,
  },
  {
    path: "/esExamen",
    element: <Escoger />,
  },
  {
    path: "/Historial",
    element: <Historial />,
  },
  {
    path: "/modal",
    element: <ModA />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/ReContraseña",
    element: <ReContraseña />,
  },
  {
    path: "/Re2Contraseña",
    element: <Re2Contraseña />,
  },
  {
    path: "/Registro",
    element: <Registro />,
  },
  {
    path: "/Solicitud",
    element: <Solicitud />,
  },
  {
    path: "/Mapa",
    element: <Mapa />,
  },
  {
    path: "/AdminRe",
    element: <AdminRe />,
  },
  {
    path: "/AdminRe2",
    element: <AdminRe2 />,
  },
  {
    path: "/AdminSol",
    element: <AdminSol />,
  },  
  {
    path: "/RegistroF",
    element: <RegistroF />,
  },  {
    path: "/Asignados",
    element: <Asignados />,
  },
]);

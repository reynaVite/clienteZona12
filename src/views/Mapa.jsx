import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Subtitulo, Titulo } from "../components/Titulos";
import "../css/Inicio.css";
import { ScrollToTop } from "../components/ScrollToTop";
import inicio from "../img/mapa.png";

import { data } from "../js/data";

export function Mapa() {
  return (
    <>
      <Header />

      <Titulo tit="Mapa de navegación del sitio web" />

      <div className="tres">
        <ScrollToTop />

        <div className="image">
          <img src={inicio} alt="" />
        </div>
      </div>

      <Footer />
    </>
  );
}

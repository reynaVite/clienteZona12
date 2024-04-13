import logo from "../img/logo.png";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import { routesByRole } from "../js/routesByRole";
import { Tooltip, Avatar } from "antd";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const userCURP = localStorage.getItem("userCURP") || "";
  const userPlantel = localStorage.getItem("userPlantel") || ""; 

  const userRole = localStorage.getItem("userRole") || "guest";
  const filteredNavigation = routesByRole[userRole] || [];

  console.log("Valor de userPlantel:", userPlantel);

  const getplantelText = (userPlantel) => {
    switch (userPlantel) {
      case "1":
        return "Zona 012";
      case "2":
        return "Benito Juárez";
      case "3":
        return "Héroe Agustín";
      
    }
  };


  const getRoleText = (role) => {
    switch (role) {
      case "1":
        return "Supervisor";
      case "2":
        return "Director";
      case "3":
        return "Docente";
      default:
        return "Invitado";
    }
  };

  return (
    <>
      <div className={`barNav ${menuOpen ? "active" : ""}`}>
        <div className="barNav-logo" style={{ marginBottom: menuOpen ? "20px" : "0" }}>
          <Link to={"/Inicio"}>
            <img
              src={logo}
              alt="Logo para pagina web zona escolar 012"
              title="Zona escolar 012"
            />
          </Link>
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`barNav-menu ${menuOpen ? "active" : ""}`} style={{ paddingTop: menuOpen ? "10px" : "0" }}>
          {filteredNavigation &&
            filteredNavigation.map((item, index) => (
              <li key={index} className="barNav-menu-element">
                <span className="barNav-text">
                  {item.submenu ? (
                    <>
                      <Link className="barNav-text" to={item.path}>
                        {item.name}
                      </Link>
                      <div className="submenu">
                        {item.submenu.map((subitem, subindex) => (
                          <Link key={subindex} to={subitem.path}>
                            {subitem.name}
                            {subitem.icon && <subitem.icon />}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link className="barNav-text" to={item.path}>
                      {item.name}
                    </Link>
                  )}
                </span>
              </li>
            ))}

          {(userRole === "1" || userRole === "2" || userRole === "3") && userCURP && (
            <li className="barNav-menu-element">
              <span className="barNav-text">
                <Tooltip title={<strong>{getRoleText(userRole)}<br />{userCURP}<br />{getplantelText(userPlantel)}</strong>}>
                  <Avatar style={{ backgroundColor: '#1890ff', color: '#fff' }}>
                    {userCURP.charAt(0)}
                  </Avatar>
                </Tooltip>
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

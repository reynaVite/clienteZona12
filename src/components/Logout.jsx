import { Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("userRole");
    navigate("/login");
  }, [navigate]);
}

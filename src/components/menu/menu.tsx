import { Link } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
export default function Menu() {
  const [activeItem, setActiveItem] = useState(""); // State to track active item

  useEffect(() => {
    const pathname = location.pathname.substr(1);
    setActiveItem(pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log("active item", activeItem);
  }, [activeItem]);

  return (
    <header className="container_menu">
      <div className="container_icon">
        <img src="/src/assets/Logo2.png" width="320" className="soft_icon" />
      </div>
      <div className="navbar">
        <Link
          className={`nav-item ${activeItem === "" ? "active" : ""}`}
          to={"/"}
        >
          Setup
        </Link>
        <Link
          to={"/dashboard"}
          className={`nav-item ${activeItem === "dashboard" ? "active" : ""}`}
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}

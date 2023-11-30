import { Link } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
export default function CustomMenu() {
  const [activeItem, setActiveItem] = useState(""); // State to track active item

  useEffect(() => {
    const pathname = location.pathname.substr(1);
    setActiveItem(pathname);
  }, [location.pathname]);

  return (
    <header className="container_menu">
      <div className="container_icon">
        <img src="/src/assets/Logo2.png" width="320" className="soft_icon" />
      </div>
      <div className="navbar">
        <Link
          className={`nav-item ${activeItem === "" ? "active" : ""}`}
          to={"/home"}
        >
          Setup
        </Link>
        <Link
          to={"/dashboard"}
          className={`nav-item ${activeItem === "dashboard" ? "active" : ""}`}
        >
          Dashboard
        </Link>
        {/* TO DO: Create a logic with the access type to make it visible this link */}
        <Link
          to={"/accesscontrol"}
          className={`nav-item ${
            activeItem === "accesscontrol" ? "active" : ""
          }`}
        >
          Access Control
        </Link>
      </div>
    </header>
  );
}

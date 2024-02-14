import { Link } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import LogoutButton from "../logout/logout";
import FadeMenu from "../fadeMenu/fadeMenu";
export default function CustomMenu() {
  const [activeItem, setActiveItem] = useState("");
  const userProfile = sessionStorage.getItem("profile");

  useEffect(() => {
    const pathname = location.pathname.substr(1);
    setActiveItem(pathname);
  }, [location.pathname]);

  const isSpecificRoute = location.pathname === "/";

  return (
    <header className="container_menu">
      <div className="container_icon">
        <img src="/src/assets/Logo2.png" width="320" className="soft_icon" />
      </div>
      <div className="navbar">
        {!isSpecificRoute && (
          <>
            <Link
              className={`nav-item ${activeItem === "home" ? "active" : ""}`}
              to={"/home"}
            >
              Setup
            </Link>
            <Link
              to={"/dashboard"}
              className={`nav-item ${
                activeItem === "dashboard" ? "active" : ""
              }`}
            >
              Dashboard
            </Link>
            {userProfile == "IT" && (
              <Link
                to={"/accesscontrol"}
                className={`nav-item ${
                  activeItem === "accesscontrol" ? "active" : ""
                }`}
              >
                Access Control
              </Link>
            )}
            {userProfile == "IT" && (
              <Link
                to={"/reports"}
                className={`nav-item ${
                  activeItem === "reports" ? "active" : ""
                }`}
              >
                Reports
              </Link>
            )}
            {/* <FadeMenu /> */}
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  );
}

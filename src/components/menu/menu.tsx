import { Link } from "react-router-dom"
import "./style.css"
export default function Menu(){
    return(
        <header className="container_menu">
            <div className="container_icon">
                <img src="/src/assets/Logo.jpg" width="180" className="soft_icon" />
            </div>
            <div className="container_nav_menu">
                <nav className="content_nav_menu">
                    <Link className="links_menu" to={"/"}>Setup</Link>
                    <Link className="links_menu" to={"/dashboard"}>Dashboard</Link>
                </nav>
            </div>
        </header>
    )
}
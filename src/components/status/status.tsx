import {AiFillCloseCircle, AiFillCheckCircle} from "react-icons/ai"
import "./style.css"
interface ConfInfo{
    connection: boolean;
    name: string;
    port: string;
}

export default function Status(props:ConfInfo){
    return(
        <li className="status">
            <span className="text_status">{props.name} : {props.port}</span>
            <div className="icon_status">
                {
                    props.connection ? 
                    <AiFillCheckCircle size="20" color="green"/>: 
                    <AiFillCloseCircle size="20" color="red"/> 
                }
            </div>
        </li>
    )
}
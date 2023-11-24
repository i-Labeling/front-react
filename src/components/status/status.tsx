import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import "./style.css";
interface ConfInfo {
  connection: boolean;
  name: string;
  port: string;
}

export default function Status(props: ConfInfo) {
  return (
    <div className="container_box">
      <li className="status">
        <div
          className="container_inf_status"
          style={{ justifyContent: "start" }}
        >
          <span className="text_status">{props.name}</span>
        </div>
        <div className="container_inf_status">
          <span className="text_status">{props.port}</span>
        </div>
        <div className="container_inf_status">
          <div className="icon_status">
            {props.connection ? (
              <AiFillCheckCircle size="30" color="#458975" />
            ) : (
              <AiFillCloseCircle size="30" color="#E8405E" />
            )}
          </div>
        </div>
      </li>
    </div>
  );
}

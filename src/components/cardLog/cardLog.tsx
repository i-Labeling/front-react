import { useState } from "react";
import "./style.css";
interface ConfInf {
  title: string;
  val: string;
  show: boolean;
  style?: object;
}
export default function CardLog(props: ConfInf) {
  const [infOpen, SetInfOpen] = useState(false);
  return (
    <>
      <button
        className="container_card_log"
        onClick={() => SetInfOpen(!infOpen)}
      >
        <div className="container_inf">
          <div className="container_header_card">
            <div>
              <h2 className="title_card">{props.title}</h2>
            </div>
            {props.show ? (
              <div className="container_content_card">
                <p className="val">{props.val}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </button>
      {infOpen ? (
        <div
          className="container_card_inf_log"
          onClick={() => SetInfOpen(!infOpen)}
        >
          <div className="container_box_cord_inf_log">
            <div className="container_title_box_card_inf_log">
              <h1 className="title_box_card_inf_log">{props.title}</h1>
            </div>
            <div className="container_val_box_card_inf_log">
              <p className="val_box_card_inf_log">{props.val}</p>
            </div>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
}

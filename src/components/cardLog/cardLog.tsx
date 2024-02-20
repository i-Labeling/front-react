import { Modal } from "@mui/material";
import OSCard from "../OSCard/OSCard";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import "./style.css";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface ConfInf {
  title: any;
  val: string;
  show: boolean;
  style?: object;
  className?: string;
  titleBackgroundColor?: any;
  contentBackgroundColor?: any;
}

export default function CardLog(props: ConfInf) {
  const [infOpen, SetInfOpen] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    SetInfOpen(false);
  };

  return (
    <>
      <OSCard
        title={props.title}
        content={props.val}
        onClick={() => SetInfOpen(!infOpen)}
        className={props.className}
        titleBackgroundColor={props.titleBackgroundColor}
        contentBackgroundColor={props.contentBackgroundColor}
      />
      {infOpen && (
        <Modal
          open={infOpen}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className={classes.modal}
        >
          <div className="container_box_cord_inf_log">
            <div
              className="container_title_box_card_inf_log"
              style={{ backgroundColor: props.titleBackgroundColor }}
            >
              <h1 className="title_box_card_inf_log">{props.title}</h1>
            </div>
            <div
              className="container_val_box_card_inf_log"
              style={{ backgroundColor: props.contentBackgroundColor }}
            >
              <p className="val_box_card_inf_log">{props.val}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

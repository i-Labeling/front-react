import { Divider, Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import ColorConstants from "../../colors";

interface ModalMemoryProps {
  open?: boolean;
  title?: string;
  list?: any;
  titleBackgroundColor?: any;
  contentBackgroundColor?: any;
  onClose?: () => void;
}

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textItemError: {
    margin: 4,
    fontSize: "28px",
    color: ColorConstants.primary,
  },
}));

const ModalMemory: React.FC<ModalMemoryProps> = (props: ModalMemoryProps) => {
  const classes = useStyles();
  const {
    open,
    title,
    list,
    titleBackgroundColor,
    contentBackgroundColor,
    onClose,
  } = props;

  return (
    <Modal
      open={open ?? false}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modal}
    >
      <div className="container_box_cord_inf_log">
        <div
          className="container_title_box_card_inf_log"
          style={{ backgroundColor: titleBackgroundColor }}
        >
          <h1 className="title_box_card_inf_log">{title}</h1>
        </div>
        <div
          className="container_val_box_card_inf_log"
          style={{
            backgroundColor: contentBackgroundColor,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {props.list != "0" ? (
            <ul
              style={{
                listStyleType: "none",
                padding: "10px",
                margin: "4px 10px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              {title === "Scrap Position and Error Type"
                ? list.map((error: any, index: any) => (
                    <li
                      key={index}
                      style={{
                        marginBottom:
                          index === list.length - 1 ? "10px !important" : 0,
                      }}
                    >
                      <div>
                        <p className={classes.textItemError}>
                          Memory n° {error.memoria}
                        </p>
                        <p className={classes.textItemError}>
                          Coluna: {error.coluna}
                        </p>
                        <p className={classes.textItemError}>
                          Position: {error.position}
                        </p>
                        <p className={classes.textItemError}>
                          Grade: {error.grade}
                        </p>
                      </div>
                      {index !== list.length - 1 && <Divider />}
                    </li>
                  ))
                : list.map((inspection: any, index: any) => (
                    <li
                      key={index}
                      style={{
                        marginBottom:
                          index === list.length - 1 ? "10px !important" : 0,
                      }}
                    >
                      <div>
                        <p className={classes.textItemError}>
                          Memory n° {inspection.memoria}
                        </p>
                        <p className={classes.textItemError}>
                          Error Type: {inspection.errorType}
                        </p>
                      </div>
                      {index !== list.length - 1 && <Divider />}
                    </li>
                  ))}
            </ul>
          ) : (
            <div
              className="container_val_box_card_inf_log"
              style={{ backgroundColor: props.contentBackgroundColor }}
            >
              <p className="val_box_card_inf_log">{props.list}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalMemory;

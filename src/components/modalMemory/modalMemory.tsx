import { Divider, Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import ColorConstants from "../../colors";

interface ModalMemoryProps {
  open?: boolean;
  title?: string;
  list?: string;
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

  console.log('list', list);
  
  

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
          <ul
            style={{
              listStyleType: "none",
              padding: "10px",
              margin: "4px 10px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            {/* {parsedList.map((sublist: any[], index: number) => (
              <li
                key={index}
                style={{
                  marginBottom:
                    index === parsedList.length - 1 ? "10px !important" : 0,
                }}
              >
                <div>
                  <p className={classes.textItemError}>
                    Memory n° {sublist[0]}
                  </p>
                  <p className={classes.textItemError}>
                    Position: {sublist[1]}
                  </p>
                  <p className={classes.textItemError}>
                    Error Type: {sublist[2]}
                  </p>
                </div>
                {index !== parsedList.length - 1 && <Divider />}
              </li>
            ))} */}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ModalMemory;

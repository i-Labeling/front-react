import { Modal } from "@mui/material";
import ModalMemory from "../modalMemory/modalMemory";
import OSCard from "../OSCard/OSCard";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import "./styles.css";

interface ConfInf {
  title: any;
  list: any;
  show: boolean;
  style?: object;
  className?: string;
  titleBackgroundColor?: any;
  contentBackgroundColor?: any;
}

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center !important",
    justifyContent: "center !important",
  },
}));

export default function CardLog(props: ConfInf) {
  const [infOpen, SetInfOpen] = useState(false);
  const [list, setList] = useState<any>([]);
  const classes = useStyles();

  const handleClose = () => {
    SetInfOpen(false);
  };

  useEffect(() => {
    let transformedInspectionErrorList: { memoria: number; errorType: any }[] =
      [];
    let transformedScrapErrorList = [];
    if (props.list != "0") {
      if (props.title === "Scrap Position and Error Type") {
        transformedScrapErrorList = props.list.map((item: any) => {
          const cleanedStr = item.replace(/['\s]/g, "");

          const parts = cleanedStr
            .split("|")
            .map((part: string) => part.split(":"));

          return {
            memoria: parseInt(parts[0][1], 10),
            coluna: parseInt(parts[1][1].split("-")[0], 10),
            position: parseInt(parts[1][1].slice(0, -1), 10),
            grade: parts[1][2].slice(0, -1).replace(")", ""),
          };
        });
        setList(transformedScrapErrorList);
      } else if (props.title === "Inspection Error Counter") {
        transformedInspectionErrorList = props.list.map((str: any) => {
          const match = str.match(/memoria: (\d+) (.+)/);
          const memoria = match ? match[1] : "";
          const errorType = match ? match[2].replace(/['\]]/g, "") : "";
          return {
            memoria: memoria,
            errorType: errorType,
          };
        });
        setList(transformedInspectionErrorList);
      }
    } else {
      setList("0");
    }
  }, [props.title, props.list]);

  return (
    <>
      <OSCard
        title={props.title}
        content={list === "0" ? "0" : String(list.length)}
        onClick={() => SetInfOpen(!infOpen)}
        className={props.className}
        titleBackgroundColor={props.titleBackgroundColor}
        contentBackgroundColor={props.contentBackgroundColor}
      />
      {infOpen && list.length > 0 && list != "0" ? (
        <ModalMemory
          open={infOpen}
          title={props.title}
          list={list}
          titleBackgroundColor={props.titleBackgroundColor}
          contentBackgroundColor={props.contentBackgroundColor}
          onClose={handleClose}
        />
      ) : (
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
              <p className="val_box_card_inf_log">{list}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

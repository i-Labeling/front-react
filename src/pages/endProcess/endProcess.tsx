import CardLog from "../../components/cardLog/cardLog";
import Menu from "../../components/customMenu/customMenu";
import { IoFileTrayOutline } from "react-icons/io5";
import { BsRepeat } from "react-icons/bs";
import { AiOutlineFieldTime, AiOutlineCamera } from "react-icons/ai";
import { FaFileLines, FaMagnifyingGlass } from "react-icons/fa6";
import { BiError, BiSolidMemoryCard, BiMap } from "react-icons/bi";
import "./style.css";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/instanceAxios";
import OSCard from "../../components/OSCard/OSCard";
import Title from "../../components/textTitle/textTitle";
import BackButton from "../../components/backButton/backButton";

interface infProcess {
  tray: string;
  totalCycleTime: string;
  minutesPerTray: string;
  timePerMemory: string;
  creamBelowA: string;
  inspectionErrors: string;
  cameraError: string;
  indexMemoryError: string;
  positionAndError: string;
  order: string;
}
export default function EndProcess() {
  const [infProccess, setInfProccess] = useState<infProcess>({
    tray: "0",
    totalCycleTime: "0",
    minutesPerTray: "0",
    timePerMemory: "0",
    creamBelowA: "0",
    inspectionErrors: "0",
    cameraError: "0",
    indexMemoryError: "0",
    positionAndError: "0",
    order: "0",
  });
  const tray = <IoFileTrayOutline size="30" color="white" />;
  const cycle = <BsRepeat size="30" color="white" />;
  const time = <AiOutlineFieldTime size="30" color="white" />;
  const note = <FaFileLines size="30" color="white" />;
  const error = <BiError size="30" color="white" />;
  const memory = <BiSolidMemoryCard size="30" color="white" />;
  const camera = <AiOutlineCamera size="30" color="white" />;
  const glass = <FaMagnifyingGlass size="30" color="white" />;
  const map = <BiMap size="30" color="white" />;
  const styleCard = {
    fontSize: "15px",
    justifyContent: "start",
    alignItems: "start",
  };
  const getVal = async () => {
    await axiosInstance
      .get("/")
      .then((res) => {
        console.log("att aqui");
        setInfProccess(res.data);
      })
      .catch((res) => console.log(res));
  };
  useEffect(() => {
    getVal();
  }, []);
  return (
    <>
      <Menu />
      <div className="backButton">
        <BackButton />
      </div>
      <Title title="End of Process" className="title" />
      <main className="container_page_endProcess">
        <div className="container_page_title_endProcess">
          <OSCard
            title="Order of Service"
            content={
              infProccess.order !== "0"
                ? infProccess.order
                : "2023-10-31 10:43:40.018339"
            }
          />
        </div>
        <div className="container_cards_horizontal">
          <CardLog
            title="Tray"
            val={infProccess.tray}
            show={true}
            className="cardLog"
            titleBackgroundColor={"#4443CE"}
          />
          <CardLog
            title="Total Cycle Time"
            val={infProccess.totalCycleTime + " s"}
            show={true}
            className="cardLog"
            titleBackgroundColor={"#4443CE"}
          />
          <CardLog
            title="Time per Tray (min)"
            val={infProccess.minutesPerTray + " min"}
            show={true}
            className="cardLog"
            titleBackgroundColor={"#4443CE"}
          />
          <CardLog
            title="Scrap Position and Error Type"
            val={infProccess.positionAndError}
            style={styleCard}
            show={false}
            className="cardLog"
            titleBackgroundColor={"#E8405E"}
          />
          <CardLog
            title="Inspection Error Counter"
            val={infProccess.inspectionErrors}
            show={true}
            className="cardLog"
            titleBackgroundColor={"#E8405E"}
          />
          <CardLog
            title="Camera Error Counter"
            val={infProccess.cameraError}
            show={true}
            className="cardLog"
            titleBackgroundColor={"#E8405E"}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <CardLog
              title="Seconds by Memory"
              val={infProccess.timePerMemory + " s"}
              show={true}
              className="cardLog"
              titleBackgroundColor={"#4443CE"}
            />
            <CardLog
              title="Grade Below A Counter"
              val={infProccess.creamBelowA}
              show={true}
              className="cardLog"
              titleBackgroundColor={"#4443CE"}
            />
          </div>
        </div>
      </main>
    </>
  );
}

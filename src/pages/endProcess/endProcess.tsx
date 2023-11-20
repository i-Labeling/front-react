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
      <main className="container_page_endProcess">
        <div className="container_page_title_endProcess">
          <h1>Order of Service : {infProccess.order} - End of Process</h1>
        </div>
        <div className="container_cards_horizontal">
          <CardLog
            icon={tray}
            title="Tray"
            val={infProccess.tray}
            show={true}
          />
          <CardLog
            icon={cycle}
            title="Total Cycle Time"
            val={infProccess.totalCycleTime + " s"}
            show={true}
          />
          <CardLog
            icon={time}
            title="Time in Minutes per Tray"
            val={infProccess.minutesPerTray + " min"}
            show={true}
          />
          <CardLog
            icon={memory}
            title="Seconds by Memory"
            val={infProccess.timePerMemory + " s"}
            show={true}
          />
          <CardLog
            icon={note}
            title="Memories with a Grade Below A"
            val={infProccess.creamBelowA}
            show={true}
          />
          <CardLog
            icon={glass}
            title="Memories with Inspection Error"
            val={infProccess.inspectionErrors}
            show={true}
          />
          <CardLog
            icon={camera}
            title="Camera Error Number"
            val={infProccess.cameraError}
            show={true}
          />
          <CardLog
            icon={error}
            title="Error Memory (Index)"
            val={infProccess.indexMemoryError}
            style={styleCard}
            show={true}
          />
          <CardLog
            icon={map}
            title="Scrap Position and Error Type"
            val={infProccess.positionAndError}
            style={styleCard}
            show={false}
          />
        </div>
      </main>
    </>
  );
}

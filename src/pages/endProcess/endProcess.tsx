import CardLog from "../../components/cardLog/cardLog";
import Menu from "../../components/customMenu/customMenu";
import "./style.css";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/instanceAxios";
import OSCard from "../../components/OSCard/OSCard";
import Title from "../../components/textTitle/textTitle";
import BackButton from "../../components/backButton/backButton";
import { useNavigate } from "react-router-dom";
import CardLogList from "../../components/cardLogList/cardLogList";

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
  const navigate = useNavigate();

  const styleCard = {
    fontSize: "15px",
    justifyContent: "start",
    alignItems: "start",
  };
  const getVal = async () => {
    await axiosInstance
      .get("/")
      .then((res) => {
        console.log("att aqui", res.data);
        setInfProccess(res.data);
      })
      .catch((res) => console.log(res));
  };
  useEffect(() => {
    getVal();
  }, []);

  const mockedListScrapError = [
    "['memoria: 21 | coluna 2-pos: 1(grade: VAZIO)'",
    " 'memoria: 22 | coluna 2-pos: 2(grade: VAZIO)'",
    " 'memoria: 25 | coluna 2-pos: 3(grade: VAZIO)'",
    " 'memoria: 26 | coluna 2-pos: 4(grade: VAZIO)'",
    " 'memoria: 64 | coluna 2-pos: 5(grade: VAZIO)']",
  ];

  const mockedListInspectionError = [
    "['memoria: 21 VAZIO'",
    " 'memoria: 22 VAZIO'",
    " 'memoria: 25 VAZIO'",
    " 'memoria: 26 VAZIO'",
    " 'memoria: 64 VAZIO']",
  ];

  return (
    <>
      <Menu />
      <div className="backButton">
        <BackButton onClick={() => navigate("/home")} />
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
          <CardLogList
            title="Scrap Position and Error Type"
            list={mockedListScrapError ?? 0}
            style={styleCard}
            show={false}
            className="cardLog"
            titleBackgroundColor={"#E8405E"}
          />
          <CardLogList
            title="Inspection Error Counter"
            list={mockedListInspectionError}
            show={true}
            className="cardLog"
            titleBackgroundColor={"#E8405E"}
          />
          <CardLog
            title="Camera Error Counter"
            val={infProccess.cameraError ?? 0}
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

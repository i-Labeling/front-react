import { useState, useEffect } from "react";
import Menu from "../../components/customMenu/customMenu";
import "./style.css";
import BackButton from "../../components/backButton/backButton";
import CardLogItem from "../../components/cardLogItem/cardLogItem";
import ImageModal from "../../components/imageModal/imageModal";
interface Log {
  inspection?: string;
  validateLabel?: string;
  leaveMemory?: string;
  errorMemory?: string;
  takeMemory?: string;
  path?: string;
  finish?: string;
}

export default function LogsInfo() {
  const [logs, setLog] = useState<Array<Log>>([]);
  const [open, setOpenModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // const mockLogs: Log[] = [
  //   { inspection: "Inspection 16" },
  //   { validateLabel: "Validate label" },
  //   { leaveMemory: "Leave memory" },
  //   { errorMemory: "Error memory" },
  //   { takeMemory: "Take Memory - n\u00ba: 1" },
  //   { path: "/public/img_inspection/sodimm_16-01-2024_11-54-50.jpg" },
  //   { finish: "finished" },
  //   { inspection: "Inspection 2" },
  //   { validateLabel: "Validate label" },
  //   { leaveMemory: "Leave memory" },
  //   { errorMemory: "Error memory" },
  //   { takeMemory: "Take Memory - n\u00ba: 2" },
  //   { path: "https://example.com/image2.pn" },
  //   { finish: "finished" },
  //   { inspection: "Inspection 3" },
  //   { validateLabel: "Validate label" },
  //   { leaveMemory: "Leave memory" },
  //   { errorMemory: "Error memory" },
  //   { takeMemory: "Take Memory - n\u00ba: 3" },
  //   { path: "https://example.com/image3.png" },
  //   { finish: "finished" },
  //   { inspection: "Inspection 6" },
  //   { validateLabel: "Validate label" },
  //   { leaveMemory: "Leave memory" },
  //   { errorMemory: "Error memory" },
  //   { takeMemory: "Take Memory - n\u00ba: 6" },
  //   { path: "https://example.com/image3.png" },
  //   { finish: "finished" },
  // ];

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:5000/sse/log");
    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      const transformedData = [];
      let currentMemory = {};

      parsedData.forEach((item: {}) => {
        if ("finish" in item) {
          if (Object.keys(currentMemory).length > 0) {
            transformedData.push(currentMemory);
            currentMemory = {};
          }
        } else {
          currentMemory = { ...currentMemory, ...item };
        }
      });

      if (Object.keys(currentMemory).length > 0) {
        transformedData.push(currentMemory);
      }

      if (JSON.stringify(transformedData) !== JSON.stringify(logs)) {
        setLog(transformedData);
      }
    };
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };

    //MOCK TEST
    // const transformedData = [];
    // let currentMemory = {};

    // mockLogs.forEach((item: {}) => {
    //   if ("finish" in item) {
    //     if (Object.keys(currentMemory).length > 0) {
    //       transformedData.push(currentMemory);
    //       currentMemory = {};
    //     }
    //   } else {
    //     currentMemory = { ...currentMemory, ...item };
    //   }
    // });

    // if (Object.keys(currentMemory).length > 0) {
    //   transformedData.push(currentMemory);
    // }

    // if (JSON.stringify(transformedData) !== JSON.stringify(logs)) {
    //   setLog(transformedData);
    // }
  }, [logs]);

  return (
    <>
      <Menu />
      <main className="container_page_logs">
        <div className="back_button_container">
          <BackButton />
        </div>
        <div className="title_container">
          <h1 className="title_page_logs">Log Information</h1>
        </div>
        <div style={{ marginRight: "3%" }}>
          <ul className="container_logs">
            {logs &&
              logs.map((log, index) => (
                <div key={index} className="logs-card-container">
                  <CardLogItem
                    log={log}
                    index={index}
                    onClick={() => {
                      setImageUrl(log.path ? log.path : "");
                      setOpenModal(true);
                    }}
                  />
                </div>
              ))}
          </ul>
        </div>
        <ImageModal
          open={open}
          onClose={() => setOpenModal(false)}
          src={imageUrl}
        />
      </main>
    </>
  );
}

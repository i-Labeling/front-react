import { useState, useEffect } from "react";
import Menu from "../../components/customMenu/customMenu";
import "./style.css";
import BackButton from "../../components/backButton/backButton";
import CardLogItem from "../../components/cardLogItem/cardLogItem";
import ImageModal from "../../components/imageModal/imageModal";
interface Log {
  inspection: string;
  labeling: string;
  validateLabel: string;
  leaveMemory: string;
  errorMemory: string;
  takeMemory: string;
  path: string;
}
interface Val {
  key: [];
}
export default function LogsInfo() {
  const [logs, setLog] = useState<Array<Log>>([]);
  const [val, setVal] = useState<Val[]>([]);
  const [open, setOpenModal] = useState<boolean>(false);
  const [url, setImageUrl] = useState<string>("");
  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:5000/sse/log");
    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setLog(parsedData);
    };
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  // Mock data for logs (replace this with your own test data)
  // const mockLogs: Log[] = [
  //   {
  //     inspection: "Inspection",
  //     labeling: "Labeling",
  //     validateLabel: "Validate label",
  //     leaveMemory: "Leave memory",
  //     errorMemory: "Error memory",
  //     takeMemory: "Take memory",
  //     path: "https://example.com/image1.png",
  //   },
  //   {
  //     inspection: "Inspection",
  //     labeling: "Labeling",
  //     validateLabel: "Validate label",
  //     leaveMemory: "Leave memory",
  //     errorMemory: "Error memory",
  //     takeMemory: "Take memory",
  //     path: "https://example.com/image2.png",
  //   },
  //   {
  //     inspection: "Inspection",
  //     labeling: "Labeling",
  //     validateLabel: "Validate label",
  //     leaveMemory: "Leave memory",
  //     errorMemory: "Error memory",
  //     takeMemory: "Take memory",
  //     path: "https://example.com/image3.png",
  //   },
  // ];

  // useEffect(() => {
  //   // Set the logs to the mock data
  //   setLog(mockLogs);
  // }, []);

  // useEffect(() => {
  //   // Set the logs to the mock data
  //   console.log("url", url);
  // }, [url]);

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
            {logs.map((log, index) => (
              <div key={index} className="logs-card-container">
                <CardLogItem
                  log={log}
                  index={index}
                  onClick={() => {
                    setImageUrl(log.path);
                    setOpenModal(true);
                  }}
                />
              </div>
            ))}
          </ul>
        </div>
        <ImageModal open={open} onClose={() => setOpenModal(false)} src={url} />
      </main>
    </>
  );
}

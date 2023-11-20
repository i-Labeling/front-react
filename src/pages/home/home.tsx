import Menu from "../../components/customMenu/customMenu";
import "./style.css";
import { useState, useEffect } from "react";
import Status from "../../components/status/status";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/loading/loading";
import BasicButton from "../../components/basiclButton/basicButton";

interface StatusDevice {
  connection: boolean;
  name: string;
  port: string;
}
interface StatusProcessI {
  log: string;
  idProcess: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [statusDevice, setStatusDevice] = useState<Array<StatusDevice>>([]);
  const [statusProcess, setStatusProcess] = useState<StatusProcessI>({
    log: "",
    idProcess: "waiting",
  });
  useEffect(() => {
    const eventSource = new EventSource(
      "http://127.0.0.1:5000/sse/statusDevice"
    );
    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setStatusDevice(parsedData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);
  useEffect(() => {
    const eventSource = new EventSource(
      "http://127.0.0.1:5000/sse/statusProcess"
    );
    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setStatusProcess(parsedData);
    };
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const toNavigate = () => {
    navigate("/conf");
  };
  return (
    <>
      <Menu />
      <main className="container_page">
        <div className="container_box_status">
          <div className="container_menu_box_status">
            <h1>i-Labeling</h1>
          </div>
          <div className="content_box_status">
            <ul className="list_status">
              {statusDevice.map((statusResponse, index) => (
                <Status
                  key={index}
                  connection={statusResponse.connection}
                  name={statusResponse.name}
                  port={statusResponse.port}
                />
              ))}
            </ul>
            <div
              className="container_status_process"
              style={{
                backgroundColor:
                  statusProcess.idProcess === "processing"
                    ? "rgb(255, 238, 178)"
                    : statusProcess.idProcess === "error"
                    ? "rgb(255, 178, 178)"
                    : statusProcess.idProcess === "succefull"
                    ? "rgb(188, 255, 178)"
                    : "rgb(255,255,255)",
              }}
            >
              {statusProcess.idProcess !== "waiting" ? (
                <div className="content_status_process">
                  <div className="container_first_informations">
                    <p className="status_process">{statusProcess.log}</p>
                  </div>
                  <div className="container_second_informations">
                    <Link to="/logs" className="links_process">
                      Process Logs
                    </Link>
                    {statusProcess.idProcess === "succefull" ||
                    statusProcess.idProcess === "error" ? (
                      <Link to="/end" className="links_process">
                        End of Process
                      </Link>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : (
                <div className="container_idle">
                  <p className="text_idle">Waiting...</p>
                  <Loading />
                </div>
              )}
            </div>
          </div>
          <div className="container_btn_setup">
            <BasicButton text="Init Setup" functionButton={toNavigate} />
          </div>
        </div>
      </main>
    </>
  );
}

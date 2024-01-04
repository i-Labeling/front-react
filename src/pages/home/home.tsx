import Menu from "../../components/customMenu/customMenu";
import "./style.css";
import { useState, useEffect } from "react";
import Status from "../../components/status/status";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/loading";
import SimpleButton from "../../components/simpleButton/simpleButton";
import { Card } from "@mui/material";
import axiosInstance from "../../services/instanceAxios";

interface StatusDevice {
  connection: boolean;
  name: string;
  port: string;
}
interface StatusProcessI {
  log: string;
  idProcess: string;
}

interface UserAuthIHM {
  token: any;
  profile: any;
}

interface User {
  token: any;
  profile: any;
}

export default function Home() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("jwtToken");
  const [statusDevice, setStatusDevice] = useState<Array<StatusDevice>>([]);
  const [statusProcess, setStatusProcess] = useState<StatusProcessI>({
    log: "",
    idProcess: "waiting",
  });

  // Implement state variable to user auth IHM
  const [userAuthIHM, setUserAuthIHM] = useState<UserAuthIHM>();
  const [user, setUser] = useState<User>();

  // Mock SSE event to simulate status updates
  // const mockStatusUpdate = (processStatus: StatusProcessI) => {
  //   setStatusProcess(processStatus);
  // };

  // const generateMockDevices = () => {
  //   const mockDevices: Array<StatusDevice> = [
  //     { connection: true, name: "Device 1", port: "192.168.1.100" },
  //     { connection: false, name: "Device 2", port: "192.168.1.101" },
  //   ];
  //   setStatusDevice(mockDevices);
  // };

  // useEffect(() => {
  //   // Simulating initial device population
  //   generateMockDevices();
  //   mockStatusUpdate({
  //     log: "",
  //     idProcess: "processing",
  //   });
  // }, []);

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

  //Implementing user token IHM
  useEffect(() => {
    const eventSource = new EventSource(
      "http://127.0.0.1:5000/sse/userAuthIHM"
    );

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setUserAuthIHM(parsedData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, [userAuthIHM]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getUserIdByToken = async (token: any) => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/userTokenIHM", {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ token: token }),
      });

      let user = { token: token, profile: "-1" };

      if (response.ok) {
        user = await response.json();
        setUser(user);
      }

      return user;
    } catch (e) {
      console.error("Failed to getting user", e);
      return { token: token, profile: "-1" };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserIdByToken(userAuthIHM?.token);

        await axiosInstance
          .post("post", {
            token: user?.token,
            profile: user?.profile,
          })
          .then((res) => {
            console.log("Posting profile information", res);
          })
          .catch((error: any) => {
            console.error("Error on token ihm verification", error);
          });
      } catch (error) {
        console.error("Error on token ihm verification", error);
      }
    };

    if (userAuthIHM) {
      fetchData();
    }
  }, [userAuthIHM]);

  const toNavigate = () => {
    navigate("/conf");
  };

  const handleProcessLogsClick = () => {
    navigate("/logs");
  };

  const handleEndOfProcessClick = () => {
    navigate("/end");
  };

  return (
    <>
      <Menu />
      <main className="container_page">
        <Card className="container_box_status">
          <div className="container_menu_box_status">
            <h1 style={{ color: " #4443ce" }}>Status</h1>
          </div>
          <div className="container_info_status">
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
                      : statusProcess.idProcess === "waiting"
                      ? "#F3F3FF"
                      : statusProcess.idProcess === "error"
                      ? "rgb(255, 178, 178)"
                      : statusProcess.idProcess === "succefull"
                      ? "#B3FAC3"
                      : "rgb(255,255,255)",
                }}
              >
                {statusProcess.idProcess !== "waiting" ? (
                  <div className="content_status_process">
                    <h5 style={{ color: " #4443ce" }}>Setup</h5>

                    {statusProcess.log && (
                      <div className="container_first_informations">
                        <p className="status_process">{statusProcess.log}</p>
                      </div>
                    )}
                    <div className="container_second_informations">
                      <SimpleButton
                        title="Process Logs"
                        onClick={handleProcessLogsClick}
                      />
                      {statusProcess.idProcess === "succefull" ||
                      statusProcess.idProcess === "error" ? (
                        <>
                          <span style={{ margin: "0 10px" }}></span>
                          <SimpleButton
                            title="End of Process"
                            onClick={handleEndOfProcessClick}
                          />
                        </>
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
          </div>
          <div className="container_btn_setup">
            <SimpleButton
              title="Init Setup"
              onClick={toNavigate}
              personalisedStyle={"buttonInitSetup"}
            />
          </div>
        </Card>
      </main>
    </>
  );
}

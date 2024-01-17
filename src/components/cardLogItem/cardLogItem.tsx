import { Card } from "@mui/material";
import React from "react";
import "./styles.css";

interface CardLogItemProps {
  log: any;
  index: any;
  onClick: () => void;
}

const CardLogItem: React.FC<CardLogItemProps> = ({ log, index, onClick }) => {
  console.log("LOG INFO", log);
  return (
    <>
      <Card style={{ backgroundColor: "#F3F3FF" }}>
        <>
          <div style={{ marginBottom: "20px" }}>
            <div className="title-log-container">
              <h3 className="title-log">Memory n°{index + 1}</h3>
            </div>
            {log.takeMemory != "" && (
              <p className="content_logs" key={index + ".1"}>
                - {log.takeMemory}
              </p>
            )}
            <hr className="divider" />
            {log.inspection != "" && (
              <p className="content_logs" key={index + ".2"}>
                - {log.inspection}
              </p>
            )}
            <hr className="divider" />
            <div className="image-container">
              {log.path != "" && (
                <>
                  <img src="src/assets/placaIcon.png" className="image" />
                  <p>
                    <a
                      href="#"
                      className="content_logs_image"
                      key={index + ".3"}
                      onClick={onClick}
                      style={{
                        marginBottom: "10%",
                      }}
                    >
                      Open Image
                    </a>
                  </p>
                </>
              )}
            </div>
            <hr className="divider" />
            {log.validateLabel != "" && (
              <p className="content_logs" key={index + ".5"}>
                - {log.validateLabel}
              </p>
            )}
            <hr className="divider" />
            {log.leaveMemory != "" && (
              <p className="content_logs" key={index + ".7"}>
                - {log.leaveMemory}
              </p>
            )}
            <hr className="divider" />
            {log.errorMemory != "" && (
              <p className="content_logs" key={index + ".6"}>
                - {log.errorMemory}
              </p>
            )}
          </div>
        </>
      </Card>
    </>
  );
};

export default CardLogItem;

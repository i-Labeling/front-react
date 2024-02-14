import React, { useState } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import Title from "../../components/textTitle/textTitle";
import { useStyles } from "./styles.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material";
import TextSnippet from "@mui/icons-material/TextSnippet";
import Assignment from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";

const ReportsPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [isHoveredGeneral, setIsHoveredGeneral] = useState(false);
  const [isFocusedGeneral, setIsFocusedGeneral] = useState(false);
  const [isFocusedFiltered, setIsFocusedFiltered] = useState(false);
  const [isHoveredFiltered, setIsHoveredFiltered] = useState(false);

  const handleFilteredClick = () => {
    navigate("/filtered-report");
  };

  const handleGeneralClick = () => {
    navigate("/general-os-report");
  };

  return (
    <>
      <Menu />
      <CardGeneral>
        <div className={classes.header}>
          <div className={classes.titleContainer}>
            <Title title="Report Settings" className={classes.title} />
          </div>
        </div>
        <div className={classes.container}>
          <div
            className={classes.containerReportOption}
            onMouseEnter={() => setIsHoveredFiltered(true)}
            onMouseLeave={() => setIsHoveredFiltered(false)}
            onFocus={() => setIsFocusedFiltered(true)}
            onBlur={() => setIsFocusedFiltered(false)}
            onClick={handleFilteredClick}
          >
            <TextSnippet
              className={classes.icon}
              style={{
                color:
                  isHoveredFiltered || isFocusedFiltered
                    ? "white"
                    : "rgb(64, 64, 216)",
                fontWeight: 700,
              }}
            />
            <Typography
              className={classes.text}
              style={{
                color:
                  isHoveredFiltered || isFocusedFiltered
                    ? "white"
                    : "rgb(64, 64, 216)",
                fontWeight: 700,
              }}
            >
              Filtered Report
            </Typography>
          </div>
          <div style={{ marginRight: "15%" }}></div>
          <div
            className={classes.containerReportOption}
            onMouseEnter={() => setIsHoveredGeneral(true)}
            onMouseLeave={() => setIsHoveredGeneral(false)}
            onFocus={() => setIsFocusedGeneral(true)}
            onBlur={() => setIsFocusedGeneral(false)}
            onClick={handleGeneralClick}
          >
            <Assignment
              className={classes.icon}
              style={{
                color:
                  isHoveredGeneral || isFocusedGeneral
                    ? "white"
                    : "rgb(64, 64, 216)",
                fontWeight: 700,
              }}
            />
            <Typography
              className={classes.text}
              style={{
                color:
                  isHoveredGeneral || isFocusedGeneral
                    ? "white"
                    : "rgb(64, 64, 216)",
                fontWeight: 700,
              }}
            >
              General OS Report
            </Typography>
          </div>
        </div>
        <ToastContainer />
      </CardGeneral>
    </>
  );
};

export default ReportsPage;

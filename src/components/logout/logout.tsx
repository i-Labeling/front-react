import React from "react";
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  backButton: {
    marginBottom: "10px",
  },
});

const LogoutButton: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <IconButton
        className={classes.backButton}
        onClick={handleBack}
        aria-label="back"
      >
        <ArrowBackIcon style={{ width: "40px", height: "40px" }} />
      </IconButton>
    </>
  );
};

export default LogoutButton;

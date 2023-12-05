import React from "react";
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userStateContext";

const useStyles = makeStyles({
  backButton: {
    marginBottom: "10px",
  },
  icon: {
    fontSize: "40px",
    backgroundColor: "white",
    color: "rgb(64, 64, 216)",
  },
});

const LogoutButton: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { clearUserData } = useUser();

  const handleBack = () => {
    clearUserData();
    navigate("/");
  };

  return (
    <>
      <IconButton
        className={classes.backButton}
        onClick={handleBack}
        aria-label="back"
      >
        <ExitToAppIcon className={classes.icon} />
      </IconButton>
    </>
  );
};

export default LogoutButton;

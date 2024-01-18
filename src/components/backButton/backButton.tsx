import React from "react";
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import ColorConstants from "../../colors";

const useStyles = makeStyles({
  backButton: {
    display: "inline-block",
    backgroundColor: "#F3F3FF",
    borderRadius: "10px",
    padding: "5px",
  },
});

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = (props: BackButtonProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={classes.backButton}
      onClick={props.onClick ? props.onClick : handleBack}
      aria-label="back"
    >
      <IconButton
        onClick={props.onClick ? props.onClick : handleBack}
        aria-label="back"
      >
        <ArrowBackIosNewIcon
          style={{
            width: "40px",
            height: "40px",
            color: ColorConstants.primary,
          }}
        />
      </IconButton>
    </div>
  );
};

export default BackButton;

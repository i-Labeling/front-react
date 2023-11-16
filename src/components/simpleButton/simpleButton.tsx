import { Button } from "@mui/material";
import React from "react";
import ColorConstants from "../../colors";
import { makeStyles } from "@mui/styles";

interface SimpleButtonProps {
  title: string;
  personalisedStyle?: any;
  onClick: () => void;
  disabled?: boolean;
}

const useStyles = makeStyles({
  button: {
    position: "relative",
    "&:disabled": {
      "&::before": {
        content: '""',
        backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      },
    },
  },
});

const SimpleButton: React.FC<SimpleButtonProps> = (
  props: SimpleButtonProps
) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      style={{
        backgroundColor: ColorConstants.primary,
        textTransform: "none",
        fontSize: "18px",
      }}
      className={`${props.personalisedStyle} ${classes.button}`}
      onClick={props.onClick}
      disabled={props.disabled}
      sx={{}}
    >
      {props.title}
    </Button>
  );
};

export default SimpleButton;

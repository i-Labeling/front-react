import { Button } from "@mui/material";
import React from "react";
import ColorConstants from "../../colors";

interface SimpleButtonProps {
  title: string;
  personalisedStyle?: any;
  onClick: () => void;
}

const SimpleButton: React.FC<SimpleButtonProps> = (
  props: SimpleButtonProps
) => {
  return (
    <Button
      variant="contained"
      style={{
        backgroundColor: ColorConstants.primary,
        textTransform: "none",
        fontSize: "18px",
      }}
      className={props.personalisedStyle}
      onClick={props.onClick}
    >
      Access
    </Button>
  );
};

export default SimpleButton;

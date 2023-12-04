import { Typography } from "@mui/material";
import React from "react";
import ColorConstants from "../../colors";

interface TextTitleProps {
  title: string;
  className?: string;
}

const Title: React.FC<TextTitleProps> = (props: TextTitleProps) => {
  return (
    <Typography
      style={{
        color: ColorConstants.primary,
        display: "flex",
        justifyContent: "center",
        fontFamily: "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
        fontWeight: 700,
      }}
      className={props.className}
    >
      {props.title}
    </Typography>
  );
};

export default Title;

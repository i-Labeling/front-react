import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";

interface EndProcessCardProps {
  title?: string;
  content?: string;
  titleBackgroundColor?: any;
  contentBackgroundColor?: any;
  onClick?: () => void;
  className?: string;
}

const OSCard: React.FC<EndProcessCardProps> = (props: EndProcessCardProps) => {
  const {
    title,
    content,
    titleBackgroundColor,
    contentBackgroundColor,
    onClick,
    className,
  } = props;

  return (
    <div onClick={onClick} className={className}>
      <Card sx={{ width: "100%", height: "100%", backgroundColor: "#F3F3FF" }}>
        <CardHeader
          title={title}
          sx={{
            backgroundColor: titleBackgroundColor
              ? titleBackgroundColor
              : "#B8B8B8",
            color: "white",
            textAlign: "center",
            fontFamily:
              "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
            borderRadius: "10px",
            "& .MuiCardHeader-title": {
              fontWeight: "700 !important",
            },
            "& .MuiCardHeader": {
              padding: "8px !important ",
            },
          }}
        />
        <CardContent
          sx={{
            backgroundColor: contentBackgroundColor
              ? contentBackgroundColor
              : "#F3F3FF",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#343397",
              fontFamily:
                "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
            }}
          >
            {content}
          </h1>
        </CardContent>
      </Card>
    </div>
  );
};

export default OSCard;

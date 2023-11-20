import { Card } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ReactNode } from "react";

interface CardGeneralProps {
  children: ReactNode;
}

const useStyles = makeStyles({
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
  },
  card: {
    backgroundColor: "#e0e0e0",
    minWidth: "60%",
    height: "fit-content",
    minHeight: "50vh",
    borderRadius: "40px !important",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 50,
  },
});

const CardGeneral: React.FC<CardGeneralProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.cardContainer}>
      <Card className={classes.card}>{children}</Card>
    </div>
  );
};

export default CardGeneral;

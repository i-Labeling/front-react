import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  title: {
    fontSize: "28px !important",
  },
  tokenCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableHeadCell: {
    backgroundColor: "rgb(64, 64, 216)",
    color: "aliceblue !important",
    fontWeight: "bold !important",
    fontFamily: "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
    fontSize: "20px !important",
  },
  tableContainer: {
    maxHeight: "400px", // Set your desired max height here
    overflowY: "auto",
    marginBottom: "30px",
  },
  tableHead: {
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tableBodyCell: {
    color: "#4443CE !important",
    fontWeight: "bold !important",
    fontFamily: "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
    fontSize: "16px !important",
  },
  button: {
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: 40,
  },
});

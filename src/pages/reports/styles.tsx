import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  button: {
    width: "100%",
  },
  title: {
    fontSize: "28px !important",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  backButtonContainer: {
    marginRight: "20px",
  },
  select: {
    width: "100% !important",
    marginRight: "0px !important",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  containerReportOption: {
    width: "200px",
    borderRadius: 10,
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "rgb(64, 64, 216)",
      color: "white !important",
    },
    "&:focus": {
      backgroundColor: "rgb(64, 64, 216)",
      color: "white !important",
    },
  },
  icon: {
    fontSize: "200px !important",
    display: "flex",
    justifyContent: "center",
  },
  text: {
    display: "flex",
    justifyContent: "center",
    fontWeight: "700 !important",
  },
});

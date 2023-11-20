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
});

import React from "react";
import Menu from "../../components/menu/menu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 100,
  },
  button: {
    width: "100%",
  },
});

const Login: React.FC = () => {
  const classes = useStyles();

  const handleClick = () => {
    console.log("CLICKED");
  };

  const handleTextFieldChange = (value: string, identifier: string) => {
    console.log(`Updated value for ${identifier}:`, value);
  };

  return (
    <>
      <Menu />
      <CardGeneral>
        <BasicTextField
          label="Email"
          placeholder="Email"
          onChange={(value) => handleTextFieldChange(value, "email")}
        />
        <div style={{ paddingTop: 20 }}></div>
        <BasicTextField
          label="Password"
          placeholder="Password"
          onChange={(value) => handleTextFieldChange(value, "password")}
        />
        <div className={classes.buttonContainer}>
          <SimpleButton
            title="Access"
            personalisedStyle={classes.button}
            onClick={handleClick}
          />
        </div>
      </CardGeneral>
    </>
  );
};

export default Login;

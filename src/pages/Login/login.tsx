import React, { useState } from "react";
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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  //TO DO: This is a way to take the values and send them to a request
  //I've created an identifier to filter each change
  const handleTextFieldChange = (value: string, identifier: string) => {
    setFormData({
      ...formData,
      [identifier]: value,
    });
  };

  // Checking if all required fields are filled
  React.useEffect(() => {
    const allFieldsFilled = formData.email !== "" && formData.password !== "";

    setButtonDisabled(!allFieldsFilled);
  }, [formData]);

  //TO DO: Create a function to get on the database the user by his email
  const getUserByEmail = () => {
    //This function in the final will return a boolean saying if the user exists and it's correct
    //Save this email information related to the id to use it on the editUser after
  };

  //TO DO: Implement the function to do a request (get) of the information on the data base
  const handleClick = () => {
    console.log("CLICKED");
  };

  return (
    <>
      <Menu />
      <CardGeneral>
        <BasicTextField
          label="Email"
          placeholder="Email"
          onChange={(value) => handleTextFieldChange(value, "email")}
          type="email"
          required
        />
        <div style={{ paddingTop: 20 }}></div>
        <BasicTextField
          label="Password"
          placeholder="Password"
          onChange={(value) => handleTextFieldChange(value, "password")}
          type="password"
          required
        />
        <div className={classes.buttonContainer}>
          <SimpleButton
            title="Access"
            personalisedStyle={classes.button}
            onClick={handleClick}
            disabled={buttonDisabled}
          />
        </div>
      </CardGeneral>
    </>
  );
};

export default Login;

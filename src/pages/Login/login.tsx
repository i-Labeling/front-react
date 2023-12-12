import React, { useState, useEffect } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import { makeStyles } from "@mui/styles";
import { useUser } from "../../contexts/userStateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleTextFieldChange = (value: string, identifier: string) => {
    setFormData({
      ...formData,
      [identifier]: value,
    });
  };

  useEffect(() => {
    const allFieldsFilled = formData.email !== "" && formData.password !== "";
    setButtonDisabled(!allFieldsFilled);
  }, [formData]);

  const handleClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/login", {
        method: "POST",
        body: JSON.stringify({
          login: formData.email,
          senha: formData.password,
        }),
      });

      if (response.ok) {
        const user = await response.json();

        localStorage.setItem("jwtToken", user.token);
        sessionStorage.setItem("profile", user.profile);

        const dataObject = new Date();
        const data = dataObject.toLocaleDateString();
        const timeLogged = dataObject.toLocaleTimeString();

        setUser({
          email: formData.email,
          timeLogged: `${data} ${timeLogged}`,
          token: user.token,
        });

        navigate("/home");
      } else {
        toast.error("User not found! Verify your email or password.");
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
    }
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

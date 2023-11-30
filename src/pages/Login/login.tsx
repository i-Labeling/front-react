import React, { useState, useEffect } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import { makeStyles } from "@mui/styles";
import { useUser } from "../../contexts/userStateContext";
import { Navigate, useNavigate } from "react-router-dom";

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
        method: "POST", // Alterado para POST
        body: JSON.stringify({
          login: formData.email,
          senha: formData.password,
        }),
      });

      if (response.ok) {
        const { token } = await response.json();

        // Aqui você pode decidir o que fazer com o token.
        // No exemplo, armazenamos o token no localStorage.
        localStorage.setItem("jwtToken", token);

        const dataObject = new Date();
        const data = dataObject.toLocaleDateString();
        const timeLogged = dataObject.toLocaleTimeString();

        console.log("token login", token);
        // Após a autenticação bem-sucedida, você pode definir o usuário usando setUser.
        setUser({
          email: formData.email,
          timeLogged: `${data} ${timeLogged}`,
          token: token,
        });

        // Redirecione ou execute outras ações necessárias após o login.
        navigate("/home");
      } else {
        console.error("Falha no login");
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
    }
  };

  useEffect(() => {
    console.log("token login user", user.token);
  }, [user]);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

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

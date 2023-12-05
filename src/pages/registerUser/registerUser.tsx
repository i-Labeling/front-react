import React, { useState } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import Title from "../../components/textTitle/textTitle";
import CustomSelect from "../../components/select/customSelect";
import BackButton from "../../components/backButton/backButton";
import { useStyles } from "./styles";
import { useUser } from "../../contexts/userStateContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterUser: React.FC = () => {
  const classes = useStyles();
  const { user } = useUser();
  const [token, setToken] = useState<string>("123321");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    accessType: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (value: string, identifier: string) => {
    let errorMessage = "";

    if (identifier === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = "Incorrect email format";
      }
    } else if (identifier === "password") {
      if (value.length < 8) {
        errorMessage = "Incorrect password format: less than 8 characters";
      }
    } else if (
      identifier === "confirmPassword" &&
      value.length < 8 &&
      formData.password !== "" &&
      formData.confirmPassword !== ""
    ) {
      const passwordsMatch = formData.password === formData.confirmPassword;
      if (!passwordsMatch) {
        errorMessage = "Passwords do not match";
      } else {
        errorMessage = "";
      }
    }

    setErrors({ ...errors, [identifier]: errorMessage });
  };

  const handleTextFieldChange = (value: string, identifier: string) => {
    setFormData({
      ...formData,
      [identifier]: value,
    });
    validateField(value, identifier);
  };

  React.useEffect(() => {
    const allFieldsFilled =
      Object.values(formData).every((field) => field !== "") &&
      Object.values(errors).every((error) => error === "");

    setButtonDisabled(!allFieldsFilled);
  }, [formData]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  };

  const handleClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/cadastro", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          login: formData.email,
          senha: formData.password,
          profile: formData.accessType,
          token: token,
        }),
      });

      if (response.ok) {
        toast.success("User successfully created!");
        navigate("/accesscontrol");
      } else if (response.status === 409) {
        toast.error("User already exists! Try another login name.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
    }
  };

  const menuItems = [
    { value: "ADMIN", label: "Manager" },
    { value: "OPERATOR", label: "Operator" },
    { value: "IT", label: "Maintenance" },
  ];

  return (
    <>
      <Menu />
      <CardGeneral>
        <div className={classes.header}>
          <div className={classes.backButtonContainer}>
            <BackButton />
          </div>
          <div className={classes.titleContainer}>
            <Title title="Register User" className={classes.title} />
          </div>
        </div>
        <BasicTextField
          label="Email"
          placeholder="Email"
          onChange={(value) => handleTextFieldChange(value, "email")}
          type="email"
          error={!!errors.email}
          errorMessage={errors.email}
          required
        />
        <CustomSelect
          label="Access type"
          listItems={menuItems}
          onChange={(value) => handleTextFieldChange(value, "accessType")}
        />
        <BasicTextField
          label="Password"
          placeholder="Password"
          onChange={(value) => handleTextFieldChange(value, "password")}
          type="password"
          error={!!errors.password}
          errorMessage={errors.password}
          required
        />
        <BasicTextField
          label="Confirm Password"
          placeholder="Confirm Password"
          onChange={(value) => handleTextFieldChange(value, "confirmPassword")}
          type="password"
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          required
        />
        <div className={classes.buttonContainer}>
          <SimpleButton
            title="Save"
            personalisedStyle={classes.button}
            onClick={handleClick}
            disabled={buttonDisabled}
          />
        </div>
        <ToastContainer />
      </CardGeneral>
    </>
  );
};

export default RegisterUser;

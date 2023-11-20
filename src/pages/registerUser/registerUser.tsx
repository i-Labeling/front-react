import React, { useState } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import Title from "../../components/textTitle/textTitle";
import CustomSelect from "../../components/select/customSelect";
import BackButton from "../../components/backButton/backButton";
import { useStyles } from "./styles";

const RegisterUser: React.FC = () => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
    accessType: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({
    id: "",
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
    } else if (identifier === "id") {
      const numberRegex = /^[0-9][A-Za-z0-9 -]*$/;
      if (!numberRegex.test(value)) {
        errorMessage = "Just numbers allowed";
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

  //TO DO: This is a way to take the values and send them to a request
  //I've created an identifier to filter each change and updating the FormData
  const handleTextFieldChange = (value: string, identifier: string) => {
    setFormData({
      ...formData,
      [identifier]: value,
    });
    validateField(value, identifier);
  };

  // Checking if all required fields are filled
  React.useEffect(() => {
    const allFieldsFilled =
      Object.values(formData).every((field) => field !== "") &&
      Object.values(errors).every((error) => error === "");

    setButtonDisabled(!allFieldsFilled);
    console.log("formData", formData);
    console.log("fields", !allFieldsFilled);
  }, [formData]);

  //TO DO: Implement the function to do a request (post) of the information do the data base
  const handleClick = () => {
    console.log("CLICKED");
  };

  const menuItems = [
    { value: "manager", label: "Manager" },
    { value: "operator", label: "Operator" },
    { value: "maintenance", label: "Maintenance" },
  ];

  //TO DO: Create a function to save on the database the user by his id
  const saveUser = () => {
    //This function will save a new user
  };

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
          label="ID"
          placeholder="ID"
          onChange={(value) => handleTextFieldChange(value, "id")}
          type="custom"
          error={!!errors.id}
          errorMessage={errors.id}
          required
        />
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
      </CardGeneral>
    </>
  );
};

export default RegisterUser;

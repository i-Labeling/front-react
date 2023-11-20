import React, { useState } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import { makeStyles } from "@mui/styles";
import Title from "../../components/textTitle/textTitle";
import CustomSelect from "../../components/select/customSelect";
import BackButton from "../../components/backButton/backButton";

const useStyles = makeStyles({
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

const EditUser: React.FC = () => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
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

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     //   try {
  //     //     const userData = await getUserById(formData.id); // Fetch user data
  //     //     setFormData({
  //     //       ...formData,
  //     //       email: userData.email || "",
  //     //       accessType: userData.accessType || "",
  //     //       // Update other fields as required
  //     //     });
  //     //   } catch (error) {
  //     //     console.error("Error fetching user data:", error);
  //     //   }
  //   };

  //   // Fetch user data when any form data changes
  //   fetchUser();
  // }, [formData]);

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

  //TO DO: Create a function to get on the database the user by his id
  const getUserById = () => {
    //This function in the final will return the entire object of the user information
  };

  const updateUserById = () => {
    //This function should take the new values on the form data and update it
  };

  const menuItems = [
    { value: "manager", label: "Manager" },
    { value: "operator", label: "Operator" },
    { value: "maintenance", label: "Maintenance" },
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
            <Title title="Edit User" className={classes.title} />
          </div>
        </div>
        <BasicTextField
          label="Email"
          value={formData.email}
          placeholder="Email"
          onChange={(value) => handleTextFieldChange(value, "email")}
          type="email"
          error={!!errors.email}
          errorMessage={errors.email}
          required
        />
        <CustomSelect
          listItems={menuItems}
          value={formData.accessType}
          onChange={(value) => handleTextFieldChange(value, "accessType")}
        />
        <BasicTextField
          label="Password"
          placeholder="Password"
          value={formData.password}
          onChange={(value) => handleTextFieldChange(value, "password")}
          type="password"
          error={!!errors.password}
          errorMessage={errors.password}
          required
        />
        <BasicTextField
          label="Confirm Password"
          value={formData.confirmPassword}
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

export default EditUser;

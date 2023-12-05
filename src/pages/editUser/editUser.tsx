import React, { useEffect, useState } from "react";
import Menu from "../../components/customMenu/customMenu";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import { makeStyles } from "@mui/styles";
import Title from "../../components/textTitle/textTitle";
import CustomSelect from "../../components/select/customSelect";
import BackButton from "../../components/backButton/backButton";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [user, setUser] = useState<any>();
  const [profile, setProfile] = useState<any>();
  const navigate = useNavigate();

  const userToken = localStorage.getItem("jwtToken");

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/user/usuarios", {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ id: id && parseInt(id, 10) }),
        });
        if (response.ok) {
          const user = await response.json();
          setUser(user);
          toast.success("User successfully edited!");
          switch (user[0].profile) {
            case 1:
              setProfile("IT");
              break;
            case 2:
              setProfile("OPERATOR");
              break;
            case 3:
              setProfile("ADMIN");
              break;
            default:
              break;
          }
        }
      } catch (e) {
        console.error("Failed to getting user", e);
      }
    };

    fetchUser();
  }, []);

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
      Object.entries(formData).every(([key, value]) => {
        if (key === "email" || key === "accessType") {
          return true;
        }
        return value !== "";
      }) && Object.values(errors).every((error) => error === "");

    setButtonDisabled(!allFieldsFilled);
    console.log("formData", formData);
    console.log("fields", !allFieldsFilled);
  }, [formData]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const handleClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5002/user/update", {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          id: user[0].id,
          login: formData.email === "" ? user[0].login : formData.email,
          senha: formData.password === "" ? user[0].senha : formData.password,
          profile: formData.accessType === "" ? profile : formData.accessType,
        }),
      });

      if (response.ok) {
        navigate("/accesscontrol");
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
            <Title title="Edit User" className={classes.title} />
          </div>
        </div>
        {user && (
          <>
            <BasicTextField
              label="Email"
              value={user[0]?.login}
              placeholder="Email"
              onChange={(value) => handleTextFieldChange(value, "email")}
              type="email"
              error={!!errors.email}
              errorMessage={errors.email}
              required
            />
            <CustomSelect
              listItems={menuItems}
              initialSelection={profile}
              value={user[0]?.profile}
              onChange={(value) => handleTextFieldChange(value, "accessType")}
              label={"Edit user"}
            />
            <BasicTextField
              label="Password"
              placeholder="Password"
              value={user[0]?.senha}
              onChange={(value) => handleTextFieldChange(value, "password")}
              type="password"
              error={!!errors.password}
              errorMessage={errors.password}
              required
            />
            <BasicTextField
              label="Confirm Password"
              value={user[0]?.senha}
              placeholder="Confirm Password"
              onChange={(value) =>
                handleTextFieldChange(value, "confirmPassword")
              }
              type="password"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              required
            />
          </>
        )}
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

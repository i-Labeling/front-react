import { TextField } from "@mui/material";
import React, { useState } from "react";
import ColorConstants from "../../colors";

interface BasicTextFieldProps {
  label: string;
  placeholder: string;
  personalizedStyle?: any;
  onChange: (value: string) => void;
}

const BasicTextField: React.FC<BasicTextFieldProps> = (
  props: BasicTextFieldProps
) => {
  const [inputValue, setInputValue] = useState("");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    props.onChange(value);
  };

  return (
    <TextField
      id="outlined-basic"
      label={props.label}
      variant="outlined"
      placeholder={props.placeholder}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: ColorConstants.primary,
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: ColorConstants.primary,
        },
      }}
      value={inputValue}
      onChange={handleOnChange}
    />
  );
};

export default BasicTextField;

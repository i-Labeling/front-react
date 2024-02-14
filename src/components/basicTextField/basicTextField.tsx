import { TextField } from "@mui/material";
import React, { useState } from "react";
import ColorConstants from "../../colors";

interface BasicTextFieldProps {
  label?: string;
  placeholder: string;
  className?: any;
  value?: string;
  error?: boolean;
  errorMessage?: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

const BasicTextField: React.FC<BasicTextFieldProps> = ({
  label,
  placeholder,
  className,
  value,
  error,
  onChange,
  errorMessage,
  type,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    onChange(value);
  };

  return (
    <TextField
      className={className}
      label={label}
      variant="outlined"
      error={error}
      placeholder={placeholder}
      helperText={error && errorMessage}
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
      type={type}
      required={required}
    />
  );
};

export default BasicTextField;

import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ColorConstants from "../../colors";

interface CustomSelectProps {
  label: string;
  listItems: { value: any; label: string }[];
  value?: any;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = (
  props: CustomSelectProps
) => {
  const [selection, setSelection] = React.useState("udimm");

  const handleChange = (event: SelectChangeEvent) => {
    setSelection(event.target.value as string);
    props.onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel
        id="demo-simple-select-label"
        sx={{
          "&.Mui-focused": {
            color: `${ColorConstants.primary} !important`,
          },
        }}
      >
        {props.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={props.value}
        value={selection}
        label="Access Type"
        onChange={handleChange}
        variant="outlined"
        required
        sx={{
          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: `${ColorConstants.primary} !important`,
            },
        }}
      >
        {props.listItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;

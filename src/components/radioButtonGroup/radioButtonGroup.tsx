import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

interface RadioGroupProps {
  onChange: (value: string) => void;
}

const useStyles = makeStyles({
  formControl: {
    border: "1px solid rgb(64, 64, 216) !important",
    borderRadius: "5px !important",
    padding: "5px !important",
  },
  radioButton: {
    "&.Mui-checked": {
      color: "rgb(64, 64, 216) !important",
    },
  },
});

const RadioButtonGroup: React.FC<RadioGroupProps> = (
  props: RadioGroupProps
) => {
  const classes = useStyles();
  const [value, setValue] = React.useState("AllInspections");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setValue(value);
    props.onChange(value);
  };
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <FormLabel id="demo-row-radio-buttons-group-label">
        Inspection Mode
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel
          value="AllInspections"
          control={<Radio className={classes.radioButton} />}
          label="All Inspections"
        />
        <FormControlLabel
          value="GridInspection"
          control={<Radio className={classes.radioButton} />}
          label="Grid Inspection"
        />
        <FormControlLabel
          value="IgnoreInspection"
          control={<Radio className={classes.radioButton} />}
          label="Ignore Inspection"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;

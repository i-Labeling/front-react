import { Autocomplete, Paper, TextField } from "@mui/material";
import { useMemo, useState } from "react";
interface InfConf {
  label?: string;
  vals: any[];
  filterGet: any;
  setFilterGet: any;
  filterField: any;
  className?: string;
  style?: any;
  disabled?: boolean;
  onChange?: any;
}

const CustomPaper = (props: any) => {
  return <Paper {...props} className={`${props.className}`} />;
};

export default function SelectSetup(props: InfConf) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [focused, setFocused] = useState(false);

  const options = useMemo(
    () => props.vals.map((val: any) => val.name),
    [props.vals]
  );

  return (
    <>
      <Autocomplete
        disabled={props.disabled}
        id="auto-complete"
        PaperComponent={CustomPaper}
        style={props.style}
        openOnFocus
        disableClearable
        options={options}
        value={selectedValue}
        onChange={(e, newValue) => {
          props.setFilterGet(() => ({
            ...props.filterGet,
            [props.filterField]: [newValue],
          }));
          setSelectedValue(newValue);
          setFocused(true);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              style: {
                color: focused ? "rgb(64, 64, 216)" : "#808080",
              },
            }}
            label={props.label}
          />
        )}
      />
    </>
  );
}

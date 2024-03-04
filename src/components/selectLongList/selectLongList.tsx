import { Autocomplete, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface InfConf {
  label?: string;
  vals: any[];
  filterGet: any;
  setFilterGet: any;
  filterField: any;
  className?: string;
  style?:any;
}

const CustomPaper = (props: any) => {
  return <Paper {...props} className={`${props.className}`}/>;
};

export default function SelectLongList(props: InfConf) {
  const [selectedValue, setSelectedValue] = useState("All");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (selectedValue === "All") {
      props.setFilterGet((prevFilter: any) => ({
        ...prevFilter,
        [props.filterField]: [selectedValue],
      }));
    }
  }, []);

  return (
    <>
      <Autocomplete
        id="auto-complete"
        PaperComponent={CustomPaper}
        style={props.style}
        openOnFocus
        options={["All", ...props.vals.map((val: any) => val.name)]}
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

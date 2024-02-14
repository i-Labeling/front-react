import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./style.css";
import { useEffect, useState } from "react";
interface InfConf {
  label?: string;
  vals: any[];
  filterGet: any;
  setFilterGet: any;
  filterField: any;
  className?: string;
}
export default function SelectDashboard(props: InfConf) {
  const [selectedValue, setSelectedValue] = useState("All");

  useEffect(() => {
    if (selectedValue === "All") {
      props.setFilterGet((prevFilter: any) => ({
        ...prevFilter,
        [props.filterField]: [selectedValue],
      }));
    }
  }, []);

  return (
    <FormControl>
      <InputLabel htmlFor="itens" className="label_select_dashboard">
        {props.label}
      </InputLabel>
      <Select
        className={`${props.className} input_select_dashboard`}
        id="itens"
        name="itens"
        value={selectedValue}
        onChange={(e) => {
          const selected = e.target.value;
          props.setFilterGet(() => ({
            ...props.filterGet,
            [props.filterField]: [selected],
          }));
          setSelectedValue(selected);
        }}
      >
        <MenuItem value="All" className="select_dashboard">
          All
        </MenuItem>
        {props.vals.map((val: any, index: any) => (
          <MenuItem key={index} value={val.name} className="select_dashboard">
            {val.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

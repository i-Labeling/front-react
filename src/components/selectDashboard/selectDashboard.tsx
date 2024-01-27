import { MenuItem, Select } from "@mui/material";
import "./style.css";
import { useEffect, useState } from "react";
interface InfConf {
  vals: any[];
  filterGet: any;
  setFilterGet: any;
  filterField: any;
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
    <>
      <Select
        className="input_select_dashboard"
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
    </>
  );
}

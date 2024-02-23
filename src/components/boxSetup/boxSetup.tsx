import { useState, useEffect } from "react";
import "./style.css";
import CheckIcon from "@mui/icons-material/Check";
//import axios from "axios";

interface InfConf {
  setupInf: {};
  setSetupInf: any;
}
interface Costumer {
  name: string;
  PN_Smart: string;
  PN_Cliente: string;
}
export default function BoxSetup(props: InfConf) {
  const [infs, setInfs] = useState<Costumer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>("");

  const checkIconStyle = {
    position: "absolute" as "absolute",
    right: "10px",
    fontSize: "24px",
  };

  //To mock the list of Costumers
  useEffect(() => {
    // setInfs(mockCostumers);
    if (infs.length > 0 && selectedCustomer === "") {
      setSelectedCustomer(infs[0].name);
      props.setSetupInf((e: any) => ({
        ...props.setupInf,
        customer: infs[0],
      }));
    }
  }, [props]);

  const userToken = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getCostumers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/costumer", {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const usersNames = await response.json();
        setInfs(usersNames);
        if (usersNames.length > 0 && selectedCustomer === "") {
          setSelectedCustomer(usersNames[0].name);
          props.setSetupInf((e: any) => ({
            ...props.setupInf,
            customer: usersNames[0],
          }));
        }
      }
    } catch (error) {
      console.error("Errors in getting kpis:", error);
    }
  };

  useEffect(() => {
    getCostumers();
    //getTestCostumers();
  }, []);

  const handleItemClick = (name: any) => {
    setSelectedCustomer(name);
    console.log("name", name);
    props.setSetupInf((e: any) => ({
      ...props.setupInf,
      customer: name,
    }));
  };

  const getItemStyle = (name: any) => {
    return {
      display: "flex",
      alignItems: "center",
      backgroundColor:
        selectedCustomer === name ? "rgb(64, 64, 216)" : "#F3F3FF",
      minHeight: "35px",
      color: selectedCustomer === name ? "white" : "rgb(64, 64, 216)",
      fontSize: "22px",
      fontFamily: "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
      fontWeight: 700,
      margin: "5px",
      border: "1px solid transparent",
      borderRadius: "6px",
      position: "relative" as "relative",
    };
  };

  return (
    <div className="container_inf_setup">
      <div
        className="customer-list-container"
        style={{ height: infs.length > 0 ? "195px" : "100px" }}
      >
        {!(infs.length > 0) && <h4 className="title_no_list">iLabeling</h4>}
        <ul className="customer-list">
          {infs.map((inf, index) => (
            <div key={index} style={{ margin: 5 }}>
              <li
                key={index}
                className={`inf ${
                  selectedCustomer === inf.name ? "selected" : ""
                }`}
                onClick={() => handleItemClick(inf.name)}
                style={getItemStyle(inf.name)}
              >
                <div
                  style={{ marginLeft: "10px" }}
                >{`${inf.name}-${inf.PN_Smart}-${inf.PN_Cliente}`}</div>
                {selectedCustomer === inf.name && (
                  <CheckIcon style={checkIconStyle} />
                )}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

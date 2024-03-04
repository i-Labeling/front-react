import { useNavigate } from "react-router-dom";
import Menu from "../../components/customMenu/customMenu";
import "./style.css";
import { useState, useEffect } from "react";
import RadioButtonGroup from "../../components/radioButtonGroup/radioButtonGroup";
import { useGlobalState } from "../../contexts/globalStateContext";
import axiosInstance from "../../services/instanceAxios";
import { Card } from "@mui/material";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import CustomSelect from "../../components/select/customSelect";
import SelectLongList from "../../components/selectLongList/selectLongList";
interface Costumer {
  name: string;
  PN_Smart: string;
  PN_Cliente: string;
}

export default function confSetup() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("jwtToken");
  const { setupInf, setSetupInf } = useGlobalState();
  const [errors, setErrors] = useState({
    orderOfService: "",
    qtdMemories: "",
    memoryType: "",
  });

  const typeMemoryList = [
    { value: "udimm", label: "UDIMM" },
    { value: "sodimm", label: "SODIMM" },
  ];

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [inspectionModeNumber, setInspectionModeNumber] = useState<number>(1);
  const [infs, setInfs] = useState<Costumer[]>([]);
  const [selectedPN, setSelectedPN] = useState<any>();
  const [selectedCostumer, setSelectedCostumer] = useState<any>();
  const [selectCostumerList, setSelectedCostumerList] = useState<any>([]);
  const [selectedPNClient, setSelectedPNClient] = useState<any>();
  const [selectPNClientList, setSelectedPNClientList] = useState<any>([]);

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
        console.log("lista", usersNames);
      }
    } catch (error) {
      console.error("Errors in getting kpis:", error);
    }
  };

  const getCostumersByPNSmart = (lista: any[]) => {
    if (selectedPN?.PN_Smart) {
      const selectedPNString = selectedPN.PN_Smart[0]
        .replace(/[\[\]]/g, "")
        .trim();
      const uniqueCostumers = lista.filter(
        (inf: any) => inf.PN_Smart === selectedPNString
      );
      const uniqueSet = new Set(uniqueCostumers.map((inf: any) => inf.name));
      const uniqueCostumersList = Array.from(uniqueSet).map((name) => ({
        name,
      }));

      setSelectedCostumerList(uniqueCostumersList);
    }
  };

  const getPNClientByCostumer = (lista: any[]) => {
    if (selectedPN?.name && selectedPN?.PN_Smart) {
      const selectedCostumerString = selectedPN.name[0]
        .replace(/[\[\]]/g, "")
        .trim();
      const selectedPNString = selectedPN.PN_Smart[0]
        .replace(/[\[\]]/g, "")
        .trim();

      const pn_client_list = lista.filter(
        (inf: any) =>
          inf.name === selectedCostumerString &&
          inf.PN_Smart === selectedPNString
      );

      setSelectedPNClientList(pn_client_list);
    }
  };

  useEffect(() => {
    if (selectedPN) {
      getCostumersByPNSmart(infs);
    }
    console.log("selected PN", selectedPN);
  }, [selectedPN]);

  useEffect(() => {
    if (selectedPN) {
      getPNClientByCostumer(infs);
    }
    console.log("selected PN client", selectedPNClient);
  }, [selectedCostumer]);

  useEffect(() => {
    getCostumers();
  }, []);

  useEffect(() => {
    const allFieldsFilled =
      setupInf.serviceOrder !== "null" &&
      setupInf.serviceOrder !== "" &&
      setupInf.amauntMemory !== "null" &&
      setupInf.amauntMemory !== "" &&
      setupInf.customer !== "1" &&
      setupInf.customer !== "" &&
      setupInf.typeMemory !== "null" &&
      setupInf.typeMemory !== "";
    Object.values(errors).every((error) => error === "");

    setButtonDisabled(!allFieldsFilled);
  }, [setupInf, errors]);

  const createSetup = async () => {
    await axiosInstance
      .post("post", {
        customer: setupInf.customer,
        serviceOrder: setupInf.serviceOrder,
        amauntMemory: setupInf.amauntMemory,
        typeMemory: setupInf.typeMemory,
        inspectionMode: setupInf.inspectionMode,
        gridList: setupInf.gridList,
      })
      .then(async (res) => {
        console.log("Success post info data", res);
        try {
          const response = await fetch(
            "http://127.0.0.1:5002/user/actionslogs",
            {
              method: "POST",
              headers: headers,
              body: JSON.stringify({ OSnumber: setupInf.serviceOrder }),
            }
          );

          if (response.ok) {
            console.log("Success on saving new OS action");
          }
        } catch (e) {
          console.error("Failed to save OS action", e);
        }

        navigate("/home");
      })
      .catch((res) =>
        console.log("Error post infos OS: " + res + " " + setupInf)
      );
  };

  const handleClick = async () => {
    console.log(inspectionModeNumber);
    switch (inspectionModeNumber) {
      case 1:
        createSetup();
        break;
      case 2:
        navigate("/gridinspection");
        break;
      case 3:
        createSetup();
        break;
      default:
        break;
    }
  };

  const validateField = (value: string, identifier: string) => {
    let errorMessage = "";

    if (identifier === "serviceOrder" || identifier === "amauntMemory") {
      const numberRegex = /^[0-9][A-Za-z0-9 -]*$/;
      if (!numberRegex.test(value)) {
        errorMessage = "Just numbers allowed";
      }
    }
    setErrors({ ...errors, [identifier]: errorMessage });
  };

  const handleTextFieldChange = (value: string, identifier: string) => {
    setSetupInf({
      ...setupInf,
      [identifier]: value,
    });
    validateField(value, identifier);

    if (identifier === "serviceOrder") {
      setSelectedPN("");
    }
  };

  const uniquePNs = Array.from(new Set(infs.map((inf) => inf.PN_Smart)));

  useEffect(() => {
    console.log(setupInf);
  }, [setupInf]);

  useEffect(() => {
    setSetupInf((prevSetupInf) => ({
      ...prevSetupInf,
      inspectionMode: inspectionModeNumber,
      typeMemory: setupInf.typeMemory,
      serviceOrder: setupInf.serviceOrder,
    }));
  }, [inspectionModeNumber, setupInf.typeMemory, setupInf.serviceOrder]);

  const handleRadioGroupChange = (value: string) => {
    switch (value) {
      case "GridInspection":
        setInspectionModeNumber(2);
        break;
      case "IgnoreInspection":
        setInspectionModeNumber(3);
        break;
      default:
        setInspectionModeNumber(1);
    }
  };

  return (
    <>
      <Menu />
      <main className="container_page_setup">
        <Card className="container_box_conf">
          <div className="container_menu_box_status">
            <h1 style={{ color: "rgb(64, 64, 216)" }}>Setup</h1>
          </div>
          <SelectLongList
            label="PN Smart"
            vals={uniquePNs.map((pn) => ({ name: pn }))}
            filterGet={selectedPN}
            setFilterGet={setSelectedPN}
            filterField="PN_Smart"
          />
          <div style={{ marginBottom: "20px" }}></div>
          <SelectLongList
            label="Costumers"
            vals={selectCostumerList.map((inf: any) => ({ name: inf.name }))}
            filterGet={selectedCostumer}
            setFilterGet={setSelectedCostumer}
            filterField="name"
          />
          <div style={{ marginBottom: "20px" }}></div>
          <SelectLongList
            label="PN Client"
            vals={selectPNClientList.map((inf: any) => ({
              name: inf.PN_Cliente,
            }))}
            filterGet={selectedPNClient}
            setFilterGet={setSelectedPNClient}
            filterField="PN_Cliente"
          />
          <div style={{ marginBottom: "20px" }}></div>
          <form action="" className="container_form_setup">
            <BasicTextField
              label="Order of Service"
              placeholder="Order of Service"
              className="text_field_size"
              onChange={(value) => handleTextFieldChange(value, "serviceOrder")}
              type="custom"
              error={!!errors.orderOfService}
              errorMessage={errors.orderOfService}
              required
            />
            <div style={{ marginRight: "20px" }}></div>
            <BasicTextField
              className="text_field_size"
              label="Quantity of Memories"
              placeholder="Quantity of Memories"
              onChange={(value) => handleTextFieldChange(value, "amauntMemory")}
              type="custom"
              error={!!errors.orderOfService}
              errorMessage={errors.orderOfService}
              required
            />
            <div style={{ marginRight: "20px" }}></div>
            <CustomSelect
              label="Memory type"
              listItems={typeMemoryList}
              onChange={(value) => handleTextFieldChange(value, "typeMemory")}
              required
            />
          </form>
          <RadioButtonGroup
            onChange={(value) => handleRadioGroupChange(value)}
          />
          <div className="container_btn_setup">
            <SimpleButton
              title="Confirm"
              onClick={handleClick}
              personalisedStyle={"buttonInitSetup"}
              disabled={buttonDisabled}
            />
          </div>
        </Card>
      </main>
    </>
  );
}

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
import SelectSetup from "../../components/selectSetup/selectSetup";
import { toast } from "react-toastify";
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

  useEffect(() => {
    const clearAllFields = () => {
      setSelectedPN(null);
      setSelectedCostumer(null);
      setSelectedPNClient(null);
      setSetupInf({
        customer: "1",
        serviceOrder: "null",
        amauntMemory: "null",
        typeMemory: "",
        inspectionMode: 1,
        gridList: [],
      });
    };
    return () => {
      clearAllFields();
    };
  }, []);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [inspectionModeNumber, setInspectionModeNumber] = useState<number>(1);
  const [infs, setInfs] = useState<Costumer[]>([]);
  const [selectedPN, setSelectedPN] = useState<any>(null);
  const [selectedCostumer, setSelectedCostumer] = useState<any>(null);
  const [selectCostumerList, setSelectedCostumerList] = useState<any>([]);
  const [selectedPNClient, setSelectedPNClient] = useState<any>(null);
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
      }
    } catch (error) {
      console.error("Errors in getting kpis:", error);
    }
  };

  const getCostumersByPNSmart = (lista: any[]) => {
    if (selectedPN?.PN_Smart) {
      const selectedPNString = selectedPN.PN_Smart[0]
        ?.replace(/[\[\]]/g, "")
        .trim();
      if (selectedPNString) {
        const uniqueCostumers = lista.filter(
          (inf: any) => inf.PN_Smart === selectedPNString
        );
        const uniqueSet = new Set(uniqueCostumers.map((inf: any) => inf.name));
        const uniqueCostumersList = Array.from(uniqueSet).map((name) => ({
          name,
        }));
        setSelectedCostumerList(uniqueCostumersList);
      } else {
        setSelectedCostumerList([]);
      }
    }
  };

  useEffect(() => {
    if (selectedPN?.PN_Smart[0] != null) {
      getCostumersByPNSmart(infs);
    }
  }, [selectedPN?.PN_Smart[0]]);

  const getPNClientsByCostumer = (lista: any[]) => {
    if (
      selectedCostumer &&
      selectedCostumer.name[0] &&
      selectedPN &&
      selectedPN?.PN_Smart[0]
    ) {
      const selectedCostumerName = selectedCostumer.name[0].trim();
      const selectedPNName = selectedPN.PN_Smart[0].trim();
      if (selectedCostumerName && selectedPNName) {
        const filteredPNClients = lista.filter(
          (inf: any) =>
            inf.name === selectedCostumerName && inf.PN_Smart === selectedPNName
        );
        setSelectedPNClientList(filteredPNClients);
      } else {
        setSelectedPNClientList([]);
      }
    }
  };

  useEffect(() => {
    getPNClientsByCostumer(infs);
  }, [selectedCostumer]);

  useEffect(() => {
    if (selectedPN && selectedCostumer && selectedPNClient) {
      const customer = {
        name: selectedCostumer.name[0],
        PN_Smart: selectedPN.PN_Smart[0],
        PN_Cliente: selectedPNClient.PN_Cliente[0],
      };
      setSetupInf((prevSetupInf: any) => ({
        ...prevSetupInf,
        customer: customer,
      }));
    }
  }, [selectedPN, selectedCostumer, selectedPNClient]);

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

    const { customer } = setupInf;
    const anyValueNull = Object.values(customer).some((value: any) => {
      return value === null;
    });
    const allErrorsEmpty = Object.values(errors).every((error) => error === "");
    setButtonDisabled(!(allFieldsFilled && !anyValueNull && allErrorsEmpty));
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

  const verifyCombination = (customer: any, pn_smart: any, pn_client: any) => {
    const foundCustomer = infs.find(
      (inf) =>
        inf.name === customer.name[0] &&
        inf.PN_Smart === pn_smart.PN_Smart[0] &&
        inf.PN_Cliente === pn_client.PN_Cliente[0]
    );

    if (foundCustomer) {
      switch (inspectionModeNumber) {
        case 1:
        case 3:
          createSetup();
          break;
        case 2:
          navigate("/gridinspection");
          break;
        default:
          break;
      }
    } else {
      toast.error(
        "Select the right combination of PN_SMART, Costumer and PN_Client!"
      );
    }
  };

  const handleClick = async () => {
    console.log(inspectionModeNumber);
    verifyCombination(selectedCostumer, selectedPN, selectedPNClient);
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
  };

  const uniquePNs = Array.from(new Set(infs.map((inf) => inf.PN_Smart)));

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

  useEffect(() => {
    if (selectedPN?.PN_Smart[0] != null) {
      toast.warn(
        "Make sure to change all the selected values: PN_Smart, Costumer and PN_Client!"
      );
    }
  }, [selectedPN?.PN_Smart[0]]);

  return (
    <>
      <Menu />
      <main className="container_page_setup">
        <Card className="container_box_conf">
          <div className="container_menu_box_status">
            <h1 style={{ color: "rgb(64, 64, 216)" }}>Setup</h1>
          </div>
          <SelectSetup
            label="PN Smart"
            vals={uniquePNs.map((pn) => ({ name: pn }))}
            filterGet={selectedPN}
            setFilterGet={setSelectedPN}
            filterField="PN_Smart"
            style={{ width: "90%" }}
          />
          <div style={{ marginBottom: "20px" }}></div>
          <SelectSetup
            label="Costumers"
            vals={selectCostumerList.map((inf: any) => ({ name: inf.name }))}
            filterGet={selectedCostumer}
            setFilterGet={setSelectedCostumer}
            filterField="name"
            style={{ width: "90%" }}
            disabled={!selectedPN}
          />
          <div style={{ marginBottom: "20px" }}></div>
          <SelectSetup
            label="PN Client"
            vals={selectPNClientList.map((inf: any) => ({
              name: inf.PN_Cliente,
            }))}
            filterGet={selectedPNClient}
            setFilterGet={setSelectedPNClient}
            filterField="PN_Cliente"
            style={{ width: "90%" }}
            disabled={!selectedCostumer}
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

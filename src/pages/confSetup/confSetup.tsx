import { useNavigate } from "react-router-dom";
import BasicButton from "../../components/basiclButton/basicButton";
import BoxSetup from "../../components/boxSetup/boxSetup";
import Menu from "../../components/menu/menu";
import "./style.css";
import { useState, useEffect } from "react";
import RadioButtonGroup from "../../components/radioButtonGroup/radioButtonGroup";
import { useGlobalState } from "../../contexts/globalStateContext";
import axiosInstance from "../../services/instanceAxios";

export default function confSetup() {
  const styleBtn = {
    margin: "20px",
    width: "40%",
  };
  const navigate = useNavigate();
  const { setupInf, setSetupInf } = useGlobalState();

  const [inspectionModeNumber, setInspectionModeNumber] = useState<number>(1);

  const createSetup = async (e: any) => {
    e.preventDefault();
    await axiosInstance
      .post("post", {
        customer: setupInf.customer,
        serviceOrder: setupInf.serviceOrder,
        amauntMemory: setupInf.amauntMemory,
        typeMemory: setupInf.typeMemory,
        inspectionMode: setupInf.inspectionMode,
        gridList: setupInf.gridList,
      })
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((res) => console.log(res + " " + setupInf));
  };

  const handleClick = (value: string) => {
    switch (value) {
      case "GridInspection":
        navigate("/gridinspection");
        break;
      case "AllInspections" || "IgnoreInspection":
        createSetup;
        break;
      default:
        navigate("/gridinspection");
    }
  };

  useEffect(() => {
    console.log(setupInf);
  }, [setupInf]);

  useEffect(() => {
    setSetupInf((prevSetupInf) => ({
      ...prevSetupInf,
      inspectionMode: inspectionModeNumber,
      typeMemory: setupInf.typeMemory,
    }));
  }, [inspectionModeNumber, setupInf.typeMemory]);

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
        <div className="container_box_conf">
          <div className="container_menu_box_status">
            <h1>i-Labeling</h1>
          </div>
          <BoxSetup setSetupInf={setSetupInf} setupInf={setupInf} />

          <form action="" className="container_form_setup">
            <input
              type="text"
              className="input_text_setup"
              id="order"
              name="order_service"
              placeholder="Order of Service"
              onChange={(e) => {
                setSetupInf(() => ({
                  ...setupInf,
                  serviceOrder: e.target.value,
                }));
              }}
            ></input>
            <input
              type="text"
              className="input_text_setup"
              id="quantity"
              name="quantity"
              placeholder="Quantity of Memories"
              onKeyDown={(e) => {
                const charCode = e.charCode;
              }}
              onChange={(e) => {
                setSetupInf(() => ({
                  ...setupInf,
                  amauntMemory: e.target.value,
                }));
              }}
            ></input>
            <select
              className="input_select_setup"
              id="memory"
              name="memory"
              onChange={(e) => {
                setSetupInf(() => ({
                  ...setupInf,
                  typeMemory: e.target.value,
                }));
              }}
            >
              <option value="udimm">UDIMM</option>
              <option value="sodimm">SODIMM</option>
            </select>
          </form>
          <RadioButtonGroup
            onChange={(value) => handleRadioGroupChange(value)}
          />
          <BasicButton
            text="Confirm"
            personalizedStyle={styleBtn}
            functionButton={handleClick}
          />
        </div>
      </main>
    </>
  );
}

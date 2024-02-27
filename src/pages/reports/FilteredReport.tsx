import React, { useEffect, useState } from "react";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import BasicTextField from "../../components/basicTextField/basicTextField";
import Title from "../../components/textTitle/textTitle";
import BackButton from "../../components/backButton/backButton";
import { useStyles } from "./styles.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectDashboard from "../../components/selectDashboard/selectDashboard.tsx";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Checkbox, FormControlLabel } from "@mui/material";
import Menu from "../../components/customMenu/customMenu";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

interface Costumer {
  name: string;
}

interface KPIs {
  labelled: string;
  reworks: string;
  trays: string;
}

const FilteredReport: React.FC = () => {
  const classes = useStyles();
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const fileName = `report_zilia_${day}-${month}-${year}_${hours}:${minutes}:${seconds}.pdf`;

  const userToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const [idsCostumers, setIdsCostumers] = useState<Costumer[]>([]);
  const [reportKpis, setReportKpis] = useState<KPIs>({
    labelled: "",
    reworks: "",
    trays: "",
  });
  const [filterGet, setFilterGet] = useState({
    OSnumber: ["All"],
    costumer: idsCostumers,
    startDate: "",
    endDate: "",
    typeM: ["All"],
  });
  const [costumersFetched, setCostumersFetched] = useState(false);
  const [valueStartDate, setValueStartDate] = useState<any>(null);
  const [valueEndDate, setValueEndDate] = useState<any>(null);

  const [useDateFilter, setDateFilter] = useState<any>();

  const [reportErros, setReportErros] = useState<any>();
  const [reportEndOfProcess, setReportEndOfProcess] = useState<any>();

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
        const users = await response.json();
        setIdsCostumers(users);
        setCostumersFetched(true);
      }
    } catch (error) {
      console.error("Errors in getting costumers:", error);
    }
  };

  const getReportKpis = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/report-kpis", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const reportKpisResult = await response.json();
        setReportKpis(reportKpisResult);
      }
    } catch (error) {
      console.error("Errors in getting kpis:", error);
    }
  };

  const getReportErros = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/report-erros", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const reportErrosResult = await response.json();
        setReportErros(reportErrosResult);
      }
    } catch (error) {
      console.error("Errors in getting erros:", error);
    }
  };

  const getReportEndOfProcess = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/report-end-of-process",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(filterGet),
        }
      );

      if (response.ok) {
        const reportEndResult = await response.json();
        setReportEndOfProcess(reportEndResult);
      }
    } catch (error) {
      console.error("Errors in getting erros:", error);
    }
  };

  const handleClick = () => {
    generatePDF();
  };

  const handleBack = () => {
    navigate("/reports");
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const docWidth = 210;
      const imageWidth = 50;
      const centerX = (docWidth - imageWidth) / 2;
      const convertStartDate = format(
        utcToZonedTime(filterGet.startDate, "America/Sao_Paulo"),
        "dd/MM/yyyy"
      );
      const convertEndDate = format(
        utcToZonedTime(filterGet.endDate, "America/Sao_Paulo"),
        "dd/MM/yyyy"
      );

      const dateInit =
        filterGet.startDate != ""
          ? convertStartDate
          : "----No date selected----";
      const endDate =
        filterGet.endDate != "" ? convertEndDate : "----No date selected----";

      const logo = new Image();
      logo.src = "/src/assets/Logo2.png";
      doc.addImage(logo, "PNG", centerX, 10, imageWidth, 20);

      doc.text("------Parameters------", centerX, 40);
      doc.text(`Order of service: ${filterGet.OSnumber}`, 10, 50);
      doc.text(`Initial date: ${dateInit}`, 10, 60);
      doc.text(`Final date: ${endDate}`, 10, 70);
      doc.text(`Type Memory: ${filterGet.typeM}`, 10, 80);
      doc.text(`Customer: ${filterGet.costumer}`, 10, 90);
      doc.text("------KPIs------", centerX, 110);
      doc.text(`Labelled: ${reportKpis.labelled}`, 10, 120);
      doc.text(`Trays Worked: ${reportKpis.trays}`, 10, 130);
      doc.text(`To Rework: ${reportKpis.reworks}`, 10, 140);
      doc.text(`Camera Error: ${reportErros.cam_erro}`, 10, 150);
      doc.text(`Mem Fail: ${reportErros.mem_fail}`, 10, 160);
      doc.text("------End of Process------", centerX, 180);
      doc.text(`Total Trays: ${reportEndOfProcess.totalTrays}`, 10, 190);
      doc.text(
        `Total Quant Memory: ${reportEndOfProcess.totalMemories}`,
        10,
        200
      );
      doc.text(
        `Total Cycle Time (Average): ${reportEndOfProcess.totalCycleTimeAverage}`,
        10,
        210
      );
      doc.text(
        `Time in min per Tray (Average): ${reportEndOfProcess.minutesPerTrayAverage}`,
        10,
        220
      );
      doc.text(
        `Time by memory (Average): ${reportEndOfProcess.timePerMemoryAverage}`,
        10,
        230
      );
      doc.text(
        `Memories Grade Below A: ${reportEndOfProcess.memFailAverage}`,
        10,
        240
      );
      doc.text(
        `Total Scrap Position and Error Type: ${reportEndOfProcess.totalScrapPositionErrors}`,
        10,
        250
      );
      doc.text(
        `Total Camera Errors: ${reportEndOfProcess.totalCameraErrors}`,
        10,
        260
      );
      doc.text(
        `Total Inspection Errors: ${reportEndOfProcess.totalInspectionErrors}`,
        10,
        270
      );
      doc.text(
        `Total Index Memory Errors: ${reportEndOfProcess.totalIndexMemoryErrors}`,
        10,
        280
      );

      doc.save(fileName);
      toast.success("Report PDF successfully downloaded!");
    } catch (e) {
      toast.error(
        "Unknown problem while generating PDF. Try another time later!"
      );
    }
  };

  useEffect(() => {
    getCostumers();
    getReportKpis();
    getReportErros();
    getReportEndOfProcess();
  }, []);

  const att = () => {
    getCostumers();
    getReportKpis();
    getReportErros();
    getReportEndOfProcess();
  };

  useEffect(() => {
    att();
  }, [filterGet]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(event.target.checked);

    if (!event.target.checked) {
      setValueStartDate("");
      setValueEndDate("");
      setFilterGet((prevFilter) => ({
        ...prevFilter,
        startDate: "",
        endDate: "",
      }));
    }
  };

  return (
    <>
      <Menu />
      <CardGeneral>
        <div className={classes.header}>
          <div className={classes.backButtonContainer}>
            <BackButton onClick={handleBack} />
          </div>
          <div className={classes.titleContainer}>
            <Title title="Report Settings" className={classes.title} />
          </div>
        </div>
        <BasicTextField
          label="OSnumber"
          placeholder="OSnumber"
          onChange={(value: any) => {
            setFilterGet((prevFilter) => ({
              ...prevFilter,
              OSnumber: value,
            }));
          }}
          type="OSnumber"
        />
        {costumersFetched && (
          <SelectDashboard
            label="Costumer(s)"
            className="select"
            vals={idsCostumers}
            filterGet={filterGet}
            setFilterGet={setFilterGet}
            filterField="costumer"
          />
        )}
        <SelectDashboard
          label="Memory Type"
          vals={[{ name: "udimm" }, { name: "sodimm" }]}
          filterGet={filterGet}
          setFilterGet={setFilterGet}
          filterField="typeM"
        />
        <FormControlLabel
          control={
            <Checkbox
              title="Filter by Date"
              value={useDateFilter}
              sx={{
                color: "rgb(64, 64, 216)",
                "&.Mui-checked": {
                  color: "rgb(64, 64, 216)",
                },
              }}
              onChange={handleChange}
            />
          }
          label="Filter by Date"
        />
        {useDateFilter && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
              <DatePicker
                label="Date"
                className="container_input_date_dashboard"
                format="DD/MM/YYYY"
                value={
                  valueStartDate !== "" ? dayjs(valueStartDate).toDate() : null
                }
                onChange={(date: Date | null) => {
                  if (date && useDateFilter && dayjs(date).isValid()) {
                    const formattedDate = date.toISOString().split("T")[0];
                    setFilterGet((prevFilter) => ({
                      ...prevFilter,
                      startDate: formattedDate,
                    }));
                    setValueStartDate(formattedDate);
                  } else {
                    setFilterGet((prevFilter) => ({
                      ...prevFilter,
                      startDate: "",
                    }));
                    setValueStartDate("");
                  }
                }}
              />
            </LocalizationProvider>
            <div style={{ marginRight: "50px" }}></div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
              <DatePicker
                label="Date"
                className="container_input_date_dashboard"
                format="DD/MM/YYYY"
                value={
                  valueEndDate !== "" ? dayjs(valueEndDate).toDate() : null
                }
                onChange={(date: Date | null) => {
                  if (date && useDateFilter && dayjs(date).isValid()) {
                    const formattedDate = date.toISOString().split("T")[0];
                    setFilterGet((prevFilter) => ({
                      ...prevFilter,
                      endDate: formattedDate,
                    }));
                    setValueEndDate(formattedDate);
                  } else {
                    setFilterGet((prevFilter) => ({
                      ...prevFilter,
                      endDate: "",
                    }));
                    setValueEndDate("");
                  }
                }}
              />
            </LocalizationProvider>
          </div>
        )}
        <div className={classes.buttonContainer}>
          <SimpleButton
            title="Generate Report"
            personalisedStyle={classes.button}
            onClick={handleClick}
          />
        </div>
        <ToastContainer />
      </CardGeneral>
    </>
  );
};

export default FilteredReport;

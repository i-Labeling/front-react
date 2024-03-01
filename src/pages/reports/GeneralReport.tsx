import React, { useEffect, useState } from "react";
import CardGeneral from "../../components/cardGeneral/cardGeneral";
import SimpleButton from "../../components/simpleButton/simpleButton";
import Title from "../../components/textTitle/textTitle";
import BackButton from "../../components/backButton/backButton";
import { useStyles } from "./styles.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Checkbox, FormControlLabel } from "@mui/material";
import Menu from "../../components/customMenu/customMenu";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { jsPDF } from "jspdf";
import SelectLongList from "../../components/selectLongList/selectLongList.tsx";
const GeneralOSReport: React.FC = () => {
  const classes = useStyles();
  const userToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const [reportOs, setReportOs] = useState<any[]>([]);
  const [filterGet, setFilterGet] = useState({
    OSnumber: reportOs,
    startDate: "",
    endDate: "",
  });
  const [valueStartDate, setValueStartDate] = useState<any>(null);
  const [valueEndDate, setValueEndDate] = useState<any>(null);

  const [useDateFilter, setDateFilter] = useState<any>();
  const [reportInfo, setReportInfo] = useState<any>();
  const [dataLoaded, setDataLoaded] = useState<any>(false);

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const fileName = `report_os_general_zilia_${day}-${month}-${year}_${hours}:${minutes}:${seconds}.pdf`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getOs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/report-os", {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const reportResult = await response.json();
        setReportOs(reportResult);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Errors in getting report infos:", error);
    }
  };

  const getReportInfo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/report", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const reportResult = await response.json();
        setReportInfo(reportResult);
      }
    } catch (error) {
      console.error("Errors in getting report infos:", error);
    }
  };

  function hasNonZeroValueInArray(arr: any) {
    for (const val of arr) {
      if (val !== 0) {
        return true;
      }
    }
    return false;
  }

  const generatePDF = (data: any) => {
    try {
      const doc = new jsPDF();
      const docWidth = 210;
      const imageWidth = 50;
      const centerX = (docWidth - imageWidth) / 2;
      const dateInit =
        filterGet.startDate != ""
          ? format(
              utcToZonedTime(filterGet.startDate, "America/Sao_Paulo"),
              "dd/MM/yyyy"
            )
          : "----No date selected----";
      const endDate =
        filterGet.endDate != ""
          ? format(
              utcToZonedTime(filterGet.endDate, "America/Sao_Paulo"),
              "dd/MM/yyyy"
            )
          : "----No date selected----";

      const logo = new Image();
      logo.src = "/src/assets/Logo2.png";
      doc.addImage(logo, "PNG", centerX, 10, imageWidth, 20);

      doc.text("------Parameters------", centerX, 40);
      doc.text(`Order of service: ${filterGet.OSnumber}`, 10, 50);
      doc.text(`Initial date: ${dateInit}`, 10, 60);
      doc.text(`Final date: ${endDate}`, 10, 70);
      doc.text("------Results------", centerX, 80);
      doc.setFontSize(14);

      let yPos = 90;

      data.forEach((order: any) => {
        if (yPos + 20 > 270) {
          doc.addPage();
          yPos = 30;
          doc.addImage(logo, "PNG", centerX, 10, imageWidth, 20);
        }

        doc.text(`Service Order: ${order.serviceOrder}`, 10, yPos);
        yPos += 10;

        doc.text(`Quantity Memory: ${order.quantMemory}`, 10, yPos);
        yPos += 10;

        doc.text(`Customer: ${order.customer}`, 10, yPos);
        yPos += 10;

        doc.text(`Total Cream Below A: ${order.creamBelowA}`, 10, yPos);
        yPos += 10;

        doc.text(`Camera Error: ${order.cameraError}`, 10, yPos);
        yPos += 10;

        doc.text(
          `Index Memory Errors: ${order.indexMemoryError.length - 1}`,
          10,
          yPos
        );
        yPos += 10;
        yPos += 10;
      });
      const hasNonZeroValue = hasNonZeroValueInArray(data);

      if (hasNonZeroValue) {
        doc.save(fileName);
        toast.success("Report PDF successfully downloaded!");
      } else {
        toast.warn(
          "All report values are 0. Please check an available combination!"
        );
      }
    } catch (e) {
      toast.error(
        "Unknown problem while generating PDF. Try another time later!"
      );
    }
  };

  const handleClick = () => {
    generatePDF(reportInfo);
  };

  const handleBack = () => {
    navigate("/reports");
  };

  useEffect(() => {
    getReportInfo();
    getOs();
  }, []);

  const att = () => {
    getReportInfo();
    getOs();
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
        {dataLoaded && reportOs.length > 0 && (
          <SelectLongList
            vals={reportOs.map((os) => ({ name: os.serviceOrder }))}
            filterGet={filterGet}
            setFilterGet={setFilterGet}
            filterField="OSnumber"
            label="OSnumber"
          />
        )}
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

export default GeneralOSReport;

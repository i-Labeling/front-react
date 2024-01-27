import Menu from "../../components/customMenu/customMenu";
import SelectDashboard from "../../components/selectDashboard/selectDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from "recharts";
import "./style.css";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import OSCard from "../../components/OSCard/OSCard";
import { Card, CardContent, List, ListItem, Typography } from "@mui/material";
import background from "../../assets/calendar.png";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

interface KPIs {
  labelled: string;
  reworks: string;
  trays: string;
}
interface Erros {
  erro: string;
}
interface Graph1 {
  hour: string;
  sodimm: number;
  udimm: number;
  quantity: number;
}
interface Graph2 {
  day: string;
  sodimm: number;
  udimm: number;
  quantity: number;
}
interface Costumer {
  name: string;
}

export default function Dashboard() {
  const [idsCostumers, setIdsCostumers] = useState<Costumer[]>([]);
  const userToken = localStorage.getItem("jwtToken");
  const [toastShown, setToastShown] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterGet, setFilterGet] = useState({
    costumer: idsCostumers,
    dateInit: new Date().toISOString().split("T")[0],
    dateTerminate: new Date().toISOString().split("T")[0],
    typeM: ["All"],
  });

  const [value, setValue] = useState<any>(dayjs(filterGet.dateInit));
  const [valueTerminate, setValueTerminate] = useState<any>(
    dayjs(filterGet.dateTerminate)
  );

  const [graph1, setGraph1] = useState<Graph1[]>([]);
  const [graph2, setGraph2] = useState<Graph2[]>([]);
  const [errors, setErrors] = useState<Erros[]>([]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const [kpis, setKpis] = useState<KPIs>({
    labelled: "",
    reworks: "",
    trays: "",
  });

  const validateDateInterval = () => {
    if (filterGet.dateInit > filterGet.dateTerminate) {
      if (!toastShown) {
        toast.error("Invalid date interval, try another interval!");
        setToastShown(true);
      }

      setKpis({
        labelled: "0",
        reworks: "0",
        trays: "0",
      });

      setErrors([]);

      return false;
    }
    return true;
  };

  //De acordo com a OSs
  const formatGraph1Data = (data: any) => {
    return data.map((item: any) => {
      return {
        hour: format(new Date(item.order), "HH:mm"),
        sodimm: item.typeMemory === "sodimm" ? item.quantMemory : 0,
        udimm: item.typeMemory === "udimm" ? item.quantMemory : 0,
        quantity: item.quantMemory,
      };
    });
  };

  //Agrupamento de dados por dia (tirar o hr)
  // const formatGraph1Data = (data: any) => {
  //   const accumulatedData: { [key: string]: any } = {};
  //   data.forEach((item: any) => {
  //     const typeMemory = item.typeMemory;

  //     if (accumulatedData[typeMemory]) {
  //       accumulatedData[typeMemory].sodimm +=
  //         item.typeMemory === "sodimm" ? item.quantMemory : 0;
  //       accumulatedData[typeMemory].udimm +=
  //         item.typeMemory === "udimm" ? item.quantMemory : 0;
  //       accumulatedData[typeMemory].quantity += item.quantMemory;
  //     } else {
  //       accumulatedData[typeMemory] = {
  //         typeMemory,
  //         sodimm: item.typeMemory === "sodimm" ? item.quantMemory : 0,
  //         udimm: item.typeMemory === "udimm" ? item.quantMemory : 0,
  //         quantity: item.quantMemory,
  //       };
  //     }
  //   });
  //   const result = Object.values(accumulatedData);
  //   return result;
  // };

  // const formatGraph1Data = (data: any, intervalHours: number) => {
  //   const accumulatedData: { [key: string]: any } = {};

  //   data.forEach((item: any) => {
  //     const date = new Date(item.order);
  //     const startHour =
  //       Math.floor(date.getHours() / intervalHours) * intervalHours;
  //     const endHour = startHour + intervalHours;

  //     const hourInterval = `${startHour.toString().padStart(2, "0")}-${endHour
  //       .toString()
  //       .padStart(2, "0")}`;

  //     if (accumulatedData[hourInterval]) {
  //       accumulatedData[hourInterval].sodimm +=
  //         item.typeMemory === "sodimm" ? item.quantMemory : 0;
  //       accumulatedData[hourInterval].udimm +=
  //         item.typeMemory === "udimm" ? item.quantMemory : 0;
  //       accumulatedData[hourInterval].quantity += item.quantMemory;
  //     } else {
  //       accumulatedData[hourInterval] = {
  //         hour: hourInterval,
  //         sodimm: item.typeMemory === "sodimm" ? item.quantMemory : 0,
  //         udimm: item.typeMemory === "udimm" ? item.quantMemory : 0,
  //         quantity: item.quantMemory,
  //       };
  //     }
  //   });

  //   const result = Object.values(accumulatedData);
  //   return result;
  // };

  const formatGraph2Data = (data: any) => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const groupedData: { [key: string]: any } = {};

    {
      data.length > 0 &&
        weekdays.forEach((day) => {
          groupedData[day] = {
            day,
            sodimm: null,
            udimm: null,
            quantity: null,
          };
        });
    }

    data.forEach((item: any) => {
      const day = format(new Date(item.order), "EEE");

      groupedData[day].sodimm +=
        item.typeMemory === "sodimm" ? item.quantMemory : 0;
      groupedData[day].udimm +=
        item.typeMemory === "udimm" ? item.quantMemory : 0;
      groupedData[day].quantity += item.quantMemory;
    });
    const result = Object.values(groupedData);

    return result;
  };

  const verificationSodimmKey = "sodimm";
  const allValuesNullSodimm = graph1.every((dictI: any) => {
    return dictI[verificationSodimmKey] === null;
  });
  const verificationUdimmKey = "udimm";
  const allValuesNullUdimm = graph1.every((dictI: any) => {
    return dictI[verificationUdimmKey] === null;
  });

  const getGraph1 = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard/graph1", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const data = await response.json();
        // const formattedData = formatGraph1Data(data, 1);
        const formattedData = formatGraph1Data(data);
        setGraph1(formattedData);
      }
    } catch (error) {
      console.error("Error in get graph 1:", error);
    }
  };

  const getGraph2 = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard/graph2", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const data = await response.json();
        const formattedData = formatGraph2Data(data);
        setGraph2(formattedData);
      }
    } catch (error) {
      console.error("Error in get graph 2:", error);
    }
  };
  const getErros = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard/erros", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const data = await response.json();
        setErrors(data);
      }
    } catch (error) {
      console.error("Errors in getting errors:", error);
    }
  };
  const getKPIs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard/kpis", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const data = await response.json();
        setKpis(data);
      }
    } catch (error) {
      console.error("Errors in getting kpis:", error);
    }
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
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Errors in getting kpis:", error);
    }
  };
  const att = () => {
    getCostumers();
    getGraph1();
    getGraph2();
    getErros();
    getKPIs();
  };
  useEffect(() => {
    getCostumers();
    getGraph1();
    getGraph2();
    getErros();
    getKPIs();
  }, []);
  useEffect(() => {
    if (!validateDateInterval()) {
      return;
    }
    att();
    console.log(filterGet);
  }, [filterGet, dataLoaded]);

  const dateToday = new Date().toISOString().split("T")[0];

  return (
    <>
      <Menu />
      <main className="container_page_dashboard">
        <div className="container_menu_header_dashboard">
          <div className="container_menu_dashboard">
            {dataLoaded && (
              <SelectDashboard
                vals={idsCostumers}
                filterGet={filterGet}
                setFilterGet={setFilterGet}
                filterField="costumer"
              />
            )}
            <SelectDashboard
              vals={[{ name: "udimm" }, { name: "sodimm" }]}
              filterGet={filterGet}
              setFilterGet={setFilterGet}
              filterField="typeM"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
              <DatePicker
                label="Start Date"
                className="container_input_date_dashboard"
                format="DD/MM/YYYY"
                value={value}
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0];
                    setFilterGet((prevFilter) => ({
                      ...prevFilter,
                      dateInit: formattedDate,
                    }));
                    setValue(formattedDate);
                  }
                }}
              />
            </LocalizationProvider>
            <div style={{ paddingLeft: 20 }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt"
              >
                <DatePicker
                  label="End Date"
                  className="container_input_date_dashboard"
                  format="DD/MM/YYYY"
                  value={valueTerminate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const formattedDate = date.toISOString().split("T")[0];
                      setFilterGet((prevFilter) => ({
                        ...prevFilter,
                        dateTerminate: formattedDate,
                      }));
                      setValueTerminate(formattedDate);
                    }
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${background})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              height: 120,
              width: 120,
              padding: "0 !important",
              marginRight: "6%",
            }}
          >
            <div style={{ textAlign: "center", paddingTop: "50px" }}>
              <span
                style={{
                  fontSize: "28px",
                }}
                className="text_calendar"
              >
                {format(utcToZonedTime(dateToday, "America/Sao_Paulo"), "dd")}
              </span>
              <br />
              <span className="text_calendar">
                {format(
                  utcToZonedTime(dateToday, "America/Sao_Paulo"),
                  "MMM yyyy"
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="container_cards_dasboard">
          <OSCard
            title="Labelled"
            content={kpis.labelled != "" ? kpis.labelled : "0"}
            titleBackgroundColor="#4443CE"
          />
          <div style={{ marginRight: "40px" }}></div>
          <OSCard
            title="Trays Worked"
            content={kpis.trays != "" ? kpis.trays : "0"}
            titleBackgroundColor="#4443CE"
          />
          <div style={{ marginRight: "40px" }}></div>
          <OSCard
            title="To Rework"
            content={kpis.reworks != "" ? kpis.reworks : "0"}
            titleBackgroundColor="#DFB54A"
          />
          <div style={{ marginRight: "40px" }}></div>
          <Card className="container_card_dashboard_erro">
            <div className="container_card_menu_dashboard_erro">
              <Typography
                variant="h5"
                component="h1"
                className="title_card_dashboard_erro"
              >
                Error
              </Typography>
            </div>
            <CardContent
              className="content_card_dashboard_erro"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <List
                style={{
                  flex: 1,
                  width: "100%",
                  marginTop: "10px",
                  marginBottom: "30px",
                }}
              >
                {errors.length > 0 &&
                  errors.map((e, index) => (
                    <ListItem
                      key={index}
                      className="val_card_dashboard"
                      style={{
                        backgroundColor: "white",
                        borderBottom: "1px solid #ccc",
                        padding: "10px 0",
                      }}
                    >
                      <Typography
                        className="title_card_dashboard_erro"
                        style={{
                          display: "flex",
                          marginLeft: "10px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {e.erro}
                      </Typography>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </div>
        <div className="container_graph">
          <div className="content_graph">
            <h1 className="title_graph">LABELING BY DAY (OSs)</h1>
            <BarChart
              width={500}
              height={240}
              data={graph1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="hour" unit="hr" />
              <YAxis />
              <Tooltip />
              <Legend width={100} wrapperStyle={{ top: 10, right: -66 }} />
              {allValuesNullSodimm ? (
                <></>
              ) : (
                <Bar dataKey="sodimm" fill="rgb(64, 64, 216)" unit="" />
              )}
              {allValuesNullUdimm ? (
                <></>
              ) : (
                <Bar dataKey="udimm" fill="#82ca9d" />
              )}
            </BarChart>
          </div>
          <div className="content_graph">
            <h1 className="title_graph">LABELING BY WEEK</h1>
            <LineChart
              width={500}
              height={240}
              data={graph2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend width={100} wrapperStyle={{ top: 10, right: -66 }} />
              {allValuesNullSodimm ? (
                <></>
              ) : (
                <Line
                  type="monotone"
                  dataKey="sodimm"
                  stroke="rgb(64, 64, 216)"
                />
              )}
              {allValuesNullUdimm ? (
                <></>
              ) : (
                <Line type="monotone" dataKey="udimm" stroke="#82ca9d" />
              )}
            </LineChart>
          </div>
        </div>
      </main>
    </>
  );
}

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
import BackButton from "../../components/backButton/backButton";
import OSCard from "../../components/OSCard/OSCard";
import { Card, CardContent, List, ListItem, Typography } from "@mui/material";
import background from "../../assets/calendar.png";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
  sodinn: number;
  udinn: number;
  quantity: number;
}
interface Graph2 {
  day: string;
  sodinn: number;
  udinn: number;
  quantity: number;
}
interface Costumer {
  name: string;
}

export default function Dashboard() {
  function parseParams(params: any) {
    const keys = Object.keys(params);
    let options = "";

    keys.forEach((key) => {
      const isParamTypeObject = typeof params[key] === "object";
      const isParamTypeArray = isParamTypeObject && params[key].length >= 0;

      if (!isParamTypeObject) {
        options += `${key}=${params[key]}&`;
      }

      if (isParamTypeObject && isParamTypeArray) {
        params[key].forEach((element: any) => {
          options += `${key}=${element}&`;
        });
      }
    });

    return options ? options.slice(0, -1) : options;
  }
  const [idsCostumers, setIdsCostumers] = useState<Costumer[]>([]);
  const userToken = localStorage.getItem("jwtToken");
  const [filterGet, setFilterGet] = useState({
    costumer: idsCostumers,
    date: new Date().toISOString().split("T")[0],
    typeM: ["udimm", "sodimm"],
  });

  const [value, setValue] = useState<any>(dayjs(filterGet.date));

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
  const verificationSodimmKey = "sodimm";
  const allValuesNullSodimm = graph1.every((dictI: any) => {
    return dictI[verificationSodimmKey] === null;
  });
  const verificationUdimmKey = "udimm";
  const allValuesNullUdimm = graph1.every((dictI: any) => {
    return dictI[verificationUdimmKey] === null;
  });

  const parseParamsQuery = (params: any) => {
    const queryParams = new URLSearchParams(params).toString();
    return queryParams;
  };

  const getGraph1 = async () => {
    const response = await fetch(
      "http://127.0.0.1:5000/dashboard/graph1?" + parseParamsQuery(filterGet),
      { method: "GET", headers: headers }
    );

    if (response.ok) {
      const data = await response.json();
      setGraph1(data);
    }

    // Mock data for graph1
    // Testing
    // const mockGraph1Data = [
    //   { hour: "00:00", sodinn: 10, udinn: 15, quantity: 25 },
    //   { hour: "01:00", sodinn: 12, udinn: 18, quantity: 30 },
    // ];

    // setGraph1(mockGraph1Data);
  };
  const getGraph2 = async () => {
    const response = await fetch(
      "http://127.0.0.1:5000/dashboard/graph2?" + parseParamsQuery(filterGet),
      { method: "GET", headers: headers }
    );

    if (response.ok) {
      const data = await response.json();
      setGraph2(data);
    }

    //Test
    // Mock data for graph2
    // const mockGraph2Data = [
    //   { day: "Mon", sodinn: 50, udinn: 30, quantity: 80 },
    //   { day: "Tue", sodinn: 45, udinn: 35, quantity: 80 },
    //   { day: "Wed", sodinn: 35, udinn: 25, quantity: 80 },
    //   { day: "Thu", sodinn: 45, udinn: 35, quantity: 80 },
    // ];

    // setGraph2(mockGraph2Data);
  };
  const getErros = async () => {
    const response = await fetch(
      "http://127.0.0.1:5000/dashboard/erros?" + parseParamsQuery(filterGet),
      { method: "GET", headers: headers }
    );

    if (response.ok) {
      const data = await response.json();
      setErrors(data);
    }

    // const mockErrors = [
    //   { erro: "Error 1: Something went wrong" },
    //   { erro: "Error 2: Another issue occurred" },
    //   { erro: "Error 3: An error message here" },
    // ];

    // setErrors(mockErrors);
  };
  const getKPIs = async () => {
    const response = await fetch(
      "http://127.0.0.1:5000/dashboard/kpis?" + parseParamsQuery(filterGet),
      { method: "GET", headers: headers }
    );

    if (response.ok) {
      const data = await response.json();
      setKpis(data);
    }
  };

  const getCostumers = async () => {
    const response = await fetch("http://127.0.0.1:5000/costumer", {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      const users = await response.json();
      setIdsCostumers(users);
    }
  };
  const att = () => {
    getGraph1();
    getGraph2();
    getErros();
    getKPIs();
    getCostumers();
  };
  useEffect(() => {
    getGraph1();
    getGraph2();
    getErros();
    getKPIs();
    getCostumers();
  }, []);
  useEffect(() => {
    att();
    console.log(filterGet);
  }, [filterGet]);

  return (
    <>
      <Menu />
      <main className="container_page_dashboard">
        <div className="container_menu_header_dashboard">
          <div className="container_menu_dashboard">
            <div className="back_button_container">
              <BackButton />
            </div>
            <SelectDashboard
              vals={idsCostumers}
              filterGet={filterGet}
              setFilterGet={setFilterGet}
              filterField="costumer"
            />
            <SelectDashboard
              vals={[{ name: "udimm" }, { name: "sodimm" }]}
              filterGet={filterGet}
              setFilterGet={setFilterGet}
              filterField="typeM"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
              <DatePicker
                className="container_input_date_dashboard"
                format="DD/MM/YYYY"
                value={value}
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0];
                    setFilterGet((prevFilter) => ({
                      ...prevFilter,
                      date: formattedDate,
                    }));
                    setValue(formattedDate);
                  }
                }}
              />
            </LocalizationProvider>
          </div>
          <div
            style={{
              backgroundImage: `url(${background})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              height: 120,
              width: 120,
              padding: "0 !important",
            }}
          >
            <div style={{ textAlign: "center", paddingTop: "50px" }}>
              <span
                style={{
                  fontSize: "28px",
                }}
                className="text_calendar"
              >
                {format(
                  utcToZonedTime(filterGet.date, "America/Sao_Paulo"),
                  "dd"
                )}
              </span>
              <br />
              <span className="text_calendar">
                {format(
                  utcToZonedTime(filterGet.date, "America/Sao_Paulo"),
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
                  marginBottom: "10px",
                }}
              >
                {errors.map((e, index) => (
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
            <h1 className="title_graph">LABELING BY DAY</h1>
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
                <Bar dataKey="sodinn" fill="rgb(64, 64, 216)" unit="hr" />
              )}
              {allValuesNullUdimm ? (
                <></>
              ) : (
                <Bar dataKey="udinn" fill="#82ca9d" />
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
                  dataKey="sodinn"
                  stroke="rgb(64, 64, 216)"
                />
              )}
              {allValuesNullUdimm ? (
                <></>
              ) : (
                <Line type="monotone" dataKey="udinn" stroke="#82ca9d" />
              )}
            </LineChart>
          </div>
        </div>
      </main>
    </>
  );
}

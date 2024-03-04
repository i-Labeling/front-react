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
import SelectLongList from "../../components/selectLongList/selectLongList";

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
  date: string;
  sodimm: number;
  udimm: number;
  quantity: number;
  dayOfWeek: string;
}
interface Costumer {
  name: string;
}

export default function Dashboard() {
  const [idsCostumers, setIdsCostumers] = useState<Costumer[]>([]);
  const userToken = localStorage.getItem("jwtToken");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterGet, setFilterGet] = useState({
    costumer: idsCostumers,
    date: format(new Date(), "yyyy-MM-dd"),
    typeM: ["All"],
  });

  const [value, setValue] = useState<any>(dayjs(filterGet.date));

  const [graph1, setGraph1] = useState<Graph1[]>([]);
  const [graph2, setGraph2] = useState<Graph2[]>([]);
  const [dataGraph2, setDataGraph2] = useState<any>(true);
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

  const formatGraph2Data = (dataList: any) => {
    return dataList.map((item: any) => {
      const dayOfWeek = format(
        utcToZonedTime(item.date, "America/Sao_Paulo"),
        "EEE"
      );
      return { ...item, dayOfWeek };
    });
  };

  const verificationSodimmKey = "sodimm";
  const allValuesNullSodimm = graph1.every((dictI: any) => {
    return dictI[verificationSodimmKey] === null;
  });
  const verificationUdimmKey = "udimm";
  const allValuesNullUdimm = graph1.every((dictI: any) => {
    return dictI[verificationUdimmKey] === null;
  });

  const allValuesNullSodimmGraph2 = graph2.every((dictI: any) => {
    return dictI[verificationSodimmKey] === null;
  });
  const allValuesNullUdimmGraph2 = graph2.every((dictI: any) => {
    return dictI[verificationUdimmKey] === null;
  });

  const verificationKey = "quantity";
  const allValuesZeroForQuantity = (array: any[], key: string): boolean => {
    return array.every((obj: any) => obj[key] === 0);
  };

  const getGraph1 = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard/graph1", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filterGet),
      });

      if (response.ok) {
        const data = await response.json();
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
        const shouldDisplay = allValuesZeroForQuantity(
          formattedData,
          verificationKey
        );
        setDataGraph2(shouldDisplay);
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

  function filtrarUnicosPorChave<T>(lista: T[], chave: keyof T & string): T[] {
    return lista.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[chave] === item[chave])
    );
  }

  const getCostumers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/costumer", {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const users = await response.json();
        const uniqueCostumers = filtrarUnicosPorChave<Costumer>(users, "name");
        setIdsCostumers(uniqueCostumers);
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
    att();
    console.log('filter', filterGet);
  }, [filterGet, dataLoaded]);

  const dateToday = format(new Date(), "yyyy-MM-dd");

  return (
    <>
      <Menu />
      <main className="container_page_dashboard">
        <div className="container_menu_header_dashboard">
          <div className="container_menu_dashboard">
            {dataLoaded && (
               <SelectLongList
               vals={idsCostumers}
               filterGet={filterGet}
               setFilterGet={setFilterGet}
               filterField="costumer"
               label="Costumer(s)"
               style={{width: '200px'}}
             />
            )}
            <div style={{ marginRight: "50px" }}></div>
            <SelectDashboard
              vals={[{ name: "udimm" }, { name: "sodimm" }]}
              filterGet={filterGet}
              setFilterGet={setFilterGet}
              filterField="typeM"
            />
            <div style={{ marginRight: "50px" }}></div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
              <DatePicker
                label="Date"
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
            content={
              kpis.labelled != "" && kpis.labelled != null ? kpis.labelled : "0"
            }
            titleBackgroundColor="#4443CE"
          />
          <div style={{ marginRight: "40px" }}></div>
          <OSCard
            title="Trays Worked"
            content={kpis.trays != "" && kpis.trays != null ? kpis.trays : "0"}
            titleBackgroundColor="#4443CE"
          />
          <div style={{ marginRight: "40px" }}></div>
          <OSCard
            title="To Rework"
            content={
              kpis.reworks != "" && kpis.reworks != null ? kpis.reworks : "0"
            }
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
        <>
          <div className="container_graph">
            {graph1.length > 0 && (
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
            )}
            {!dataGraph2 && (
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
                  <XAxis dataKey="dayOfWeek" />
                  <YAxis />
                  <Tooltip
                    content={(props) => {
                      const { payload } = props;
                      if (payload && payload.length > 0) {
                        const { date, sodimm, udimm } = payload[0].payload;
                        const convertDate = format(
                          utcToZonedTime(date, "America/Sao_Paulo"),
                          "dd/MM/yyyy"
                        );

                        return (
                          <div className="custom-tooltip">
                            <p>Date: {convertDate}</p>
                            <p style={{ color: "rgb(64, 64, 216)" }}>
                              sodimm: {sodimm}
                            </p>
                            <p style={{ color: "#82ca9d" }}>udimm: {udimm}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend width={100} wrapperStyle={{ top: 10, right: -66 }} />
                  {allValuesNullSodimmGraph2 ? (
                    <></>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="sodimm"
                      stroke="rgb(64, 64, 216)"
                    />
                  )}
                  {allValuesNullUdimmGraph2 ? (
                    <></>
                  ) : (
                    <Line type="monotone" dataKey="udimm" stroke="#82ca9d" />
                  )}
                </LineChart>
              </div>
            )}
          </div>
        </>
      </main>
    </>
  );
}

import CardDashboard from "../../components/cardDashboard/cardDashboard"
import Menu from "../../components/menu/menu"
import SelectDashboard from "../../components/selectDashboard/selectDashboard"
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend} from "recharts"
import "./style.css"
export default function Dashboard(){
    const styleCardErro = {
        width : "43%",
        fontSize: "13px"
    }
    const data = [
        {
          name: "01:00",
          uv: 4000,
          pv: 2400,
          amt: 2400
        },
        {
          name: "02:00",
          uv: 3000,
          pv: 1398,
          amt: 2210
        },
        {
          name: "03:00",
          uv: 2000,
          pv: 9800,
          amt: 2290
        },
        {
          name: "04:00",
          uv: 2780,
          pv: 3908,
          amt: 2000
        },
        {
          name: "05:00",
          uv: 1890,
          pv: 4800,
          amt: 2181
        },
        {
          name: "06:00",
          uv: 2390,
          pv: 3800,
          amt: 2500
        },
        {
          name: "07:00",
          uv: 3490,
          pv: 4300,
          amt: 2100
        }
      ];
    return(
        <>
            <Menu/>
            <main className="container_page_dashboard">
                <div className="container_menu_header_dashboard">
                    <div className="container_menu_dashboard">
                        <h1 className="title_menu_dashboard">
                            iLabeling
                        </h1>
                        <SelectDashboard/>
                        <SelectDashboard/>
                        <input className="container_input_date_dashboard" type="date" id="data" name="data">

                        </input>
                    </div>
                    <div className="container_date_dashboard">
                        <h1 className="date_dashboard">
                            Data: 20/10/2023
                        </h1>
                    </div>
                </div> 
                <div className="container_cards_dasboard">
                    <CardDashboard tittle="To Rework" val="3"/>
                    <CardDashboard tittle="Labelled" val="3"/>
                    <CardDashboard tittle="Trays Worked" val="3"/>
                    <CardDashboard tittle="Erros" val="3
                    vc fcytfdcyt
                     dxyrdxrsztszesztezteztztsztsz dakjniabsoibhduhsabdsuau hdauhdivaduvifuvdaubuabujanlijna kj j kaj sjhajhbsh adhksjahbdhsadjhbohb dhaiuvaibiu hdbaibsoibaobsobdosibaodhbsahbduhsabduhbasuhdbkashbdkashbsdjhbashb
                     " style={styleCardErro}/>
                </div>
                <div className="container_graph">
                    <div className="content_graph">
                        <h1 className="title_graph">
                            ROTULAGEM POR DIA 
                        </h1>
                        <BarChart
                            width={500}
                            height={240}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend width={100} wrapperStyle={{ top: 10, right: -66}}/>
                            <Bar dataKey="pv" fill="rgb(64, 64, 216)" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                    </div>
                    <div className="content_graph">
                        <h1 className="title_graph">
                            ROTULAGEM POR SEMANA
                        </h1>
                        <BarChart
                            width={500}
                            height={240}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend width={100} wrapperStyle={{ top: 10, right: -66}}/>
                            <Bar dataKey="pv" fill="rgb(64, 64, 216)" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                    </div>
                </div>      
            </main>
        </>
    )
}
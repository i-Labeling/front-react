import CardDashboard from "../../components/cardDashboard/cardDashboard"
import Menu from "../../components/menu/menu"
import SelectDashboard from "../../components/selectDashboard/selectDashboard"
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend} from "recharts"
import "./style.css"
import { useState, useEffect } from "react"
import axiosInstance from "../../services/instanceAxios"

interface KPIs{
    reworks:string,
    trays: string,
    labelled: string,
}
interface Erros{
    erro:string
}
interface Graph{
    day: string,
    sodinn: number,
    udinn: number,
    quantity: number
}
interface Costumer{
    name: string;
}
export default function Dashboard(){
    const styleCardErro = {
        width : "43%",
        fontSize: "13px"
    }
    const [idsCostumers,setIdsCostumers] = useState<Costumer[]>([])
    const [filterGet,setFilterGet] = useState({
        costumer: "ibm",
        dateFilter: "",
        type:"udinn",
    })
    const [graph1,setGraph1] = useState<Graph[]>([])
    const [graph2,setGraph2] = useState<Graph[]>([])
    const [errors,setErrors] = useState<Erros[]>([])
    const [kpis,setKpis] = useState<KPIs>({
        reworks:"",
        trays: "",
        labelled: ""
    })
    const getGraph1 = async () =>{
        await axiosInstance.get('dashboard/graph1')
            .then((res)=>{
                setGraph1(res.data)
            })
            .catch((res)=>console.log(res))
    }
    const getGraph2 = async () =>{
        await axiosInstance.get('dashboard/graph2',{ params: filterGet })
            .then((res)=>{
                setGraph2(res.data)
                console.log("ok")
            })
            .catch((res)=>console.log(res))
    }
    const getErros = async () =>{
        await axiosInstance.get('dashboard/erros',{ params: filterGet })
            .then((res)=>{
                setErrors(res.data)
            })
            .catch((res)=>console.log(res))
    }
    const getKPIs = async () =>{
        await axiosInstance.get('dashboard/kpis',{ params: filterGet })
            .then((res)=>{
                setKpis(res.data)
            })
            .catch((res)=>console.log(res))
    }
    const getCostumers = async () =>{
        await axiosInstance.get('costumer')
            .then((res)=>{
                setIdsCostumers(res.data)
            })
            .catch((res)=>console.log(res))
    }

    useEffect(()=>{
        getGraph1()
        getGraph2()
        getErros()
        getKPIs()
        getCostumers()
        console.log(errors)
    },[])
    return(
        <>
            <Menu/>
            <main className="container_page_dashboard">
                <div className="container_menu_header_dashboard">
                    <div className="container_menu_dashboard">
                        <h1 className="title_menu_dashboard">
                            iLabeling
                        </h1>
                        <SelectDashboard 
                        vals={idsCostumers} 
                        filterGet={filterGet} 
                        setFilterGet={setFilterGet}
                        filterField="costumer"/>
                        <SelectDashboard 
                        vals={[{name:"udimm"},{name:"sodimm"}]} 
                        filterGet={filterGet} 
                        setFilterGet={setFilterGet}
                        filterField="type"
                        />
                        <input className="container_input_date_dashboard" 
                        type="date" 
                        id="data" 
                        name="data"
                        onChange={(e)=>
                            {
                                setFilterGet(inf=>({...filterGet,dateFilter:e.target.value}));
                            }
                         }
                        >
                        </input>
                    </div>
                    <div className="container_date_dashboard">
                        <h1 className="date_dashboard">
                            {filterGet.dateFilter}
                        </h1>
                    </div>
                </div> 
                <div className="container_cards_dasboard">
                    <CardDashboard tittle="To Rework" val={kpis.reworks}/>
                    <CardDashboard tittle="Labelled" val={kpis.labelled}/>
                    <CardDashboard tittle="Trays Worked" val={kpis.trays}/>
                    <div className="container_card_dashboard_erro">
                        <div className="container_card_menu_dashboard_erro">
                            <h1 className="title_card_dashboard_erro">Erros</h1>
                        </div>
                        <div className="content_card_dashboard_erro">
                            {errors.map((e) => (<p className="val_card_dashboard">{e.erro}</p>))}
                        </div>
                    </div>
                </div>
                <div className="container_graph">
                    <div className="content_graph">
                        <h1 className="title_graph">
                            ROTULAGEM POR DIA 
                        </h1>
                        <BarChart
                            width={500}
                            height={240}
                            data={graph1}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend width={100} wrapperStyle={{ top: 10, right: -66}}/>
                            <Bar dataKey="sodinn" fill="rgb(64, 64, 216)" />
                            <Bar dataKey="udinn" fill="#82ca9d" />
                        </BarChart>
                    </div>
                    <div className="content_graph">
                        <h1 className="title_graph">
                            ROTULAGEM POR SEMANA
                        </h1>
                        <BarChart
                            width={500}
                            height={240}
                            data={graph2}
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
                            <Bar dataKey="sodinn" fill="rgb(64, 64, 216)" />
                            <Bar dataKey="udinn" fill="#82ca9d" />
                        </BarChart>
                    </div>
                </div>      
            </main>
        </>
    )
}
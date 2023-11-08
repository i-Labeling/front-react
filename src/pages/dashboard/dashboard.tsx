import CardDashboard from "../../components/cardDashboard/cardDashboard"
import Menu from "../../components/menu/menu"
import SelectDashboard from "../../components/selectDashboard/selectDashboard"
import {BarChart, Bar, XAxis, YAxis,Tooltip, Legend} from "recharts"
import "./style.css"
import { useState, useEffect } from "react"
import axiosInstance from "../../services/instanceAxios"
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';


interface KPIs{
    labelled: string,
    reworks:string,
    trays: string,
}
interface Erros{
    erro:string
}
interface Graph1{
    hour: string,
    sodinn: number,
    udinn: number,
    quantity: number
}
interface Graph2{
    day: string,
    sodinn: number,
    udinn: number,
    quantity: number
}
interface Costumer{
    name: string;
}

export default function Dashboard(){
    function parseParams(params:any) {
        const keys = Object.keys(params)
        let options = ''
      
        keys.forEach((key) => {
          const isParamTypeObject = typeof params[key] === 'object'
          const isParamTypeArray = isParamTypeObject && params[key].length >= 0
      
          if (!isParamTypeObject) {
            options += `${key}=${params[key]}&`
          }
      
          if (isParamTypeObject && isParamTypeArray) {
            params[key].forEach((element:any) => {
              options += `${key}=${element}&`
            })
          }
        })
      
        return options ? options.slice(0, -1) : options
      }
    const styleCardErro = {
        width : "43%",
        fontSize: "13px"
    }
    const [idsCostumers,setIdsCostumers] = useState<Costumer[]>([])
    const [filterGet,setFilterGet] = useState({
        costumer: ['WINTRONIC','AMD'],
        date: new Date().toISOString().split('T')[0],
        typeM:["udimm","sodimm"],
    })
    const [graph1,setGraph1] = useState<Graph1[]>([])
    const [graph2,setGraph2] = useState<Graph2[]>([])
    const [errors,setErrors] = useState<Erros[]>([])
    const [kpis,setKpis] = useState<KPIs>({
        labelled: "",
        reworks:"",
        trays: "",
    })
    const verificationSodimmKey = "sodimm";
    const allValuesNullSodimm = graph1.every((dictI:any) => {
      return dictI[verificationSodimmKey] === null;
    });
    const verificationUdimmKey = "udimm";
    const allValuesNullUdimm = graph1.every((dictI:any) => {
      return dictI[verificationUdimmKey] === null;
    });
    const getGraph1 = async () =>{
        await axiosInstance.get('dashboard/graph1', { 
            params: filterGet,
            paramsSerializer: (params) => parseParams(params)
            })
            .then((res)=>{
                setGraph1(res.data)
            })
            .catch((res)=>console.log(res))
    }
    const getGraph2 = async () =>{
        await axiosInstance.get('dashboard/graph2',{ 
            params: filterGet,
            paramsSerializer: (params) => parseParams(params)})
            .then((res)=>{
                setGraph2(res.data)
            })
            .catch((res)=>console.log(res))
    }
    const getErros = async () =>{
        await axiosInstance.get('dashboard/erros',{ 
            params:filterGet,
            paramsSerializer: (params) => parseParams(params) })
            .then((res)=>{
                setErrors(res.data)
            })
            .catch((res)=>console.log(res))
    }
    const getKPIs = async () =>{
        await axiosInstance.get('dashboard/kpis',{  
            params: filterGet,
            paramsSerializer: (params) => parseParams(params)})
            .then((res)=>{
                setKpis(res.data)
                console.log(res.data)
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
    const dateFormat =()=> format(utcToZonedTime(filterGet.date, 'America/Sao_Paulo'), 'dd-MM-yyyy');
    const att = ()=>{
        getGraph1()
        getGraph2()
        getErros()
        getKPIs()
        getCostumers()
    }
    useEffect(()=>{
        getGraph1()
        getGraph2()
        getErros()
        getKPIs()
        getCostumers()
    },[])
    useEffect(()=>{
        att()
        console.log(filterGet)
    },[filterGet])
    return(
        <>
            <Menu/>
            <main className="container_page_dashboard">
                <div className="container_menu_header_dashboard">
                    <div className="container_menu_dashboard">
                        <h1 className="title_menu_dashboard">
                            i-Labeling
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
                        filterField="typeM"
                        />
                        <input className="container_input_date_dashboard" 
                        type="date" 
                        id="data" 
                        name="data"
                        value={filterGet.date}
                        onChange={(e)=>
                            {
                                setFilterGet(inf=>({...filterGet,date:e.target.value}));
                            }
                         }
                        >
                        </input>
                        
                    </div>
                    <div className="container_date_dashboard">
                        <h1 className="date_dashboard">
                            {format(utcToZonedTime(filterGet.date, 'America/Sao_Paulo'), 'dd-MM-yyyy')}
                        </h1>
                    </div>
                </div> 
                <div className="container_cards_dasboard">
                    <CardDashboard tittle="To Rework" val={kpis.reworks}/>
                    <CardDashboard tittle="Labelled" val={kpis.labelled}/>
                    <CardDashboard tittle="Trays Worked" val={kpis.trays}/>
                    <div className="container_card_dashboard_erro">
                        <div className="container_card_menu_dashboard_erro">
                            <h1 className="title_card_dashboard_erro">Error</h1>
                        </div>
                        <div className="content_card_dashboard_erro">
                        {errors.map((e) => (<p className="val_card_dashboard">{e.erro}</p>))}
                        </div>
                    </div>

                </div>
                <div className="container_graph">
                    <div className="content_graph">
                        <h1 className="title_graph">
                            LABELING BY DAY 
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
                            <XAxis dataKey="hour" unit='hr'/>
                            <YAxis />
                            <Tooltip />
                            <Legend width={100} wrapperStyle={{ top: 10, right: -66}}/>
                             {allValuesNullSodimm?
                                <></>:
                                <Bar dataKey="sodimm" fill="rgb(64, 64, 216)" unit="hr" />
                            }
                            {allValuesNullUdimm?
                                <></>:
                                <Bar dataKey="udimm" fill="#82ca9d" />
                               
                            }
                            
                        </BarChart>
                    </div>
                    <div className="content_graph">
                        <h1 className="title_graph">
                            LABELING BY WEEK
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
                            
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend width={100} wrapperStyle={{ top: 10, right: -66}}/>
                            {allValuesNullSodimm?
                                <></>:
                                <Bar dataKey="sodimm" fill="rgb(64, 64, 216)"/>
                            }
                            {allValuesNullUdimm?
                                <></>:
                                <Bar dataKey="udimm" fill="#82ca9d" />
                               
                            }
                        </BarChart>
                    </div>
                </div>      
            </main>
        </>
    )
}
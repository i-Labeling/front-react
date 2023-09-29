import CardLog from "../../components/cardLog/cardLog";
import Menu from "../../components/menu/menu";
import {IoFileTrayOutline} from "react-icons/io5"
import {BsRepeat} from "react-icons/bs"
import {AiOutlineFieldTime,AiOutlineCamera} from "react-icons/ai"
import {FaFileLines, FaMagnifyingGlass} from "react-icons/fa6"
import {BiError,BiSolidMemoryCard,BiMap} from "react-icons/bi"
import "./style.css"
import { useState,useEffect } from "react";
import axiosInstance from "../../services/instanceAxios";

interface infProcess{
    tray:string;
    totalCycleTime: string;
    minutesPerTray: string;
    timePerMemory: string;
    creamBelowA:string;
    inspectionErrors: string;
    cameraError:string;
    indexMemoryError: string;
    positionAndError: string;
    order: string;
}
export default function EndProcess(){
    const [infProccess, setInfProccess]  = useState<infProcess>({
        tray:"0",
        totalCycleTime: "0",
        minutesPerTray: "0",
        timePerMemory: "0",
        creamBelowA: "0",
        inspectionErrors: "0",
        cameraError: "0",
        indexMemoryError: "0",
        positionAndError: "0",
        order:"0"
    })
    const tray = <IoFileTrayOutline size="30" color="white"/>
    const cycle = <BsRepeat size="30" color="white"/>
    const time = <AiOutlineFieldTime size="30" color="white"/>
    const note = <FaFileLines size="30" color="white"/>
    const error = <BiError size="30" color="white"/>
    const memory = <BiSolidMemoryCard size="30" color="white"/>
    const camera = <AiOutlineCamera size="30" color="white"/>
    const glass = <FaMagnifyingGlass size="30" color="white"/>
    const map = <BiMap size="30" color="white"/>
    const styleCard = {
        fontSize: "15px",
        justifyContent: "start",
        alignItems: "start"
    }
    const getVal = async () =>{
        await axiosInstance.get('/')
            .then((res)=>{
                console.log("att aqui")
                setInfProccess(res.data)
            })
            .catch((res)=>console.log(res))
    }
    useEffect(()=>{
        getVal();
    },[])
    return(
        <>
            <Menu/>        
            <main className="container_page_endProcess">
                <div className="container_page_title_endProcess">
                    <h1 >
                        Ordem de Serviço : {infProccess.order} - Detalhes do Processo
                    </h1>
                </div>
                <div className="container_cards_horizontal">
                    <CardLog icon={tray} title="Bandeja" val={infProccess.tray} show={true}/>
                    <CardLog icon={cycle} title="Tempo Total de Ciclo" val={infProccess.totalCycleTime} show={true}/>
                    <CardLog icon={time} title="Tempo de Minutos por Bandeja" val={infProccess.minutesPerTray} show={true}/>
                    <CardLog icon={memory}  title="Tempo por Memória" val={infProccess.totalCycleTime} show={true}/>
                    <CardLog icon={note} title="Memórias com Nota Abaixo de A" val={infProccess.creamBelowA} show={true}/>
                    <CardLog icon={glass} title="Memórias com Erro na Inspeção" val={infProccess.inspectionErrors} show={true}/>
                    <CardLog icon={camera} title="Número de Erro na Câmera" val={infProccess.cameraError } show={true}/>
                    <CardLog icon={error} title="Memória com Erro (Index)" val={infProccess.indexMemoryError} style={styleCard} show={true}/>
                    <CardLog icon={map} title="Posição de Refugo e Tipo de Erro" val={infProccess.positionAndError} style={styleCard} show={false}/>
                </div>
            </main>
        </>
    )
}
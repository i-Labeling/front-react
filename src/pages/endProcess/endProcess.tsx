import CardLog from "../../components/cardLog/cardLog";
import Menu from "../../components/menu/menu";
import {IoFileTrayOutline} from "react-icons/io5"
import {BsRepeat} from "react-icons/bs"
import {AiOutlineFieldTime,AiOutlineCamera} from "react-icons/ai"
import {FaFileLines, FaMagnifyingGlass} from "react-icons/fa6"
import {BiError,BiSolidMemoryCard,BiMap} from "react-icons/bi"
import "./style.css"
export default function EndProcess(){
    const tray = <IoFileTrayOutline size="80" color="white"/>
    const cycle = <BsRepeat size="80" color="white"/>
    const time = <AiOutlineFieldTime size="80" color="white"/>
    const note = <FaFileLines size="80" color="white"/>
    const error = <BiError size="80" color="white"/>
    const memory = <BiSolidMemoryCard size="80" color="white"/>
    const camera = <AiOutlineCamera size="80" color="white"/>
    const glass = <FaMagnifyingGlass size="80" color="white"/>
    const map = <BiMap size="80" color="white"/>
    const styleCard = {
        fontSize: "15px",
        justifyContent: "start",
        alignItems: "start"
    }
    return(
        <>
            <Menu/>        
            <main className="container_page_endProcess">
                <div className="container_page_title_endProcess">
                    <h1 >
                        Ordem de Serviço : 13344344223 - Detalhes do Processo
                    </h1>
                </div>
                <div className="container_cards_horizontal">
                    <CardLog icon={tray} title="Bandeja" val="30"/>
                    <CardLog icon={cycle} title="Tempo Total de Ciclo" val="30"/>
                    <CardLog icon={time} title="Tempo de Minutos por Bandeja" val="30"/>
                    <CardLog icon={memory}  title="Tempo por Memória" val="30"/>
                    <CardLog icon={note} title="Memórias com Nota Abaixo de A" val="30"/>
                    <CardLog icon={glass} title="Memórias com Erro na Inspeção" val="30"/>
                    <CardLog icon={camera} title="Número de Erro na Câmera" val="30"/>
                    <CardLog icon={error} title="Memória com Erro (Index)" val="30" style={styleCard}/>
                    <CardLog icon={map} title="Posição de Refugo e Tipo de Erro" val="30" style={styleCard}/>
                </div>
            </main>
        </>
    )
}
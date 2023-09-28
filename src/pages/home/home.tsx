import Menu from "../../components/menu/menu";
import "./style.css"
import {AiFillInfoCircle} from "react-icons/ai"
import { useState,useEffect, ChangeEvent } from 'react'
import {motion} from "framer-motion"
import io, { Socket }from "socket.io-client"
import Status from "../../components/status/status";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/loading/loading";
import BasicButton from "../../components/basiclButton/basicButton";
export default function Home(){
    const [status, SetStatus] = useState([
        {
            connection : true,
            name : "clp",
            port: "127.0.0.10",
        },
        {
            connection : true,
            name : "all",
            port: "127.0.0.12",
        },
        {
            connection : true,
            name : "sr200",
            port: "127.0.0.14",
        },
        {
            connection : true,
            name : "loader1",
            port: "127.0.0.16",
        },
        {
            connection : false,
            name : "loader2",
            port: "127.0.0.18",
        }
    ])
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const newSocket = io('http://192.168.1.63:12345');
        setSocket(socket);
        console.log(newSocket);
    });
    const [startProcess, SetStartProcess] = useState(true);
    const [statusProcess, SetStatusProcess] = useState({
        log:"Executando: 20/50 ...",
        idProcess: "succefull",
    });
    const navigate = useNavigate()
    const toNavigate = ()=> {
        navigate('/conf')
    }
    return(
        <>
            <Menu/>
            <main className="container_page">
                <div className="container_box_status">
                    <div className="container_menu_box_status">
                        <h1>
                            iLabeling
                        </h1>
                    </div>
                    <div className="content_box_status">
                        <ul className="list_status">
                            {status.map((statusResponse, index)=>(
                                <Status 
                                key={index}
                                connection = {statusResponse.connection}
                                name = {statusResponse.name}
                                port = {statusResponse.port}
                                />  
                            ))}
                        </ul>
                        <div className="container_status_process"
                        style={{
                            backgroundColor:
                            statusProcess.idProcess === "processing"
                            ? "rgb(255, 238, 178)"
                            : statusProcess.idProcess === "error"
                            ? "rgb(255, 178, 178)"
                            : statusProcess.idProcess === "succefull"
                            ? "rgb(188, 255, 178)"
                            : "rgb(255,255,255)"
                        }}>
                            {
                                startProcess? 
                                <div className="content_status_process">
                                    <div className="container_first_informations">
                                        <p className="status_process">
                                            {statusProcess.log}
                                        </p>
                                    </div>
                                    <div className="container_second_informations">
                                        <Link to="/logs" className="links_process">
                                            Log do Processo
                                        </Link>
                                        {statusProcess.idProcess === "succefull" ? 
                                        <Link to="/end" 
                                        className="links_process"
                                        >
                                            Detalhes do Processo
                                        </Link>:
                                        <></>
                                        }
                                        
                                    </div>
                                </div> 
                                :
                                <div className="container_idle">
                                    <p className="text_idle">
                                        Em espera...
                                    </p>
                                    <Loading/>
                                </div>
                            } 
                        </div>
                    </div>
                    <div className="container_btn_setup">
                        <BasicButton text="Montar Setup" functionButton={toNavigate}/>  
                    </div>
                </div>
            </main>
        </>
    )
}
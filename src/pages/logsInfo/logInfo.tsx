import {useState} from "react"
import Menu from "../../components/menu/menu";
import "./style.css"
export default function LogsInfo(){
    const nome = "dkdkkdk \nkdkdkdk\n idididid";
    const [log, setLog] = useState();
    return(
        <>
            <Menu/>
            <main className="container_page_logs">
                <h1 className="title_page">
                    Informações de Logs : 
                </h1>
                <div className="container_logs">
                    <p className="content_logs">
                        {nome}
                    </p> 
                </div>
            </main>
        </>
    )
}
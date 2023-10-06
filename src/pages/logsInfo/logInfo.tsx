import {useState,useEffect} from "react"
import Menu from "../../components/menu/menu";
import "./style.css"
interface Log{
    inspection: string;
    labeling: string;
    validateLabel: string;
    leaveMemomry: string;
    errorMemory:string;
    takeMemory: string;
    path: string;
}
interface Val{
    key:[]
}
export default function LogsInfo(){
    const [logs, setLog] = useState<Array<Log>>([]);
    const [val,setVal] =  useState<Val[]>([]);
    useEffect(() => {
        const eventSource = new EventSource('http://127.0.0.1:5000/sse/log');
        eventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            setLog(parsedData);
        };
        eventSource.onerror = (error) => {
            console.error('Erro na conexão SSE:', error);
            eventSource.close();
        };
        return () => {
            eventSource.close();
        };
    }, []);
    const openNewTab = (e:string) => {
        const newTab = window.open('', '_blank');
        if (newTab) {
            newTab.document.write(
              `<html><body>
              <img src="${e}" alt="Imagem Local" width= 600/>
              </body></html>`
            );
        };
    }
    return(
        <>
            <Menu/>
            <main className="container_page_logs">
                <h1 className="title_page_logs">
                    Informações de Logs
                </h1>
                <div className="container_logs">
                {logs.map((log, index)=>(
                    <>
                        <hr color=" rgb(64, 64, 216)">
                        </hr>
                        <div className="container_infs_logs">
                            <p className="content_logs" key={index+".1"}>
                            {log.inspection}
                            </p> 
                            <p className="content_logs" key={index+".2"}>
                                {log.labeling}
                            </p> 
                            <p className="content_logs" key={index+".3"}>
                                {log.validateLabel}
                            </p> 
                            <p className="content_logs" key={index+".4"}>
                                {log.leaveMemomry}
                            </p>
                            <p className="content_logs" key={index+".5"}>
                                {log.errorMemory}
                            </p> 
                            <p className="content_logs" key={index+".5"}>
                                {log.takeMemory}
                            </p> 
                            <a
                            href="#" 
                            className="content_logs" 
                            key={index+".5"}
                            onClick={()=>openNewTab(log.path)}
                            style={{marginBottom:"10%"}}>
                                {log.path}
                            </a> 
                            
                        </div>
                    </>
                   
                ))}
                    
                </div>
            </main>
        </>
    )
}
import {useState,useEffect} from "react"
import Menu from "../../components/menu/menu";
import "./style.css"
interface Log{
    inspection: string;
    labeling: string;
    validateLabel: string;
    leaveMemomry: string;
    errorMemory:string;
    path: string;
}
export default function LogsInfo(){
    const [logs, setLog] = useState<Array<Log>>([]);
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
                            {log.path}
                        </p> 
                    </>
                   
                ))}
                    
                </div>
            </main>
        </>
    )
}
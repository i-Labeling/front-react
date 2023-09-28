import React, { useState, useEffect } from 'react';

export default function Test(){
    const [sseValue, setSseValue] = useState([{}]);
    useEffect(() => {
      const eventSource = new EventSource('http://127.0.0.1:5000/sse');
  
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setSseValue(parsedData);
      };
  
      eventSource.onerror = (error) => {
        console.error('Erro na conexão SSE:', error);
        eventSource.close();
      };
  
      // Certifique-se de fechar a conexão quando o componente é desmontado
      return () => {
        eventSource.close();
      };
    }, []);
    return(
        <>
            <div>
                <h1>Eventos SSE</h1>
                {sseValue.map((s)=>
                    <p>
                        {s.name+s.port}
                    </p>
                )}
            </div>
        </>
    )
}
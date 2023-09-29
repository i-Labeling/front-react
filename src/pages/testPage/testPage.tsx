import React, { useState, useEffect } from 'react';

export default function Test(){
    const [sseValue, setSseValue] = useState([{}]);
    useEffect(() => {
      const eventSource = new EventSource('http://127.0.0.1:5000/sse/statusProcess');
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setSseValue(parsedData);
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
            <div>
                <h1>Eventos SSE</h1>
                    <p>
                        {sseValue.log+sseValue.idProcess}
                    </p>
            </div>
        </>
    )
}
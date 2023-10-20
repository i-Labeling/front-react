from flask import Flask, Response
from flask_cors import CORS
import time
import json

app = Flask(__name__)

CORS(app, resources={r"/sse": {"origins": "http://localhost:5173"}})

@app.route('/sse')
def sse():
    def event_stream():
        while True:
            with open('data.json', 'r') as file:
                new_data = json.load(file) 
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)  
    return Response(event_stream(), content_type='text/event-stream')

app.run()
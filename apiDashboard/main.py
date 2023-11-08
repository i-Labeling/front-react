# from flask import Flask
# from data import Devices

# app = Flask(__name__)

# @app.route('/status', methods = ['GET'])
# def get_carros():
#     return Devices

# app.run()
#############################################################################
from flask import Flask, Response, request
import os
import json
import time
from flask_cors import CORS
import sys
sys.path.append(
    "C/Users/walfr/OneDrive/Ambiente de Trabalho/iLabeling_conexao/new_front_react/front-end_20_10_23/front-react/apiDashboard/")


app = Flask(__name__)

CORS(app)


@app.route('/post', methods=['POST'])
def post_example():
    if request.method == 'POST':
        datas = request.json  # Suponha que os dados sejam enviados como JSON
        # Verifique se o arquivo JSON já existe
        if not os.path.exists('dados.json'):
            # Se não existir, crie um arquivo vazio
            with open('dados.json', 'w') as arquivo_json:
                json.dump({}, arquivo_json)  # Cria um objeto JSON vazio

        # Abra o arquivo JSON existente
        with open('dados.json', 'r') as arquivo_json:
            dados_existentes = json.load(arquivo_json)
        dados_existentes.update(datas)

        # Escreva os dados atualizados de volta para o arquivo JSON
        with open('dados.json', 'w') as arquivo_json:
            json.dump(dados_existentes, arquivo_json)

        resultado = {"mensagem": "Dados recebidos com sucesso", "dados": datas}
        return resultado, 200  # 200 indica sucesso
    else:
        return "Método não permitido", 405


@app.route('/', methods=['GET'])
def get_end_process():
    data = {
        'tray': "0",
        'totalCycleTime': "0",
        'minutesPerTray': "0",
        'timePerMemory': "0",
        'creamBelowA': "0",
        'inspectionErrors': "0",
        'cameraError': "0",
        'indexMemoryError': "0",
        'positionAndError': "0",
        'order': "primeira ordem"
    }
    return data

# @app.route('/sse')
# def sse():
#     def event_stream():
#         while True:
#             with open('data.json', 'r') as file:
#                 new_data = json.load(file)

#             yield f"data:{json.dumps(new_data)}\n\n"
#             time.sleep(1)
#     return Response(event_stream(), content_type='text/event-stream')
# app.run()
##########################################################################


@app.route('/sse/statusDevice')
def status_device():
    def event_stream():
        while True:
            with open('dataDevice.json', 'r') as file:
                new_data = json.load(file)
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')


@app.route('/sse/statusProcess')
def status_process():
    def event_stream():
        while True:
            with open('dataProcess.json', 'r') as file:
                new_data = json.load(file)
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')


@app.route('/sse/log')
def log():
    def event_stream():
        while True:
            with open('log.json', 'r') as file:
                new_data = json.load(file)
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')


app.run()
####################################################################################

# from flask import Flask, Response
# from flask_cors import CORS
# import time
# import json

# app = Flask(__name__)

# CORS(app, resources={r"/sse": {"origins": "http://localhost:5173"}})


# @app.route('/sse')
# def sse():
#     def event_stream():
#         while True:
#             with open('data.json', 'r') as file:
#                 new_data = json.load(file)

#             yield f"data:{json.dumps(new_data)}\n\n"
#             time.sleep(1)
#     return Response(event_stream(), content_type='application/json')

# app.run()

from flask import Flask, jsonify, request, Response
import psycopg2
import requests
from psycopg2 import extras
import json
from flask_cors import CORS
import time
import os
import sys
import xml.etree.ElementTree as ET
import dotenv
import xmltodict 


# PROGRAMA PRINCIPAL



dotenv.load_dotenv()
sys.path.append("C:/Users/svcman.d20155/Documents/develope/front-react/apiDashboard/")
global url
url = "C:/Users/svcman.d20155/Documents/develope/front-react/apiDashboard/" #os.environ["API_DASHBOARD"]
 

app = Flask(__name__)
CORS(app, origins="*")
connection = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="2023",
    host="localhost",
    port="5432"
)
# Função para buscar os dados mais recentes da tabela info_arq


def get_latest_data_from_postgres():
   # try:
    # Conecta-se ao banco de dados PostgreSQL

    cur = connection.cursor()

    # Executa a consulta SQL para selecionar os dados mais recentes da tabela "info_arq"
    cur.execute("SELECT * FROM info_arq ORDER BY data_insercao DESC LIMIT 1")
    resultado = list(cur.fetchone())  # .fetchone()
    # Fecha a conexão com o banco de dados

    if resultado:
        # Crie um dicionário com as chaves correspondentes às colunas e atribua os valores
        data_dict = {
            "id": str(resultado[0]),
            "customer": str(resultado[1]),
            "tray": str(resultado[2]),
            "totalCycleTime": float(str(resultado[3]).replace("Decimal('')", "")),
            "minutesPerTray": str(resultado[4]),
            "timePerMemory": float(str(resultado[5]).replace("Decimal('')", "")),
            "creamBelowA": int(resultado[6]),
            "indexMemoryError": str(resultado[7]).replace("[", " ").replace("]", " "),
            "inspectionErrors": str(resultado[8]).replace("[", " ").replace("]", " "),
            "cameraError": int(resultado[9]),
            "positionAndError": str(resultado[10]).replace("[", " ").replace("]", " "),
            "order": str(resultado[11])
            # Formato ISO da data

            # 'tray':"0",
            # 'totalCycleTime': "0",
            # 'minutesPerTray': "0",
            # 'timePerMemory': "0",
            # 'creamBelowA':"0",
            # 'inspectionErrors': "0",
            # 'cameraError': "0",
            # 'indexMemoryError': "0",
            # 'positionAndError': "0",
            # 'order': "primeira ordem"
        }
        return data_dict
    else:

        return {}

    # except Exception as e:
     #   return {"erro": str(e)}


@app.route('/', methods=['GET'])
def index():
    # Obtém os dados mais recentes do PostgreSQL em forma de dicionário
    data = get_latest_data_from_postgres()
    return data  # Retorna os dados como um JSON


@app.route('/post', methods=['POST'])
def post_example():
    if request.method == 'POST':
        datas = request.json  # Suponha que os dados sejam enviados como JSON
        # Verifique se o arquivo JSON já existe
        if not os.path.exists('dados.json'):
            # Se não existir, crie um arquivo vazio
            with open(url+'dados.json', 'w') as arquivo_json:
                json.dump({}, arquivo_json)  # Cria um objeto JSON vazio
        # print("to aqui")
        # Abra o arquivo JSON existente
        with open(url+'dados.json', 'r') as arquivo_json:
            dados_existentes = json.load(arquivo_json)
            # print(dados_existentes)

        # Escreva os dados atualizados de volta para o arquivo JSON
        with open(url+'dados.json', 'w') as arquivo_json:
            # print("to aqui 2")
            json.dump(datas, arquivo_json)
            print(datas)
       # att(datas)
        resultado = {"mensagem": "Dados recebidos com sucesso", "dados": datas}
        return resultado, 200  # 200 indica sucesso
    else:
        return "Método não permitido", 405
    

@app.route('/costumer', methods=['GET'])
def consumir_api():
    api_url = 'http://brzwiptrackws-qa.smartm.internal/WebServices/iLabelling.asmx?op=GetListOfCustomers'  

    try:
        # Enviar uma solicitação POST para a API
        response = requests.post(api_url, headers={'Content-Type': 'text/xml'})

        print('Response',response)

        # Verificar se a solicitação foi bem-sucedida (código de status 200)
        if response.status_code == 200:
            # Converter o XML para um dicionário Python
            xml_dict = xmltodict.parse(response.text)

            # Extrair apenas as informações sob a tag "Cliente"
            clientes_info = xml_dict['soap:Envelope']['soap:Body']['GetListOfCustomersResponse']['GetListOfCustomersResult']['SetupiLabelling']
            clientes_list = []

            # Iterar sobre as informações de cada cliente
            for cliente_info in clientes_info:
                cliente_data = {
                    'name': cliente_info['Cliente'],
                    #'PN_Smart': cliente_info['PN_Smart'],
                    #'PN_Cliente': cliente_info['PN_Cliente']
                }
                clientes_list.append(cliente_data)

            # Converter a lista de clientes para JSON
            data = json.dumps(clientes_list, indent=2)

            # Retornar os dados JSON
            return Response(response=data, status=200, mimetype="application/json")
        else:
            # Se a solicitação não for bem-sucedida, retornar um erro
            return jsonify({'error': f'Código de status da API: {response.status_code}'}), 500

    except Exception as e:
        # Se ocorrer uma exceção, retornar um erro
        return jsonify({'error': str(e)}), 500

# @app.route('/costumer', methods=['GET'])
# def get_costumer():
#     data = [{
#             "name": "IBM",
#             },
#             {
#             "name": "DELL INC.",
#             },
#             {
#             "name": "SUPERA",
#             },
#             {
#              "name":"AMD"
#             },
#              {
#              "name":"FLEXTRONICS"
#             },
#              {
#              "name":"WINTRONIC"
#             }
#             ]
#     return data 
    



@app.route('/sse/statusDevice', methods=['GET'])
def status_device():
    def event_stream():
        while True:
            with open(url+'dataDevice.json', 'r') as file:
                new_data = json.load(file)
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')


@app.route('/sse/statusProcess')
def status_process():
    def event_stream():
        while True:
            with open(url+'dataProcess.json', 'r') as file:
                new_data = json.load(file)
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')


# @app.route('/sse/userAuthIHM')
# def status_device():
#     def event_stream():
#         while True:
#             with open('dataUser.json', 'r') as file:
#                 new_data = json.load(file)
#             yield f"data:{json.dumps(new_data)}\n\n"
#             time.sleep(1)
#     return Response(event_stream(), content_type='text/event-stream')


@app.route('/sse/log')
def log():
    def event_stream():
        while True:
            with open(url+'log.json', 'r') as file:
                new_data = json.load(file)
            yield f"data:{json.dumps(new_data)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')


@app.route('/dashboard/graph1', methods=['GET'])
def dash_hourxunits():
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date': date,
        'typeM': typeM,
    }
    try:
        connection = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="2023",
            host="localhost",
            port="5432"
        )
        cursor = connection.cursor(cursor_factory=extras.DictCursor)

        cursor.execute("SELECT SUM(CAST(quant_memory AS INTEGER)) AS quantity, CAST(EXTRACT(HOUR FROM data_insercao) AS VARCHAR) AS hour, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'sodimm') AS sodimm, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'udimm') AS udimm FROM info_arq WHERE data_insercao::DATE = %s AND customer =  ANY(%s) AND type_memory = ANY(%s) GROUP BY EXTRACT(HOUR FROM data_insercao),customer",
                       (dictSelect['date'], dictSelect['costumer'], dictSelect['typeM'],))
        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        return jsonify(result_dicts)
    except Exception as e:
        return jsonify({'error': str(e)})


# Rota do grafico unidade x day
@app.route('/dashboard/graph2', methods=['GET'])
def dash_dayxunits():
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date': date,
        'typeM': typeM,
    }
    try:
        cursor = connection.cursor(cursor_factory=extras.DictCursor)

        # EXTRACT(EPOCH FROM coluna_timestamp) = seu_valor_inteiro
        # cursor.execute("SELECT CAST(EXTRACT(HOUR FROM data_insercao) AS VARCHAR)  AS hr, COUNT(DISTINCT CASE WHEN type_memory = 'sodimm' THEN quant_memory END) AS count_distinct_SODIMM, COUNT(DISTINCT CASE WHEN type_memory = 'udimm' THEN quant_memory END) AS count_distinct_UDIMM FROM info_arq WHERE data_insercao::DATE = %s AND customer =  ANY(%s) and type_memory = ANY(%s) GROUP BY EXTRACT(HOUR FROM data_insercao)",(dictSelect['date'],dictSelect['costumer'],dictSelect['typeM'],))
        #
        cursor.execute("SELECT SUM(CAST(quant_memory AS INTEGER)) AS quantity, TO_CHAR(DATE_TRUNC('day', data_insercao), 'DD-MM-YYYY') AS day, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'sodimm') AS sodimm, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'udimm') AS udimm FROM info_arq WHERE data_insercao::DATE >= (DATE_TRUNC('day', %s::DATE) - INTERVAL '6 days') AND data_insercao::DATE <= %s AND customer =  ANY(%s) AND type_memory = ANY(%s) GROUP BY DATE_TRUNC('day', data_insercao)",
                       (dictSelect['date'], dictSelect['date'], dictSelect['costumer'], dictSelect['typeM'],))
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

        # Construa uma lista de dicionários
        result_dicts = [dict(zip(column_names, row)) for row in result]
        # Retorne os resultados como um objeto JSON
        return jsonify(result_dicts)

    except Exception as e:
        return jsonify({'error': str(e)})


# Rota dos cartões/labels de processo
@app.route('/dashboard/kpis', methods=['GET'])
def cards_dash():
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date': date,
        'typeM': typeM,
    }

    try:

        cursor = connection.cursor(cursor_factory=extras.DictCursor)
        # EXTRACT(EPOCH FROM coluna_timestamp) = seu_valor_inteiro
        cursor.execute("SELECT SUM(CAST(quant_memory AS INTEGER)) - (SUM(CAST(cam_erro AS INTEGER)) + SUM(CAST(mem_fail AS INTEGER))) AS labelled, SUM(CAST(bandeja AS integer)) AS trays, SUM(mem_fail) as reworks FROM info_arq WHERE data_insercao::DATE = %s AND customer =  ANY(%s) and type_memory = ANY(%s)",
                       (dictSelect['date'], dictSelect['costumer'], dictSelect['typeM'],))

        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]

        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]

        cursor.close()
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})

# Rota ficha de erros


@app.route('/dashboard/erros', methods=['GET'])
def error_states():
    typeM = []
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date': date,
        'typeM': typeM,
    }
    try:

        cursor = connection.cursor(cursor_factory=extras.DictCursor)
        cursor.execute("SELECT SUM(CAST(cam_erro AS INTEGER)) AS cam_erro,  SUM(CAST(mem_fail AS INTEGER)) AS mem_fail FROM info_arq WHERE data_insercao::DATE = %s AND customer =  ANY(%s) and type_memory = ANY(%s)",
                       (dictSelect['date'], dictSelect['costumer'], dictSelect['typeM'],))
        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]
        list_err = []
        for key in result:
            formatted_error = {}
            formatted_error['erro'] = f"{key} {result[key]}"
            list_err.append(formatted_error)
        return jsonify(list_err)
    except Exception as e:
        return jsonify({'error': str(e)})
    # cur.close()
    # connection.close()


if __name__ == '__main__':
    app.run(debug=True)

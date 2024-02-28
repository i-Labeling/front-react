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
from datetime import datetime, timedelta


# PROGRAMA PRINCIPAL



dotenv.load_dotenv()
sys.path.append(os.environ["API_DASHBOARD"])
global url
url = os.environ["API_DASHBOARD"]
 

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
        memoIndexErrors = str(resultado[7])
        inspectionErrors = str(resultado[8])
        positionErrors = str(resultado[10])
        if(inspectionErrors != '[]'):
            inspectionResult = inspectionErrors.split(',')
        else: 
            inspectionResult = '0'

        if(positionErrors != '[]'):
            positionAndErrorResult = positionErrors.split(',')
        else: 
            positionAndErrorResult = '0'

        if(memoIndexErrors != '[]'):
            memoIndexErrorResult = memoIndexErrors.split(',')
        else: 
            memoIndexErrorResult = '0'
        
        data_dict = {
            "id": str(resultado[0]),
            "customer": str(resultado[1]),
            "tray": str(resultado[2]),
            "totalCycleTime": float(str(resultado[3]).replace("Decimal('')", "")),
            "minutesPerTray": str(resultado[4]),
            "timePerMemory": float(str(resultado[5]).replace("Decimal('')", "")),
            "creamBelowA": int(resultado[6]),
            "indexMemoryError": memoIndexErrorResult,
            "inspectionErrors": inspectionResult,
            "cameraError": int(resultado[9]),
            "positionAndError": positionAndErrorResult,
            "order": str(resultado[11])
        }
        return data_dict
    else:

        return {}

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
        # Abra o arquivo JSON existente
        with open(url+'dados.json', 'r') as arquivo_json:
            dados_existentes = json.load(arquivo_json)

        # Escreva os dados atualizados de volta para o arquivo JSON
        with open(url+'dados.json', 'w') as arquivo_json:
            json.dump(datas, arquivo_json)
            print(datas)
       # att(datas)
        resultado = {"mensagem": "Dados recebidos com sucesso", "dados": datas}
        return resultado, 200  # 200 indica sucesso
    else:
        return "Método não permitido", 405
    

@app.route('/costumer', methods=['GET'])
def consumir_api():
    #api_url = 'http://brzwiptrackws-qa.smartm.internal/WebServices/iLabelling.asmx?op=GetListOfCustomers/'
    # api_url = "http://127.0.0.1:5001/WebServices/get_list_of_customers"
    api_url = "http://brzwiptrackws-qa.smartm.internal/WebServices/iLabelling.asmx?op=GetListOfCustomers/"
    payload = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <GetListOfCustomers xmlns=\"http://tempuri.org/\" />\r\n  </soap:Body>\r\n</soap:Envelope>"
    headers = {
        'Content-Type': 'text/xml'
    }
    try:

        # Enviar uma solicitação POST para a API
        response = requests.request("POST", api_url, headers=headers, data=payload)
        # response = requests.post(api_url)

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
                    'PN_Smart': cliente_info['PN_Smart'],
                    'PN_Cliente': cliente_info['PN_Cliente']
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


@app.route('/dashboard/graph1', methods=['POST'])
def dash_graph1():
    try:
        datas = request.json
        cur = connection.cursor()

        costumer = datas['costumer']
        date = datas['date']
        typeM = datas['typeM']

        query = "SELECT * FROM info_arq WHERE 1=1"

        if costumer and costumer[0] != 'All':
            query += f" AND customer = '{costumer[0]}'"

        if typeM and  typeM[0] != 'All':
            query += f" AND type_memory = '{typeM[0]}'"
    
        if date:
            # Utiliza o formato correto para a comparação de datas
            query += f" AND data_insercao::DATE = '{date}'::DATE"

        cur.execute(query)
        resultados = cur.fetchall()

        cur.close()

        data_list = []

        for resultado in resultados:
            data_dict = {
                "customer": str(resultado[1]),
                "order": str(resultado[11]),
                "typeMemory": str(resultado[12]),
                "quantMemory": int(resultado[13]),
            }
            data_list.append(data_dict)
            
        return jsonify(data_list)

    except Exception as e:
        return {"erro": str(e)}


@app.route('/dashboard/graph2', methods=['POST'])
def dash_graph2():
    try:
        datas = request.json
        cur = connection.cursor()

        costumer = datas['costumer']
        date = datas['date']
        typeM = datas['typeM']

        query = "SELECT * FROM info_arq WHERE 1=1"

        if costumer and costumer[0] != 'All':
            query += f" AND customer = '{costumer[0]}'"

        if typeM and  typeM[0] != 'All':
            query += f" AND type_memory = '{typeM[0]}'"

        if date:
            # Utiliza o formato correto para a comparação de datas
            start_date = (datetime.strptime(date, '%Y-%m-%d') - timedelta(days=7)).strftime('%Y-%m-%d')
            query += f" AND data_insercao::DATE BETWEEN '{start_date}'::DATE AND '{date}'::DATE"

        cur.execute(query)
        resultados = cur.fetchall()

        cur.close()

        data_list = []

        for resultado in resultados:
            data_dict = {
                "customer": str(resultado[1]),
                "order": str(resultado[11]),
                "typeMemory": str(resultado[12]),
                "quantMemory": int(resultado[13]),
            }
            data_list.append(data_dict)

        start_date = datetime.strptime(date, '%Y-%m-%d') - timedelta(days=7)
        end_date = datetime.strptime(date, '%Y-%m-%d')
        dates_between = [(start_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range((end_date - start_date).days + 1)]

        memory_totals = {date: {'sodimm': 0, 'udimm': 0, 'quantity': 0, 'dayOfWeek': ""} for date in dates_between}

        for data in data_list:
            order_date = datetime.strptime(data['order'][:10], '%Y-%m-%d')
            memory_totals[order_date.strftime('%Y-%m-%d')]['quantity'] += data['quantMemory']
            if data['typeMemory'] == 'sodimm':
                memory_totals[order_date.strftime('%Y-%m-%d')]['sodimm'] += data['quantMemory']
            elif data['typeMemory'] == 'udimm':
                memory_totals[order_date.strftime('%Y-%m-%d')]['udimm'] += data['quantMemory']

        # Converte o dicionário para uma lista de objetos
        result = [{'date': key, 'sodimm': value['sodimm'], 'udimm': value['udimm'], 'quantity': value['quantity']} for key, value in memory_totals.items()]
            
        return jsonify(result)

    except Exception as e:
        return {"erro": str(e)}
    
@app.route('/dashboard/kpis', methods=['POST'])
def dash_kpis():
    try:
        datas = request.json
        cur = connection.cursor()

        costumer = datas['costumer']
        date = datas['date']
        typeM = datas['typeM']

        query = "SELECT SUM(CAST(quant_memory AS INTEGER)) - (SUM(CAST(cam_erro AS INTEGER)) + SUM(CAST(mem_fail AS INTEGER))) AS labelled, SUM(CAST(bandeja AS integer)) AS trays, SUM(mem_fail) as reworks FROM info_arq WHERE 1=1"

        if costumer and costumer[0] != 'All':
            query += f" AND customer = '{costumer[0]}'"

        if typeM and typeM[0] != 'All':
            query += f" AND type_memory = '{typeM[0]}'"

        if date:
            # Utiliza o formato correto para a comparação de datas
            query += f" AND data_insercao::DATE = '{date}'::DATE"

        cur.execute(query)
        result = cur.fetchall()

        column_names = [desc[0] for desc in cur.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]

        cur.close()
        
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/dashboard/erros', methods=['POST'])
def dash_error_states():
    try:
        datas = request.json
        cur = connection.cursor()

        costumer = datas['costumer']
        date = datas['date']
        typeM = datas['typeM']

        query = "SELECT SUM(CAST(cam_erro AS INTEGER)) AS cam_erro, SUM(CAST(mem_fail AS INTEGER)) AS mem_fail FROM info_arq WHERE 1=1"

        if costumer and costumer[0] != 'All':
            query += f" AND customer = '{costumer[0]}'"

        if typeM and typeM[0] != 'All':
            query += f" AND type_memory = '{typeM[0]}'"

        if date:
            # Utiliza o formato correto para a comparação de datas
            query += f" AND data_insercao::DATE = '{date}'::DATE"

        cur.execute(query)
        result = cur.fetchall()

        column_names = [desc[0] for desc in cur.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]
        
        list_err = []
        for key in result:
            formatted_error = {}
            formatted_error['erro'] = f"{key} {result[key]}"
            list_err.append(formatted_error)

        cur.close()
        
        return jsonify(list_err)

    except Exception as e:
        return jsonify({'error': str(e)})
    
def get_all_data_from_info_arq():
    try:
        # Conecta-se ao banco de dados PostgreSQL
        cur = connection.cursor()

        # Executa a consulta SQL para selecionar todos os dados da tabela "info_arq"
        cur.execute("SELECT * FROM info_arq")
        resultados = cur.fetchall()

        # Fecha a conexão com o banco de dados
        cur.close()

        # Lista para armazenar todos os objetos resultantes
        data_list = []

        for resultado in resultados:
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
                "order": str(resultado[11]),
                "typeMemory": str(resultado[12]),
                "quantMemory":int(resultado[13]),

                # Formato ISO da data
            }
            data_list.append(data_dict)

        return data_list

    except Exception as e:
        return {"erro": str(e)}

@app.route('/get_all_data_info_arq', methods=['GET'])
def test():
    data = get_all_data_from_info_arq()
    return jsonify(data) 

@app.route('/usersIHM', methods=['POST'])
def getUsersIhm():
    if request.method == 'POST':
        datas = request.json
        if not os.path.exists('dataIHMUsers.json'):
            # Se não existir, crie um arquivo vazio
            with open(url+'dataIHMUsers.json', 'w') as arquivo_json:
                json.dump({}, arquivo_json)

        with open(url+'dataIHMUsers.json', 'r') as arquivo_json:
            dados_existentes = json.load(arquivo_json)
        with open(url+'dataIHMUsers.json', 'w') as arquivo_json:
            json.dump(datas, arquivo_json)
            print(datas)
        resultado = {"mensagem": "Dados recebidos com sucesso", "dados": datas}
        return resultado, 200  # 200 indica sucesso
    else:
        return "Método não permitido", 405

@app.route('/report-kpis', methods=['POST']) 
def report_kpis():
    try:
        datas = request.json
        cur = connection.cursor()

        customer = datas['costumer']
        typeM = datas['typeM']
        dateInit =  datas['startDate']
        endDate =  datas['endDate']
        order = datas['OSnumber']


        query = "SELECT SUM(CAST(quant_memory AS INTEGER)) - (SUM(CAST(cam_erro AS INTEGER)) + SUM(CAST(mem_fail AS INTEGER))) AS labelled, SUM(CAST(bandeja AS integer)) AS trays, SUM(mem_fail) as reworks FROM info_arq WHERE 1=1"

        if customer and customer[0] != 'All':
           query +=f" AND customer = '{customer[0]}'"
        if typeM and  typeM[0] != 'All':
           query += f" AND type_memory = '{typeM[0]}'"
        if dateInit and endDate:
            query += f" AND data_insercao::DATE BETWEEN '{dateInit}'::DATE AND '{endDate}'::DATE"
        if order  and order[0] != 'All':
            query += f" AND  service_order = '{order[0]}'"

        cur.execute(query)
        result = cur.fetchall()

        column_names = [desc[0] for desc in cur.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]

        cur.close()
        
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/report', methods=['POST'])
def report_info():
    try:
        datas = request.json
        cur = connection.cursor()

        dateInit =  datas['startDate']
        endDate =  datas['endDate']
        order = datas['OSnumber']

        query="SELECT * FROM info_arq WHERE 1=1"

        if dateInit and endDate:
            query += f" AND data_insercao::DATE BETWEEN '{dateInit}'::DATE AND '{endDate}'::DATE"
        if order  and order[0] != 'All':
            query += f" AND  service_order = '{order[0]}'"


        cur.execute(query)
        resultados = cur.fetchall()

        cur.close()

        data_list = []

        for resultado in resultados:
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
                "order": str(resultado[11]),
                "typeMemory": str(resultado[12]),
                "quantMemory":int(resultado[13]),
                "serviceOrder": str(resultado[14]),
            }
            data_list.append(data_dict)

        return jsonify(data_list)

    except Exception as e:
        return {"erro": str(e)}
    
@app.route('/report-os', methods=['GET'])
def report_os():
    try:
        cur = connection.cursor()

        query="SELECT service_order FROM info_arq WHERE 1=1"

        cur.execute(query)
        resultados = cur.fetchall()

        cur.close()

        data_list = []

        for resultado in resultados:
            data_dict = {
                "serviceOrder": str(resultado[0]),
            }
            data_list.append(data_dict)

        return jsonify(data_list)

    except Exception as e:
        return {"erro": str(e)}

@app.route('/report-end-of-process', methods=['POST']) 
def report_endOfProcess():
    data = request.json
    customer = data['costumer']
    typeM = data['typeM']
    dateInit =  data['startDate']
    endDate =  data['endDate']
    order = data['OSnumber']
   
    cur = connection.cursor()
    query = "SELECT * FROM info_arq WHERE 1=1"

    if customer and customer[0] != 'All':
        query += f" AND customer = '{customer[0]}'"
    if typeM and  typeM[0] != 'All':
        query += f" AND type_memory = '{typeM[0]}'"
    if dateInit and endDate:
        query += f" AND data_insercao::DATE BETWEEN '{dateInit}'::DATE AND '{endDate}'::DATE ORDER BY data_insercao DESC"
    if order  and order[0] != 'All':
        query += f" AND  service_order = '{order[0]}'"
    
    cur.execute(query)
    resultados = cur.fetchall()

    total_cycle_time_sum = 0
    total_trays_sum = 0
    minutes_per_tray_sum = 0
    time_per_memory_sum = 0
    mem_fail_sum = 0
    camera_error_sum = 0
    total_quant_memory = 0
    index_memory_error_count= 0
    inspection_errors_count = 0
    position_and_error_count = 0


    if resultados:
        num_rows = len(resultados)
        
        for resultado in resultados:
            total_trays_sum += int(resultado[2])
            total_cycle_time_sum += float(resultado[3])
            minutes_per_tray_sum += float(resultado[4])
            time_per_memory_sum += float(resultado[5])
            mem_fail_sum += int(resultado[6])
            camera_error_sum += int(resultado[9])
            total_quant_memory += int(resultado[13])
            index_memory_error_str = str(resultado[7])
            if index_memory_error_str.strip("[]"):
                index_memory_error_list = index_memory_error_str.strip("[]").split(", ")
                index_memory_error_count += len(index_memory_error_list)
            inspection_errors_str = str(resultado[8])
            if inspection_errors_str.strip("[]"):
                inspection_errors_list = inspection_errors_str.strip("[]").split(", ")
                inspection_errors_count += len(inspection_errors_list)
            position_and_error_str = str(resultado[10])
            if position_and_error_str.strip("[]"):
                position_and_error_list = position_and_error_str.strip("[]").split(", ")
                position_and_error_count += len(position_and_error_list)

        total_trays = total_trays_sum
        total_cycle_time_avg = round(total_cycle_time_sum / num_rows, 2)
        minutes_per_tray_avg = round(minutes_per_tray_sum / num_rows, 2)
        time_per_memory_avg = round(time_per_memory_sum / num_rows, 2)
        cream_below_a_avg = mem_fail_sum 
        camera_error_avg = camera_error_sum
        total_quant_memory_res = total_quant_memory
        total_inspection_errors = inspection_errors_count
        total_index_memory_errors = index_memory_error_count 
        total_scrap_position_errors = position_and_error_count

    else:
        total_trays = 0
        total_cycle_time_avg = 0
        minutes_per_tray_avg = 0
        time_per_memory_avg = 0
        cream_below_a_avg = 0
        camera_error_avg = 0
        total_quant_memory_res= 0
        total_inspection_errors = 0
        total_index_memory_errors = 0
        total_scrap_position_errors = 0

    data_dict = {
        "totalTrays": total_trays,
        "totalCycleTimeAverage": total_cycle_time_avg,
        "minutesPerTrayAverage": minutes_per_tray_avg,
        "timePerMemoryAverage": time_per_memory_avg,
        "memFailAverage": cream_below_a_avg,
        "totalCameraErrors": camera_error_avg,
        "totalMemories": total_quant_memory_res,
        "totalInspectionErrors": total_inspection_errors,
        "totalIndexMemoryErrors": total_index_memory_errors,
        "totalScrapPositionErrors": total_scrap_position_errors 
    }

    return jsonify(data_dict)
    
@app.route('/report-erros', methods=['POST'])
def report_error():
    try:
        datas = request.json
        cur = connection.cursor()

        costumer = datas['costumer']
        typeM = datas['typeM']
        dateInit =  datas['startDate']
        endDate =  datas['endDate']
        order = datas['OSnumber']

        query = "SELECT SUM(CAST(cam_erro AS INTEGER)) AS cam_erro, SUM(CAST(mem_fail AS INTEGER)) AS mem_fail FROM info_arq WHERE 1=1"

        if costumer and costumer[0] != 'All':
            query += f" AND customer = '{costumer[0]}'"

        if typeM and typeM[0] != 'All':
            query += f" AND type_memory = '{typeM[0]}'"

        if dateInit and endDate:
            query += f" AND data_insercao::DATE BETWEEN '{dateInit}'::DATE AND '{endDate}'::DATE"
        
        if order  and order[0] != 'All':
            query += f" AND  service_order = '{order[0]}'"

        cur.execute(query)
        result = cur.fetchall()

        column_names = [desc[0] for desc in cur.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]

        cur.close()
        
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

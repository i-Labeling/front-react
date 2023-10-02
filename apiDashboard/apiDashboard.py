
from flask import Flask, jsonify, Response,request
import psycopg2
from psycopg2 import extras
from flask_cors import CORS
import json
app = Flask(__name__)

db_params = {
    'host': 'localhost',  # O host é 'localhost' porque você está executando localmente
    'port': 1234,         # A porta é mapeada para 1234 no seu contêiner Docker
    'database': 'postgres',  # Nome do banco de dados
    'user': 'postgres',            # Nome de usuário do PostgreSQL
    'password': 'example'             # Senha do PostgreSQL
}

CORS(app)
@app.route('/dashboard/graph1', methods=['GET'])
def dash_hourxunits():
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date' : date,
        'typeM' : typeM,
    }
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor(cursor_factory=extras.DictCursor)
        cursor.execute("SELECT SUM(CAST(quant_memory AS INTEGER)) AS quantity, CAST(EXTRACT(HOUR FROM data_insercao) AS VARCHAR) AS hour, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'sodimm') AS sodimm,SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'udimm') AS udimm FROM info_arq WHERE data_insercao::DATE = %s AND cliente =  ANY(%s) AND type_memory = ANY(%s) GROUP BY EXTRACT(HOUR FROM data_insercao),cliente",(dictSelect['date'], dictSelect['costumer'], dictSelect['typeM'],))
        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        return jsonify(result_dicts)
    except Exception as e:
        return jsonify({'error': str(e)})


#Rota do grafico unidade x day
@app.route('/dashboard/graph2', methods=['GET'])
def dash_dayxunits():
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date' : date,
        'typeM' : typeM,
    }
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor(cursor_factory=extras.DictCursor)

        # EXTRACT(EPOCH FROM coluna_timestamp) = seu_valor_inteiro
        # cursor.execute("SELECT CAST(EXTRACT(HOUR FROM data_insercao) AS VARCHAR)  AS hr, COUNT(DISTINCT CASE WHEN type_memory = 'sodimm' THEN quant_memory END) AS count_distinct_SODIMM, COUNT(DISTINCT CASE WHEN type_memory = 'udimm' THEN quant_memory END) AS count_distinct_UDIMM FROM info_arq WHERE data_insercao::DATE = %s AND cliente =  ANY(%s) and type_memory = ANY(%s) GROUP BY EXTRACT(HOUR FROM data_insercao)",(dictSelect['date'],dictSelect['costumer'],dictSelect['typeM'],))
        # 
        cursor.execute("SELECT SUM(CAST(quant_memory AS INTEGER)) AS quantity, TO_CHAR(DATE_TRUNC('day', data_insercao), 'YYYY-MM-DD') AS day, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'sodimm') AS sodimm, SUM(CAST(quant_memory AS INTEGER)) FILTER (WHERE type_memory = 'udimm') AS udimm FROM info_arq WHERE data_insercao::DATE >= (DATE_TRUNC('day', %s::DATE) - INTERVAL '6 days') AND data_insercao::DATE <= %s AND cliente =  ANY(%s) AND type_memory = ANY(%s) GROUP BY DATE_TRUNC('day', data_insercao)",(dictSelect['date'],dictSelect['date'], dictSelect['costumer'], dictSelect['typeM'],))
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

        # Construa uma lista de dicionários
        result_dicts = [dict(zip(column_names, row)) for row in result]
        # Retorne os resultados como um objeto JSON
        return jsonify(result_dicts)

    except Exception as e:
        return jsonify({'error': str(e)})


#Rota dos cartões/labels de processo
@app.route('/dashboard/kpis', methods=['GET'])
def cards_dash():
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer': costumer,
        'date' : date,
        'typeM' : typeM,
    }
    
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor(cursor_factory=extras.DictCursor)
        # EXTRACT(EPOCH FROM coluna_timestamp) = seu_valor_inteiro
        cursor.execute("SELECT SUM(CAST(quant_memory AS INTEGER)) - (SUM(CAST(cam_erro AS INTEGER)) + SUM(CAST(mem_fail AS INTEGER))) AS labelled, SUM(CAST(bandeja AS integer)) AS trays, SUM(mem_fail) as reworks FROM info_arq WHERE data_insercao::DATE = %s AND cliente =  ANY(%s) and type_memory = ANY(%s)",(dictSelect['date'],dictSelect['costumer'],dictSelect['typeM'],))

        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]

        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]
        cursor.close()
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})
    
#Rota ficha de erros
@app.route('/dashboard/erros', methods=['GET'])
def error_states():
    typeM =[]
    costumer = request.args.getlist('costumer')
    date = request.args.get('date')
    typeM = request.args.getlist('typeM')
    dictSelect = {
        'costumer':costumer,
        'date' : date,
        'typeM' : typeM,
    }
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor(cursor_factory=extras.DictCursor)
        cursor.execute("SELECT SUM(CAST(cam_erro AS INTEGER)) AS cam_erro,  SUM(CAST(mem_fail AS INTEGER)) AS mem_fail FROM info_arq WHERE data_insercao::DATE = %s AND cliente =  ANY(%s) and type_memory = ANY(%s)",(dictSelect['date'],dictSelect['costumer'],dictSelect['typeM'],))
        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]
        result_dicts = [dict(zip(column_names, row)) for row in result]
        result = result_dicts[0]
        list_err = []
        for key in result:
            formatted_error={}
            formatted_error['erro'] = f"{key} {result[key]}"
            list_err.append(formatted_error)
        return jsonify(list_err)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/costumer', methods = ['GET'])
def get_costumer():
    data = [{
            "name": "FLEXTRONICS - IPG<",
            },
            {
            "name": "WINTRONIC",
            },
            {
            "name": "AMD",
            },
            ]
    return data


if __name__ == "__main__":
    app.run(debug=True)
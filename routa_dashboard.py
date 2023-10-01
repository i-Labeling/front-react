from flask import request
from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

# Configuração do banco de dados PostgreSQL
db_config = {
    'dbname': 'bd_ilabeling',
    'user': 'postgres',
    'password': 'admin',
    'host': 'localhost',  # Endereço do servidor PostgreSQL
    'port': '5432',       # Porta padrão do PostgreSQL
}






#Rota do grafico unidade x hora
@app.route('/dashboard/graph1', methods=['GET'])
def dash_hourxunits():
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
                                        
       # Defina os parâmetros de busca
              # Defina os parâmetros de busca
        datp = request.args.get('dateFilter')
        customerp = request.args.get('costumer')

#Substituir pelas colunas referentes quantidade e hora

        sql = """
        SELECT date_trunc('hour', data_insercao) as horas, SUM(CASE WHEN type_memory = 'Type Memory 1' THEN quant_memory ELSE 0 END) as qttipo1, SUM(CASE WHEN type_memory = 'Type Memory 2' THEN quant_memory ELSE 0 END) as qttipo2
        FROM info_arq                        
        WHERE 1=1
        GROUP BY horas"""

        params = []


        if customerp is not None:
            sql += " AND customer = ?"
            params.append(customerp)

        if datp is not None:
            sql += " AND dat = ?"
            params.append(datp)

        cursor.execute(sql, params)
        condicionalsql = cursor.fetch()
        
        for row in condicionalsql:
            print(row)

        if condicionalsql is not None:
            hour, sodinn, udinn = condicionalsql

            data = [{
                    "hour": hour,
                    "sodinn": sodinn,
                    "udinn": udinn,
                    }]
        else:
            data = {"error": "Nenhum dado encontrado"}

        cursor.close()
        conn.close()
        return jsonify(data)
# Faça algo com os resultados (neste caso, imprimir)

    
            # Retorne os resultados como um objeto JSON
        data = [
               
                    ]

        return data


    except Exception as e:
        return jsonify({'error': str(e)})


#Rota do grafico unidade x day
@app.route('/dashboard/graph2', methods=['GET'])
def dash_dayxunits():
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()                                   
       # Defina os parâmetros de busca
        typep = request.args.get('type')
        datp = request.args.get('dateFilter')
        clientp = request.args.get('costumer')

                        #Substituir pelas colunas referentes quantidade e data
        cursor.execute("SELECT SUM(unidades), day FROM info_arq WHERE type = %s AND Dat = %s AND client = %s GROUP BY outra_coluna", (typep, datp, clientp))

        
        results = cursor.fetchall()

        # Feche o cursor e a conexão
        cursor.close()
        conn.close()

        # Organize os resultados em listas separadas para 'Hour' e 'Units'
        day_values = [result[1] for result in results]
        units_values = [result[2] for result in results]

        # Retorne os resultados como um objeto JSON
        return jsonify({'Hour': day_values, 'Units': units_values})

    except Exception as e:
        return jsonify({'error': str(e)})


#Rota dos cartões/labels de processo
@app.route('/cards_kpi', methods=['GET'])
def cards_dash():
    try:
        
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()  
       
        # Defina os parâmetros de busca
        typep = request.args.get('type')
        datp = request.args.get('dateFilter')
        customerp = request.args.get('costumer')

        sql = "SELECT SUM(mem_fail), SUM(cam_erro), trunc(SUM(quant_memory)), SUM(CASE WHEN type_memory = 'Type Memory 1' THEN ceil(quant_memory/75) ELSE ceil(quant_memory/50) END) AS qtbandeja FROM info_arq WHERE 1=1"
        
        # Construa a consulta dinamicamente com base nos parâmetros
        params = []

        if typep is not None:
            sql += " AND type = ?"
            params.append(typep)

        if customerp is not None:
            sql += " AND customer = ?"
            params.append(customerp)

        if datp is not None:
            sql += " AND dat = ?"
            params.append(datp)

        cursor.execute(sql, params)
        condicionalsql = cursor.fetchone()
        if condicionalsql is not None:
            erro1, erro2, quant2, tray_w = condicionalsql

            data = {
                "to_rework": erro1 + erro2,  # Soma dos três erros
                "labelled": quant2 - erro1 - erro2, # Quantidade total - erros do
                "trays_worked": tray_w
            }
        else:
            data = {"error": "Nenhum dado encontrado"}

        cursor.close()
        conn.close()
        return jsonify(data)

    except Exception as e:
        print('teste')
        return jsonify({'error 2': str(e)})
    
#Rota ficha de erros
@app.route('/erros', methods=['GET'])
def error_states():
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        typep = request.args.get('type')
        datep = request.args.get('dateFilter')
        customerp = request.args.get('customer')

        sql = "SELECT SUM(cam_erro), SUM(mem_fail) FROM info_arq WHERE 1=1"

# Construa a consulta dinamicamente com base nos parâmetros
        params = []

        if typep is not None:
            sql += " AND type = ?"
            params.append(typep)

        if customerp is not None:
            sql += " AND customer = ?"
            params.append(customerp)

        if datep is not None:
            sql += " AND dat = ?"
            params.append(datep)

        # Execute a consulta parametrizada
        cursor.execute(sql, params)

        #cursor.execute(query)
        condicionalsql = cursor.fetchone()

        if condicionalsql is not None:
            cam_erro, mem_fail = condicionalsql

            data = [{
            "erro": f"cam_erro: {cam_erro}",
            "man_fail": f"man_fail: {mem_fail}" 
        }]
        else:
            data = {
            "error": "Nenhum dado encontrado"
        }

        cursor.close()
        conn.close()

        return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True)
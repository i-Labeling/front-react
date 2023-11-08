import psycopg2
import json
from datetime import datetime
global url
url = "C:/Users/walfr/OneDrive/Ambiente de Trabalho/iLabeling_conexao/new_front_react/front-end_20_10_23/front-react/apiDashboard/"
global info_arq
info_arq = {}


def read_data_js(nome_arq: str):
    try:
        with open(nome_arq, 'r') as arquivo_json:
            dados_existentes = json.load(arquivo_json)
            # print(dados_existentes)
            return dados_existentes
    except Exception:
        return "No data"

# Dados do dicionário info_arq
# info_arq = {
#     'cliente': "samsung - ELETRONICS",
#     'bandeja': '11',
#     'temp_total': '850.9',
#     'min_bdj': '10min 4s',
#     'temp_memoria': '8.5',
#     'mem_fail': '4',
#     'memo_index': [2, 4, 8, 9, 15, 16, 67, 68, 69],
#     'inspec_fail': ['memoria 78', 'memoria 45', 'memoria 33'],
#     'cam_erro': '9',
#     "pos_rfg": ['pos 5 - fail', 'pos 9 - fail', 'pos 1 - nada', 'pos 44 - vazio'],
#     'data_insercao': " "
# }


def send_bd(info_arq: dict):
    try:
        info_arq = read_data_js(url+"endProcess.json")
        print(type(info_arq))
        print(info_arq)
        # Conexão com o banco de dados PostgreSQL
        conn = psycopg2.connect(
            database="bd_ilabeling",
            user="postgres",
            password="2023",
            host="localhost",  # ou o host do seu banco de dados
            port="5432"  # a porta padrão do PostgreSQL é 5432
        )

        # Cria um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Monta a consulta SQL para inserir os dados do dicionário na tabela "info_arq"
        consulta = """
            INSERT INTO info_arq (
                customer,
                bandeja,
                temp_total,
                min_bdj,
                temp_memoria,
                mem_fail,
                memo_index,
                inspec_fail,
                cam_erro,
                pos_rfg,
                data_insercao
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """

        # Adiciona a data de inserção ao dicionário
        info_arq['data_insercao'] = datetime.now()

        # Converte listas em formato JSON usando json.dumps
        info_arq['memo_index'] = json.dumps(info_arq['memo_index'])
        info_arq['inspec_fail'] = json.dumps(info_arq['inspec_fail'])
        info_arq['pos_rfg'] = json.dumps(info_arq['pos_rfg'])

        # Executa a consulta SQL
        cursor.execute(consulta, (
            info_arq['customer'],
            info_arq['bandeja'],
            info_arq['temp_total'],
            info_arq['min_bdj'],
            info_arq['temp_memoria'],
            info_arq['mem_fail'],
            info_arq['memo_index'],
            info_arq['inspec_fail'],
            info_arq['cam_erro'],
            info_arq['pos_rfg'],
            info_arq['data_insercao']
        ))

        # Confirma a transação
        conn.commit()

        print("Dados inseridos com sucesso!")

    except Exception as e:
        print(f"Ocorreu um erro: {e}")

    finally:
        # Fecha o cursor e a conexão com o banco de dados
        cursor.close()
        conn.close()

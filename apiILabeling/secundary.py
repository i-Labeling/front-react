
import requests

url = 'http://localhost:5000/sse'  # Substitua pela URL correta do seu servidor Flask

try:
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()  # Converte a resposta JSON em um dicionário Python
        print(data)
    else:
        print(f"A solicitação falhou com o código de status {response.status_code}")
except Exception as e:
    print(f"Ocorreu um erro durante a solicitação: {str(e)}")
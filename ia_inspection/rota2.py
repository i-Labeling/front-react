from flask import Flask, request

app = Flask(__name__)

@app.route('/save_selected_squares', methods=['POST'])
def save_selected_squares():
    selected_values = request.get_json()
    print("Valores recebidos no servidor Flask:")
    print(selected_values)
    # Faça o que quiser com os valores aqui

    return 'Valores recebidos com sucesso'

if __name__ == '__main__':
    app.run(debug=True, port=5500)  # Ou escolha uma porta diferente se necessário

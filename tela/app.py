from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)  # Isso permite que todas as origens acessem seu servidor Flask durante o desenvolvimento.

# Lista para armazenar os valores recebidos do cliente
valores_salvos = []

@app.route('/save_values', methods=['POST'])
def save_values():
    try:
        data = request.json
        selected_values = data.get('selectedValues', [])
        
        # Adicione os valores recebidos à lista valores_salvos
        valores_salvos.extend(selected_values)
        
        return jsonify({'message': 'Valores salvos com sucesso.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/get_saved_values', methods=['GET'])
def get_saved_values():
    print('Valores salvos:', valores_salvos)  # Esta linha imprime os valores no servidor
    return jsonify({'savedValues': valores_salvos})

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=3000)

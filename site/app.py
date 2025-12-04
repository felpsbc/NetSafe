import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# =====================================================
# 🔑 COLE SUA CHAVE DO GMAIL PESSOAL AQUI
# =====================================================
my_api_key = "AIzaSyB4V2OPMBQmBwRfziFZS1VoCA_IUFjtl08"

genai.configure(api_key=my_api_key)

# Carrega a base de dados
def carregar_dados():
    try:
        with open('dados_seguranca.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

base_conhecimento = carregar_dados()

@app.route('/chat', methods=['POST'])
def chat():
    dados = request.json
    mensagem = dados.get('message', '')
    
    # 1. RAG (Busca no JSON)
    contexto = ""
    for item in base_conhecimento:
        if any(palavra in mensagem.lower() for palavra in item['pergunta'].lower().split()):
            contexto += f"Info: {item['resposta']}\n"
    
    if not contexto:
        contexto = "Sem dados específicos. Use conhecimento técnico geral de segurança."

    # 2. Prompt para a IA
    prompt = f"Aja como NetSafe, o chatbot do Project Aegis. Contexto: {contexto}. Pergunta: {mensagem}. Responda em Português de forma curta."
    
    try:
        # Modelo atualizado que funcionou na sua chave
        model = genai.GenerativeModel('models/gemini-2.0-flash') 
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
        
    except Exception as e:
        print(f"ERRO: {e}") 
        return jsonify({"response": "Erro de conexão com a IA. Verifique o terminal."})

if __name__ == '__main__':
    print("🛡️ NetSafe Backend Rodando...")
    app.run(debug=True, port=5000)
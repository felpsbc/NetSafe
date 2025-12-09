import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

my_api_key = ""

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
    
    # 1. Busca no JSON (RAG)
    contexto = ""
    for item in base_conhecimento:
        # Verifica se alguma palavra chave da pergunta do banco está na mensagem do usuário
        if any(palavra in mensagem.lower() for palavra in item['pergunta'].lower().split()):
            contexto += f"DADO DO PROJETO: {item['resposta']}\n"
    
    if not contexto:
        contexto = "Nenhum dado específico no banco interno."

    # 2. PROMPT AJUSTADO (Permitindo equipe e orientadores)
    prompt = f"""
    Você é o NetSafe, analista do Project Aegis.

    CONTEXTO DO BANCO DE DADOS:
    {contexto}

    PERGUNTA DO USUÁRIO:
    "{mensagem}"

    DIRETRIZES DE RESPOSTA:
    1. Priorize SEMPRE as informações vindas do "CONTEXTO DO BANCO DE DADOS" acima.
    2. TÓPICOS PERMITIDOS: Cibersegurança, TI, Vulnerabilidades, O Painel Aegis, Equipe de Desenvolvimento e Professores Orientadores (Contexto Acadêmico).
    3. TÓPICOS PROIBIDOS: Assuntos que não tenham nada a ver com o projeto ou tecnologia (ex: receitas, futebol, política, fofocas).
    
    Se a pergunta for permitida, responda de forma curta e cordial em PT-BR.
    Se for proibida, diga apenas: "Só posso responder sobre o Project Aegis e Segurança."
    """
    
    try:
        model = genai.GenerativeModel('models/gemini-2.0-flash') 
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
        
    except Exception as e:
        print(f"ERRO: {e}") 
        return jsonify({"response": "Erro de conexão."})

if __name__ == '__main__':
    print("🛡️ NetSafe Backend Rodando...")
    app.run(debug=True, port=5000)

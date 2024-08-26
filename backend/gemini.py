from flask import Flask, request
from flask_socketio import SocketIO, emit
import google.generativeai as genai
import os
from dotenv import load_dotenv
import eventlet

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

base_prompt = "You are PoetBot, an AI poem generator. Must reply in at most 10 lines. "

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def generate_poem(user_prompt):
    prompt = base_prompt + user_prompt
    try:
        response = model.generate_content(prompt, stream=True)
        for token in response:
            yield token.text
    except Exception as e:
        yield f"[Error]: {str(e)}"

@socketio.on('send_prompt')
def handle_send_prompt(data):
    user_prompt = data['prompt']
    for token in generate_poem(user_prompt):
        socketio.sleep(0)
        emit('receive_token', {'token': token}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5000)

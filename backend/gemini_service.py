from flask import Flask
from flask_socketio import SocketIO, emit
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Generative AI model with the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')
base_prompt = "You are PoetBot, an AI poem generator. Must reply in at most 10 lines."

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def generate_poem(user_prompt):
    prompt = base_prompt + user_prompt
    try:
        # Define safety settings
        custom_safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }
        response = model.generate_content(prompt, stream=True, safety_settings=custom_safety_settings)
        
        # Stream tokens while checking for errors
        for token in response:
            yield token.text
    except Exception as e:
        yield f"[Error]: {str(e)}"

@socketio.on('send_prompt')
def handle_send_prompt(data):
    user_prompt = data['prompt']
    try:
        for token in generate_poem(user_prompt):
            socketio.sleep(0.5)
            emit('receive_token', {'token': token}, broadcast=False)
    except Exception as e:
        emit('receive_token', {'token': f"[Error]: {str(e)}"}, broadcast=False)

def run_gemini_app():
    print("Starting Gemini on port 5000...")
    socketio.run(app, port=5000)


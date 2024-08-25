from flask import Flask, request
from flask_socketio import SocketIO, emit
import google.generativeai as genai
import os
from dotenv import load_dotenv
import eventlet

# Load the .env file
load_dotenv()

# Configure the API key using the loaded environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the generative model
model = genai.GenerativeModel('gemini-1.5-flash')

# Store the base prompt
base_prompt = "You are PoetBot, an AI poem generator. Must reply in at most 10 lines. "
# base_prompt = ""

# Create Flask app and Socket.IO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Generate and stream tokenized response
def generate_poem(user_prompt):
    prompt = base_prompt + user_prompt
    response = model.generate_content(prompt, stream=True)
    
    for token in response:
        yield token.text

@socketio.on('send_prompt')
def handle_send_prompt(data):
    user_prompt = data['prompt']
    for token in generate_poem(user_prompt):
        # Ensure immediate emission
        socketio.sleep(0)
        emit('receive_token', {'token': token}, broadcast=True)

# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, port=5000)

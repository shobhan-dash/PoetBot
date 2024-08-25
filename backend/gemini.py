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
base_prompt = "You are PoetBot. Answer in max 10 lines. "

# Create Flask app and Socket.IO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Generate and stream tokenized response
def generate_poem(user_prompt):
    prompt = base_prompt + user_prompt
    response = model.generate_content(prompt, stream=True)
    for token in response:
        yield token.text

# Socket.IO event handler for receiving the prompt and sending the response
@socketio.on('send_prompt')
def handle_send_prompt(data):
    user_prompt = data['prompt']
    for token in generate_poem(user_prompt):
        emit('receive_token', {'token': token})

# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, port=5000)

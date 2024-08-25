from flask import Flask
from flask_socketio import SocketIO, emit
import eventlet

# Create Flask app and Socket.IO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Handle the user prompt and echo it back
@socketio.on('send_prompt')
def handle_send_prompt(data):
    user_prompt = data['prompt']
    response = f"Received user prompt: {user_prompt}"
    # Stream the response back token by token (simulated here as a single token)
    for token in response.split():
        emit('receive_token', {'token': token + ' '})
    emit('receive_token', {'token': '\n'})  # Optional: to end the response cleanly

# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, port=5000)

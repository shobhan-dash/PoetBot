from flask import Flask
from flask_socketio import SocketIO, emit
import eventlet

# Create Flask app and Socket.IO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Handle the user prompt and stream tokens
@socketio.on('send_prompt')
def handle_send_prompt(data):
    user_prompt = data['prompt']

    # Simulate token streaming
    for token in user_prompt:
        emit('receive_token', {'token': token}, broadcast=True)


# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, port=5000)

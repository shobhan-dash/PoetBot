from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import uuid
from collections import deque
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

# Queues and counters for managing ports and UUIDs
uuid_counter = 0
uuid_map = {}
port_queue = deque([5001, 5002])  # Ports for Gemini and Emotion Bot

# Lock to ensure thread-safety when accessing shared resources
import threading
lock = threading.Lock()

@app.route('/assign', methods=['GET'])
def assign():
    global uuid_counter

    with lock:
        # Generate a new UUID (or use a counter)
        uuid_counter += 1
        new_uuid = str(uuid_counter)

        # Assign a port from the queue
        if port_queue:
            port = port_queue.popleft()
        else:
            return jsonify({"error": "No ports available"}), 503

        # Map UUID to port
        uuid_map[new_uuid] = port

        return jsonify({"uuid": new_uuid, "port": port})

@app.route('/release', methods=['POST'])
def release():
    data = request.json
    uuid_to_release = data.get('uuid')

    with lock:
        # Release port and UUID
        port = uuid_map.pop(uuid_to_release, None)
        if port:
            port_queue.append(port)
            return jsonify({"success": True})
        return jsonify({"error": "UUID not found"}), 404

@socketio.on('connect')
def handle_connect():
    emit('connected', {'message': 'Connection established'})

def run_load_balancer():
    print("Starting Load Balancer on port 5000...")
    socketio.run(app, port=5000)

if __name__ == "__main__":
    run_load_balancer()

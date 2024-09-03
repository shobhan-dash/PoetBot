from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, disconnect
import text2emotion as te
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        firebase_sdk_path = os.getenv('FIREBASE_ADMIN_SDK_PATH')
        if not firebase_sdk_path:
            raise ValueError("Firebase Admin SDK path is not set in environment variables")

        cred = credentials.Certificate(firebase_sdk_path)
        firebase_admin.initialize_app(cred)

initialize_firebase()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", path='/poetbot/socket.io-gemini')

@app.route('/emotion', methods=['GET'])
def emotion_status():
    return jsonify({"status": "Emotion Analyzer Online"}), 200

def authenticate_user(token):
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid  # Return the user's UID if the token is valid
    except Exception as e:
        emit('error', {'error': f"Authentication error: {e}"})
        return None

def classify_emotion_with_text2emotion(poem):
    try:
        emotions = te.get_emotion(poem)
        sorted_emotions = sorted(emotions.items(), key=lambda item: item[1], reverse=True)
        return sorted_emotions[:3]
    except Exception as e:
        emit('error', {'error': f"Error classifying emotion: {e}"})
        return []

@socketio.on('connect')
def handle_connect():
    try:
        token = request.args.get('token')
        if token:
            user_id = authenticate_user(token)
            if user_id:
                print(f"User {user_id} connected")
            else:
                emit('auth_error', {'error': "Invalid token, disconnecting..."})
                disconnect()
        else:
            emit('auth_error', {'error': "No token provided, disconnecting..."})
            disconnect()
    except Exception as e:
        emit('error', {'error': f"Error handling connection: {e}"})

@socketio.on('analyze_emotion_request')
def handle_analyze_emotion_request(data):
    try:
        poem = data.get('poem', '')
        if not poem:
            emit('analyze_emotion_response', {"error": "No poem provided"})
            return

        top_3_emotions = classify_emotion_with_text2emotion(poem)
        emit('analyze_emotion_response', [
            {"emotion": emotion, "confidence": score} for emotion, score in top_3_emotions
        ])
    except Exception as e:
        emit('error', {'error': f"Error handling analyze_emotion_request: {e}"})
        emit('analyze_emotion_response', {"error": f"Error: {str(e)}"})

def run_emotion_app():
    print("Starting Emotion Analyzer on port 5001...")
    socketio.run(app, host='0.0.0.0', port=5001)

if __name__ == '__main__':
    run_emotion_app()


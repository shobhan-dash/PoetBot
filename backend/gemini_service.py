from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, disconnect
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth

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

# Configure the Generative AI model with the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')
base_prompt = "You are PoetBot, an AI poem generator. Must reply in at most 10 lines."

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", path='/poetbot/socket.io-gemini')

@app.route('/gemini', methods=['GET'])
def gemini_status():
    return jsonify({"status": "Gemini Online"}), 200

def authenticate_user(token):
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid  # Return the user's UID if the token is valid
    except Exception as e:
        emit('error', {'error': f"Authentication error: {e}"})
        return None

def generate_poem(user_prompt):
    prompt = base_prompt + user_prompt
    try:
        custom_safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }
        response = model.generate_content(prompt, stream=True, safety_settings=custom_safety_settings)
        
        for token in response:
            yield token.text
    except Exception as e:
        emit('error', {'error': f"Error generating poem: {e}"})
        yield f"[Error]: {str(e)}"

@socketio.on('connect')
def handle_connect():
    try:
        token = request.args.get('token')
        if token:
            user_id = authenticate_user(token)
            if user_id:
                print(f"User {user_id} connected")
                emit('connect_success', {'message': 'Successfully connected to the Gemini server!'})
            else:
                emit('auth_error', {'error': "Invalid token, disconnecting..."})
                disconnect()
        else:
            emit('auth_error', {'error': "No token provided, disconnecting..."})
            disconnect()
    except Exception as e:
        emit('error', {'error': f"Error handling connection: {e}"})

@socketio.on('send_prompt')
def handle_send_prompt(data):
    try:
        user_prompt = data['prompt']
        for token in generate_poem(user_prompt):
            socketio.sleep(0.5)
            emit('receive_token', {'token': token})
    except Exception as e:
        emit('receive_token', {'token': f"[Error]: {str(e)}"})
        emit('error', {'error': f"Error handling send_prompt: {e}"})

def run_gemini_app():
    print("Starting Gemini on port 5000...")
    socketio.run(app, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    run_gemini_app()

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import text2emotion as te

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def classify_emotion_with_text2emotion(poem):
    emotions = te.get_emotion(poem)
    sorted_emotions = sorted(emotions.items(), key=lambda item: item[1], reverse=True)
    return sorted_emotions[:3]

@socketio.on('analyze_emotion_request')
def handle_analyze_emotion_request(data):
    poem = data.get('poem', '')
    if not poem:
        emit('analyze_emotion_response', {"error": "No poem provided"})
        return

    top_3_emotions = classify_emotion_with_text2emotion(poem)
    emit('analyze_emotion_response', [
        {"emotion": emotion, "confidence": score} for emotion, score in top_3_emotions
    ])

def run_emotion_app():
    print("Starting Emotion Analyzer on port 5001...")
    socketio.run(app, port=5001)
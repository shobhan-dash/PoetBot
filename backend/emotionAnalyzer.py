from flask import Flask, request, jsonify
import text2emotion as te

app = Flask(__name__)

def classify_emotion_with_text2emotion(poem):
    emotions = te.get_emotion(poem)
    sorted_emotions = sorted(emotions.items(), key=lambda item: item[1], reverse=True)
    top_3_emotions = sorted_emotions[:3]
    return top_3_emotions

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    data = request.get_json()
    poem = data.get('poem', '')

    if not poem:
        return jsonify({"error": "No poem provided"}), 400

    top_3_emotions = classify_emotion_with_text2emotion(poem)

    return jsonify({
        "top_3_emotions": [
            {"emotion": emotion, "confidence": score}
            for emotion, score in top_3_emotions
        ]
    }), 200

if __name__ == '__main__':
    app.run(debug=True)

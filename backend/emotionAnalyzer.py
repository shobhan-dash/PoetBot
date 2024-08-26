import text2emotion as te

def classify_emotion_with_text2emotion(poem):
    emotions = te.get_emotion(poem)
    dominant_emotion = max(emotions, key=emotions.get)
    return dominant_emotion, emotions[dominant_emotion]

emotion, confidence = classify_emotion_with_text2emotion("I am so excited and happy about the surprise!")
print(f"Emotion: {emotion}, Confidence: {confidence}")
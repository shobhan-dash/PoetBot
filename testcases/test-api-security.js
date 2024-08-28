// If invalid token is given, the client's console remains silent and the server logs the invalid token error.
// With a valid token (could be obtained via logging from server and using it here), the client's console logs the connection and response messages.

const io = require('socket.io-client');

const geminiSocket = io('http://localhost:5000', {
    query: { token: 'invalid_token' }
});

const emotionSocket = io('http://localhost:5001', {
    query: { token: 'invalid_token' }
});

// Event listeners setup
geminiSocket.on('connect', () => {
    console.log('Connected to Gemini Socket');
    geminiSocket.emit('send_prompt', { prompt: 'Tale of two friends' });
});

geminiSocket.on('receive_token', (data) => {
    console.log('Gemini token received:', data);
});

geminiSocket.on('auth_error', (data) => {
    console.error('Gemini Authentication error:', data.error);
});

geminiSocket.on('connect_error', (err) => {
    console.error('Gemini Connection error:', err.message);
});

emotionSocket.on('connect', () => {
    console.log('Connected to Emotion Socket');
    emotionSocket.emit('analyze_emotion_request', { poem: 'Test poem' });
});

emotionSocket.on('analyze_emotion_response', (data) => {
    console.log('Emotion analysis response:', data);
});

emotionSocket.on('auth_error', (data) => {
    console.log('Emotion Authentication error:', data.error);
});

emotionSocket.on('connect_error', (err) => {
    console.log('Emotion Connection error:', err.message);
});

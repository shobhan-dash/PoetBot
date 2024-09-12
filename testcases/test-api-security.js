const io = require('socket.io-client');

// Function to handle authentication, connection, and prompt sending
function connectToService(serviceName, url, path, token, prompt) {
    const socket = io(url, {
        transports: ['websocket'],  
        path: path,                 
        query: { token },           
        pingTimeout: 60000,         
        pingInterval: 25000         
    });

    // Handle connection success
    socket.on('connect', () => {
        console.log(`${serviceName} connected successfully.`);

        // Sending prompt after successful connection
        if (prompt) {
            socket.emit('send_prompt', { prompt });
        }
    });

    // Handle connection errors (e.g., auth errors, missing tokens)
    socket.on('connect_error', (error) => {
        console.error(`${serviceName} connection error: ${error.message}`);
    });

    socket.on('auth_error', (data) => {
        console.error(`${serviceName} authentication error: ${data.error}`);
        socket.disconnect();
    });

    // Handle poem generation (streaming tokens)
    socket.on('receive_token', (data) => {
        console.log(`${serviceName} received token: ${data.token}`);
    });

    // General error handler
    socket.on('error', (error) => {
        console.error(`${serviceName} error: ${error.error}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`${serviceName} disconnected.`);
    });
}

// Generate a valid token or use an existing one
const userToken = 'your_firebase_user_token';  // Replace with a valid Firebase token

// Define the prompt to send to Gemini
const prompt = "Write a poem about the ocean.";

// Connect to Gemini service (port 5000)
connectToService('Gemini', 'http://localhost:5000', '/poetbot/socket.io-gemini', userToken, prompt);

// You can also add the Emotion service connection here in a similar way if needed
connectToService('Emotion', 'http://localhost:5001', '/poetbot/socket.io-emotion', userToken, null);

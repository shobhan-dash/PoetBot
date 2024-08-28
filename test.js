let socket = new WebSocket('ws://localhost:5000/socket.io/?EIO=3&transport=websocket&token=YOUR_VALID_TOKEN');

socket.onopen = function () {
    console.log('Connected');
    socket.send(JSON.stringify({ event: 'send_prompt', data: { prompt: 'Write a poem about the sea' } }));
};

socket.onmessage = function (event) {
    console.log('Message received:', event.data);
};

socket.onerror = function (error) {
    console.error('WebSocket error:', error);
};

socket.onclose = function () {
    console.log('WebSocket closed');
};

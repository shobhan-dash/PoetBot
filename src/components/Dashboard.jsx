import * as React from 'react';
import { Box } from '@mui/material';
import io from 'socket.io-client';
import SideBar from './SideBar';
import UserPrompt from './UserPrompt';
import UserMessage from './models/UserMessage';
import ModelResponse from './models/ModelResponse';

function Dashboard({ setUserSignIn, userData }) {
  const [messages, setMessages] = React.useState([]);

  // Initialize Socket.IO connection
  const socket = React.useMemo(() => io(`${process.env.REACT_APP_BASE_URL}:5000`), []);

  React.useEffect(() => {
    // Listen for the tokenized response from the backend
    socket.on('receive_token', (data) => {
      console.log('Received token:', data.token);  // Debugging log

      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage && lastMessage.type === 'modelResponse') {
          if (data.token === '\n') {
            // Finish the current response
            return [...newMessages, { type: 'modelResponse', tokens: '' }]; // Add a new empty response
          } else {
            // Append token to the current response
            lastMessage.tokens += data.token;
          }
        } else {
          // Create a new ModelResponse and start appending tokens
          const newResponse = { type: 'modelResponse', tokens: data.token };
          return [...newMessages, newResponse];
        }

        return newMessages;
      });
    });

    return () => {
      socket.off('receive_token');
    };
  }, [socket]);


  const handleSendPrompt = (message) => {
    const userMessage = { content: message, type: 'userMessage' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessages(prevMessages => [...prevMessages, { type: 'modelResponse', tokens: '' }]); // Initialize the current response
    socket.emit('send_prompt', { prompt: message });
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Drawer Menu Icon at Top Left */}
      <div className="absolute top-0 left-0 p-4">
        <SideBar setUserSignIn={setUserSignIn} userData = {userData} />
      </div>

      {/* Main Content */}
      <div className="text-center w-full p-4">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <Box className="chat-history text-left rounded" sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {message.type === 'modelResponse' ? (
                <ModelResponse tokens={message.tokens} />
              ) : (
                <UserMessage content={message.content} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </div>

      {/* Input Field at the Bottom */}
      <UserPrompt onSendPrompt={handleSendPrompt} />
    </div>
  );
}

export default Dashboard;

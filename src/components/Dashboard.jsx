import * as React from 'react';
import { Box } from '@mui/material';
import io from 'socket.io-client';
import SideBar from './SideBar';
import UserPrompt from './UserPrompt';
import UserMessage from './models/UserMessage';
import ModelResponse from './models/ModelResponse';
import PoetBotLogo from '../assets/images/poetbot-logo.png';

function Dashboard({ setUserSignIn, userData }) {
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false); // Track loading state
  const endOfMessagesRef = React.useRef(null);

  // Initialize Socket.IO connection
  const socket = React.useMemo(() => io(`${process.env.REACT_APP_BASE_URL}:5000`), []);

  React.useEffect(() => {
    // Listen for the tokenized response from the backend
    socket.on('receive_token', (data) => {
      setIsLoading(false);  // Stop loading when the first token is received

      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage && lastMessage.type === 'modelResponse') {
          if (data.token === '\n') {
            return [...newMessages, { type: 'modelResponse', tokens: '' }];
          } else {
            lastMessage.tokens += data.token;
          }
        } else {
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

  React.useEffect(() => {
    // Scroll to the end whenever messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendPrompt = (message) => {
    const userMessage = { content: message, type: 'userMessage' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessages(prevMessages => [...prevMessages, { type: 'modelResponse', tokens: '' }]);
    setIsLoading(true);  // Start loading when the prompt is sent
    socket.emit('send_prompt', { prompt: message });
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="absolute top-0 left-0 p-4">
        <SideBar setUserSignIn={setUserSignIn} userData={userData} />
      </div>

      <div className="text-center w-full p-4">
        <Box className="chat-history text-left rounded" sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {message.type === 'modelResponse' ? (
                <div className="flex items-start my-2">
                  <img
                    src={PoetBotLogo}
                    alt=""
                    className="w-8 h-8 mr-2 rounded-full"
                  />
                  <ModelResponse tokens={message.tokens} isLoading={isLoading && index === messages.length - 1} />
                </div>
              ) : (
                <div className="flex items-start justify-end my-2">
                  {/* <img
                    src={userData.user.photoURL}
                    alt=""
                    className="w-8 h-8 rounded-full ml-2"
                  /> */}
                  <UserMessage content={message.content} />
                </div>
              )}
            </React.Fragment>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>
      </div>

      <UserPrompt onSendPrompt={handleSendPrompt} />
    </div>
  );
}

export default Dashboard;

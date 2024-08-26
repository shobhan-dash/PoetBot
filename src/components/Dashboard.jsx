import React from 'react';
import { Box } from '@mui/material';
import io from 'socket.io-client';
import SideBar from './SideBar';
import UserPrompt from './UserPrompt';
import UserMessage from './models/UserMessage';
import ModelResponse from './models/ModelResponse';
import PoetBotLogo from '../assets/images/poetbot-logo.png';
import EmotionBotLogo from '../assets/images/emotionbot-logo.png';
import SamplePrompts from './SamplePrompts';

function Dashboard({ setUserSignIn, userData }) {
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false); // Track loading state
  const endOfMessagesRef = React.useRef(null);
  const [message, setMessage] = React.useState(''); // input field
  // Initialize Socket.IO connections
  const socket = React.useMemo(() => io(`${process.env.REACT_APP_BASE_URL}:5000`), []);
  const emotionSocket = React.useMemo(() => io(`${process.env.REACT_APP_BASE_URL}:5001`), []);

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

  const handleAnalyzeEmotion = (poem) => {
    emotionSocket.emit('analyze_emotion_request', { poem });

    emotionSocket.on('analyze_emotion_response', (data) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage && lastMessage.type === 'modelResponse') {
          lastMessage.emotionData = data;
        }

        return updatedMessages;
      });
    });
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
              {message.type === 'modelResponse' && (
                <div className="flex items-start my-2">
                  <img
                    src={PoetBotLogo}
                    alt="Poet Bot Logo"
                    className="w-8 h-8 mr-2 rounded-full"
                  />
                  <ModelResponse
                    tokens={message.tokens}
                    isLoading={isLoading && index === messages.length - 1}
                    onAnalyzeEmotion={() => handleAnalyzeEmotion(message.tokens)}
                    emotionData={message.emotionData}
                    emotionLogo={EmotionBotLogo} // Pass EmotionBotLogo to ModelResponse
                  />
                </div>
              )}
              {message.type !== 'modelResponse' && (
                <div className="flex items-start justify-end my-2">
                  <UserMessage content={message.content} />
                </div>
              )}
            </React.Fragment>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>
      {messages.length === 0 && <SamplePrompts onSendPrompt={handleSendPrompt} />}
      </div>
      <UserPrompt message={message} setMessage={setMessage} onSendPrompt={handleSendPrompt} />
    </div>
  );
}

export default Dashboard;

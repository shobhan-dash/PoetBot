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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmotionLoading, setIsEmotionLoading] = React.useState(false); // Track emotion analysis loading
  const endOfMessagesRef = React.useRef(null);
  const [message, setMessage] = React.useState('');
  const [shouldScroll, setShouldScroll] = React.useState(false);
  const [userInteracting, setUserInteracting] = React.useState(false);
  const socket = React.useMemo(() => io(`${process.env.REACT_APP_BASE_URL}:5000`), []);
  const emotionSocket = React.useMemo(() => io(`${process.env.REACT_APP_BASE_URL}:5001`), []);

  React.useEffect(() => {
    socket.on('receive_token', (data) => {
      setIsLoading(false);

      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage && lastMessage.type === 'modelResponse') {
          lastMessage.tokens += data.token;
        } else {
          newMessages.push({ type: 'modelResponse', tokens: data.token });
          setShouldScroll(true);
          setUserInteracting(false);
        }

        return newMessages;
      });
    });

    return () => {
      socket.off('receive_token');
    };
  }, [socket]);

  React.useEffect(() => {
    if (shouldScroll && !userInteracting) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScroll(false);
    }
  }, [messages, shouldScroll, userInteracting]);

  const handleSendPrompt = (message) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'userMessage', content: message },
      { type: 'modelResponse', tokens: '', emotionData: null },
    ]);
    setIsLoading(true);
    setShouldScroll(true);
    setUserInteracting(false);
    socket.emit('send_prompt', { prompt: message });
  };

  const handleAnalyzeEmotion = (index) => {
    const poem = messages[index].tokens;

    setIsEmotionLoading(true); // Set emotion loading to true
    emotionSocket.emit('analyze_emotion_request', { poem });

    const handleEmotionResponse = (data) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[index].emotionData = data;
        return updatedMessages;
      });

      setIsEmotionLoading(false); // Set emotion loading to false
      emotionSocket.off('analyze_emotion_response', handleEmotionResponse);
    };

    emotionSocket.on('analyze_emotion_response', handleEmotionResponse);

    setUserInteracting(true);
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
                    onAnalyzeEmotion={() => handleAnalyzeEmotion(index)}
                    emotionData={message.emotionData}
                    emotionLogo={EmotionBotLogo}
                    isEmotionLoading={isEmotionLoading} // Pass the emotion loading state
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
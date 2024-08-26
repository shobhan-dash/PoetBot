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
  const [isEmotionLoading, setIsEmotionLoading] = React.useState(false);
  const endOfMessagesRef = React.useRef(null);
  const [message, setMessage] = React.useState('');
  const [shouldScroll, setShouldScroll] = React.useState(false);
  const [userInteracting, setUserInteracting] = React.useState(false);
  const [uuid, setUuid] = React.useState(null);
  const [geminiSocket, setGeminiSocket] = React.useState(null);
  const [emotionSocket, setEmotionSocket] = React.useState(null);

  React.useEffect(() => {
    // Fetch a new UUID and ports from the load balancer
    fetch(`${process.env.REACT_APP_BASE_URL}:5000/assign`)
      .then(response => response.json())
      .then(data => {
        setUuid(data.uuid);

        // Connect to Gemini and Emotion Bot services using UUID
        const gemini = io(`${process.env.REACT_APP_BASE_URL}:5001`, {
          query: { uuid: data.uuid },
        });
        const emotion = io(`${process.env.REACT_APP_BASE_URL}:5002`, {
          query: { uuid: data.uuid },
        });

        setGeminiSocket(gemini);
        setEmotionSocket(emotion);

        // Clean up on component unmount
        return () => {
          gemini.disconnect();
          emotion.disconnect();
        };
      })
      .catch(error => console.error("Error fetching UUID:", error));
  }, []);

  React.useEffect(() => {
    if (geminiSocket) {
      geminiSocket.on('receive_token', (data) => {
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
        geminiSocket.off('receive_token');
      };
    }
  }, [geminiSocket]);

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
    if (geminiSocket) {
      geminiSocket.emit('send_prompt', { prompt: message });
    }
  };

  const handleAnalyzeEmotion = (index) => {
    const poem = messages[index].tokens;

    setIsEmotionLoading(true);
    if (emotionSocket) {
      emotionSocket.emit('analyze_emotion_request', { poem });

      const handleEmotionResponse = (data) => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[index].emotionData = data;
          return updatedMessages;
        });

        setIsEmotionLoading(false);
        emotionSocket.off('analyze_emotion_response', handleEmotionResponse);
      };

      emotionSocket.on('analyze_emotion_response', handleEmotionResponse);
    }

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

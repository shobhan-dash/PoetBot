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
import { getAuth } from "firebase/auth";

function Dashboard({ setUserSignIn, userData }) {
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmotionLoading, setIsEmotionLoading] = React.useState([]);
  const endOfMessagesRef = React.useRef(null);
  const [message, setMessage] = React.useState('');
  const [shouldScroll, setShouldScroll] = React.useState(false);
  const [userInteracting, setUserInteracting] = React.useState(false);

  const [geminiSocket, setGeminiSocket] = React.useState(null);
  const [emotionSocket, setEmotionSocket] = React.useState(null);

  React.useEffect(() => {
    const auth = getAuth();
    auth.currentUser.getIdToken().then(token => {
      const gSocket = io(`${process.env.REACT_APP_BASE_URL}:5000`, {
        query: { token }
      });

      const eSocket = io(`${process.env.REACT_APP_BASE_URL}:5001`, {
        query: { token }
      });

      setGeminiSocket(gSocket);
      setEmotionSocket(eSocket);

      gSocket.on('connect', () => console.log('Connected to Gemini Socket'));
      eSocket.on('connect', () => console.log('Connected to Emotion Socket'));

      return () => {
        gSocket.disconnect();
        eSocket.disconnect();
      };
    });
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
    geminiSocket.emit('send_prompt', { prompt: message });
  };

  const handleAnalyzeEmotion = (index) => {
    const poem = messages[index].tokens;

    setIsEmotionLoading(prevLoading => {
      const updatedLoading = [...prevLoading];
      updatedLoading[index] = true;
      return updatedLoading;
    });

    emotionSocket.emit('analyze_emotion_request', { poem });

    const handleEmotionResponse = (data) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[index].emotionData = data;
        return updatedMessages;
      });

      setIsEmotionLoading(prevLoading => {
        const updatedLoading = [...prevLoading];
        updatedLoading[index] = false;
        return updatedLoading;
      });

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

        <h2 className="mt-4 text-red-400">
          Unfortunately, the backend isn't properly integrated with Nginx. <br />
          <a
            href="https://drive.google.com/file/d/19Dy8djJ9UaBvCuNQwNKnaHu0LgtU6iH2/view?usp=drive_link"
            className="text-blue-400 underline"
          >
            So here's a short video demo of the app
          </a>
        </h2>

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
                    isEmotionLoading={isEmotionLoading[index]}
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

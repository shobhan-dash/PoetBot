import * as React from 'react';
import { Box, IconButton, Textarea } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import PoetBotLogo from '../assets/images/poetbot-logo.png';
import SideBar from './SideBar';
import io from 'socket.io-client';

function Dashboard({ setUserSignIn }) {
  document.title = 'PoetBot | Dashboard';

  const [message, setMessage] = React.useState('');
  const [response, setResponse] = React.useState('');

  // Initialize Socket.IO connection
  const socket = React.useMemo(() => io('http://localhost:5000'), []);

  React.useEffect(() => {
    // Listen for the streamed tokenized response from the backend
    socket.on('receive_token', (data) => {
      setResponse((prevResponse) => prevResponse + data.token);
    });

    return () => {
      socket.off('receive_token');
    };
  }, [socket]);

  const handleSend = () => {
    if (message.trim() === '') {
      setMessage(''); // Prevent sending if the message is empty
      return;
    }

    setResponse(''); // Clear previous response
    socket.emit('send_prompt', { prompt: message });
    setMessage(''); // Clear the textarea
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Drawer Menu Icon at Top Left */}
      <div className="absolute top-0 left-0 p-4">
        <SideBar setUserSignIn={setUserSignIn} />
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <div
          className="response-box bg-gray-800 text-white p-4 rounded-lg max-w-3xl mx-auto mt-6"
          style={{ minHeight: '100px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        >
          {response || 'Your generated poem will appear here...'}
        </div>
      </div>

      {/* Input Field at the Bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#2d3748',
          borderRadius: '8px',
          padding: '8px',
          width: 'calc(100% - 32px)',
          maxWidth: '1000px',
          overflow: 'hidden',
        }}
      >
        <img src={PoetBotLogo} alt="PoetBot Logo" className="w-8 h-8 rounded" style={{ marginRight: '8px' }} />
        <Textarea
          placeholder="Type your message..."
          minRows={1}
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            flex: 1,
            fontSize: '16px',
            border: 'none',
            resize: 'none',
            px: 3,
            py: 1,
            ml: 1,
            color: 'white',
            backgroundColor: 'transparent',
          }}
        />
        <IconButton
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleSend}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </div>
  );
}

export default Dashboard;

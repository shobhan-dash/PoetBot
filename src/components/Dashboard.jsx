import * as React from 'react';
import { Box, IconButton, Textarea } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import PoetBotLogo from '../assets/images/poetbot-logo.png'; // Assuming it's an image file
import SideBar from './SideBar';

function Dashboard({ setUserSignIn }) {
  document.title = 'PoetBot | Dashboard';

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Drawer Menu Icon at Top Left */}
      <div className="absolute top-0 left-0 p-4">
        <SideBar setUserSignIn={setUserSignIn} />
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
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
          backgroundColor: '#2d3748', // gray-800
          borderRadius: '8px',
          padding: '8px',
          width: 'calc(100% - 32px)', // Adjust width with margins
          maxWidth: '1000px',
          overflow: 'hidden', // Prevents resizing issues
        }}
      >
        <img src={PoetBotLogo} alt="PoetBot Logo" className="w-8 h-8 rounded" style={{ marginRight: '8px' }} />
        <Textarea
          placeholder="Type your message..."
          minRows={1}
          maxRows={4}
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
        >
          <SendIcon /> {/* Up arrow on the right */}
        </IconButton>
      </Box>
    </div>
  );
}

export default Dashboard;

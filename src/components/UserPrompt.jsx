import * as React from 'react';
import { Box, IconButton, Textarea } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import PoetBotLogo from '../assets/images/poetbot-logo.png';

function UserPrompt({ onSendPrompt }) {
    const [message, setMessage] = React.useState('');

    const handleSend = () => {
        if (message.trim() === '') {
            setMessage(''); // Prevent sending if the message is empty
            return;
        }
        // console.log(message);
        onSendPrompt(message); // Send the prompt to the parent component
        setMessage(''); // Clear the textarea
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
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
            <img src={PoetBotLogo} alt="PoetBot Logo" style={{ marginRight: '8px', width: '32px', height: '32px', borderRadius: '50%' }} />
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
                sx={{
                    ml: 1,
                    '&:hover .MuiSvgIcon-root': {
                        color: '#2d3748', // Change color on parent hover
                    },
                }}
                onClick={handleSend}
            >
                <SendIcon
                    sx={{
                        color: 'white',
                        transition: 'color 0.3s',
                    }}
                />
            </IconButton>
        </Box>
    );
}

export default UserPrompt;

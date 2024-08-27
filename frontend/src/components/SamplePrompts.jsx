import React from 'react';
import { Box, Button, Typography, Grid, Container } from '@mui/material';
import PoetBotLogo from '../assets/images/poetbot-logo.png';

const SamplePrompts = ({ onSendPrompt }) => {
    const prompts = [
        "Write a poem about the ocean",
        "Generate a sonnet on love",
        "Create a haiku about nature",
        "Compose a limerick about a cat",
    ];

    const handlePromptClick = (prompt) => {
        onSendPrompt(prompt);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={4}
            sx={{
                overflow: 'auto',
                '@media (max-width: 600px)': {
                    p: 2,
                }
            }}
        >
            <img src={PoetBotLogo} alt='' width={100} height={100} className='rounded-full py-2' />
            <Typography variant="h4" gutterBottom color="white" textAlign="center"
                sx={{
                    '@media (max-width: 600px)': {
                        fontSize: '1.5rem',
                    }
                }}
            >
                Need Some Inspiration?
            </Typography>
            <Typography variant="body1" color="white" gutterBottom textAlign="center"
                sx={{
                    '@media (max-width: 600px)': {
                        fontSize: '0.875rem',
                    }
                }}
            >
                PoetBot has some recommendations for you!
            </Typography>
            <Container maxWidth="sm">  {/* This container centers the grid and limits the width */}
                <Grid container spacing={2} mt={2} justifyContent="center">
                    {prompts.map((prompt, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Button
                                onClick={() => handlePromptClick(prompt)}
                                sx={{
                                    backgroundColor: '#2d3748',
                                    color: 'white',
                                    padding: 2,
                                    borderRadius: 1,
                                    width: '100%',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#4a5568',
                                    },
                                    '@media (max-width: 600px)': {
                                        fontSize: '0.75rem',
                                    }
                                }}
                            >
                                {prompt}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default SamplePrompts;

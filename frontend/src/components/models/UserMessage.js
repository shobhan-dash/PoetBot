import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const UserMessage = ({ content }) => {
    return (
        <Box
            display="flex"
            justifyContent="flex-end"
            my={1}
            mr={4}
            sx={{ maxWidth: '60%' }}
        >
            <Card sx={{ backgroundColor: '#2d3748', color: 'white', width: 'auto', maxWidth: '100%', overflowX: 'auto' }}>
                <CardContent>
                    <Typography
                        variant="body1"
                        component="pre"
                        sx={{
                            wordBreak: 'break-word',   // Ensure long words break if needed
                            overflowWrap: 'break-word', // Handle overflow within words
                        }}
                    >
                        {content}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserMessage;

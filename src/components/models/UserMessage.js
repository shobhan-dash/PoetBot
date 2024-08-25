import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const UserMessage = ({ content }) => {
    return (
        <Box display="flex" justifyContent="flex-end" my={1}>
            <Card sx={{ maxWidth: '60%', backgroundColor: '#2d3748', color: 'white' }}>
                <CardContent>
                    <Typography variant="body1" component="pre">
                        {content}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserMessage;

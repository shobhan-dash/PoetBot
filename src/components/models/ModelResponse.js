import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const ModelResponse = ({ tokens }) => {
    return (
        <Box display="flex" justifyContent="flex-start" my={1}>
            <Card sx={{ maxWidth: '100%', backgroundColor: '#4a5568', color: 'white' }}>
                <CardContent>
                    <Typography variant="body1" component="pre">
                        {tokens}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ModelResponse;

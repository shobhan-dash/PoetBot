import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';

const ModelResponse = ({ tokens, isLoading }) => {
    return (
        <Box display="flex" justifyContent="flex-start" my={1}>
            <Card sx={{ maxWidth: '100%', backgroundColor: '#4a5568', color: 'white' }}>
                <CardContent>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress color="inherit" />
                        </Box>
                    ) : (
                        <Typography variant="body1" component="pre">
                            {tokens}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ModelResponse;

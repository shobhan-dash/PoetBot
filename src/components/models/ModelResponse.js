import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

const ModelResponse = ({ tokens, isLoading, onAnalyzeEmotion, emotionData, emotionLogo }) => {
    return (
        <Box display="flex" flexDirection="column" my={1} alignItems="flex-start">
            {/* First Box with PoetBotLogo */}
            <Card sx={{ maxWidth: '70%', backgroundColor: '#4a5568', color: 'white', flexGrow: 1 }}>
                <CardContent>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress color="inherit" />
                        </Box>
                    ) : (
                        <Typography
                            variant="body1"
                            component="pre"
                            sx={{
                                overflowWrap: 'break-word', // Ensures words break to prevent overflow
                                wordBreak: 'break-word',    // Handles long words or URLs
                                whiteSpace: 'pre-wrap',     // Preserves line breaks from the input
                            }}
                        >
                            {tokens}
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2} sx={{ width: '100%' }}>
                {!emotionData && (
                    <Button
                        onClick={onAnalyzeEmotion}
                        sx={{ minWidth: 'auto', padding: 1, marginBottom: 2 }}
                    >
                        <InsightsIcon />
                    </Button>
                )}
                {emotionData && (
                    <Box display="flex" alignItems="center" mt={2}>
                        <img
                            src={emotionLogo}
                            alt="Emotion Bot Logo"
                            className="w-8 h-8 mr-2 rounded-full"
                        />
                        <Box color="white" sx={{ backgroundColor: '#2d3748', padding: 2, borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>EmotionBot's Analysis:</strong>
                                <ul>
                                    {emotionData.map((emotion, index) => (
                                        <li key={index}>
                                            {emotion.emotion}: {Math.round(emotion.confidence * 100)}%
                                        </li>
                                    ))}
                                </ul>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ModelResponse;

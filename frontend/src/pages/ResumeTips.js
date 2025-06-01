import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import { useAlert } from "../utils/useAlert";
import { Box, Typography, Card, CardContent, Divider, List, ListItem, Button } from '@mui/material';

// import '../design/ResumeTips.css';

const ResumeTips = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tips = location.state?.tips;
    const { alert, showAlert, closeAlert } = useAlert();

    React.useEffect(() => {
        if (!tips) {
            showAlert('error', 'No resume tips available.');
        }
    }, [tips, showAlert]);

    if (!tips) {
        return (
            <Box p={3} className="resume-tips-container">
                <Typography variant="h4" gutterBottom>Resume Tips</Typography>
                <Typography>No resume tips available.</Typography>
                <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
                {alert.show && (
                    <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
                )}
            </Box>
        );
    }

    return (
        <Box p={3} className="resume-tips-container">
            <Typography variant="h4" gutterBottom>Resume Tips</Typography>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Here are your personalized resume tips:</Typography>
                    <List>
                        {Array.isArray(tips)
                            ? tips.map((tip, idx) => (
                                <ListItem key={idx}>{tip}</ListItem>
                            ))
                            : tips.split('\n').map((tip, idx) => (
                                <ListItem key={idx}>{tip}</ListItem>
                            ))
                        }
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
                </CardContent>
            </Card>
            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </Box>
    );
};

export default ResumeTips;
import React, { use, useState} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import { useAlert } from "../utils/useAlert";
import { Box, Typography, Card, CardContent, Divider, List, ListItem, Button, CircularProgress } from '@mui/material';
import axiosInstance2 from "../utils/axiosInstance2";
import { useEffect } from "react";


const CoverLetterTips = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const coverLetterPath = location.state?.coverLetterPath || "";
    const [tips, setTips] = useState(null);
    const [loading, setLoading] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();

    useEffect(() => {
        console.log("Cover Letter Path:", coverLetterPath);
    }, []);

    const handleSuggest = async () => {

        if (!coverLetterPath) {
            showAlert('error', 'No cover letter path provided.');
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance2.post('suggestionsCoverLetter', { path: coverLetterPath });
            setTips(res.data);
        } catch (error) {
            showAlert('error', 'Failed to fetch cover letter tips.');
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <Box p={3} className="resume-tips-container">
            <Typography variant="h4" gutterBottom>Cover Letter Tips</Typography>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Here are your personalized cover letter tips:</Typography>
                    <Box mb={2} display="flex" gap={2}>
                        <Button
                            variant="contained"
                            onClick={handleSuggest}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Get Tips"}
                        </Button>
                    </Box>
                    <List>
                        {Array.isArray(tips)
                            ? tips.map((tip, idx) => (
                                <ListItem key={idx}>{tip}</ListItem>
                            ))
                            : typeof tips === "string"
                                ? tips.split('\n').map((tip, idx) => (
                                    <ListItem key={idx}>{tip}</ListItem>
                                ))
                                : tips && tips["answer"]
                                    ? tips["answer"].split('\n').map((tip, idx) => (
                                        <ListItem key={idx}>{tip}</ListItem>
                                    ))
                                    : null
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

export default CoverLetterTips;
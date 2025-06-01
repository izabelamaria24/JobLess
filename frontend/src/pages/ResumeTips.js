import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import { useAlert } from "../utils/useAlert";
import { Box, Typography, Card, CardContent, Divider, Button, CircularProgress, List, ListItem, Link } from '@mui/material';
import axiosInstance2 from "../utils/axiosInstance2";

const ResumeTips = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resumePath = location.state?.resumePath || "";
    const { alert, showAlert, closeAlert } = useAlert();

    const [tips, setTips] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSuggest = async () => {
        if (!resumePath) {
            showAlert('error', 'No resume path provided.');
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance2.post('suggestionsCV', { path: resumePath });
            setTips(res.data);
        } catch (error) {
            showAlert('error', 'Failed to fetch resume tips.');
        } finally {
            setLoading(false);
        }
    };

    const formatTipsText = (text) => {
        let formatted = text;
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        const lines = formatted.split("\n");
        let inList = false;
        let result = "";
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith("* ")) {
                if (!inList) {
                    result += `<ul style="margin-bottom:1rem; padding-left:1.5rem;">`;
                    inList = true;
                }
                result += `<li style="margin-bottom:0.5rem;">${trimmed.substring(2)}</li>`;
            } else {
                if (inList) {
                    result += "</ul>";
                    inList = false;
                }
                if (/^<strong>(.*?)<\/strong>$/.test(trimmed)) {
                    const headingText = trimmed.replace(/^<strong>(.*?)<\/strong>$/, "$1");
                    result += `<h3 style="margin:1rem 0 0.5rem; color:#1976d2;">${headingText}</h3>`;
                } else if(trimmed !== "") {
                    result += `<p style="margin-bottom:1rem;">${trimmed}</p>`;
                }
            }
        });
        if (inList) {
            result += "</ul>";
        }
        return <div dangerouslySetInnerHTML={{ __html: result }} />;
    };

    const renderTips = () => {
        if (typeof tips === "string") {
            return formatTipsText(tips);
        } else if (tips && tips.answer) {
            return formatTipsText(tips.answer);
        }
        return null;
    };

    return (
        <Box p={3} className="resume-tips-container">
            <Typography variant="h4" gutterBottom>Resume Tips</Typography>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Here are your personalized resume tips:</Typography>
                    <Box mb={2} display="flex" gap={2}>
                        <Button
                            variant="contained"
                            onClick={handleSuggest}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Get Tips"}
                        </Button>
                    </Box>
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '4px', p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                        {tips ? (
                            <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                {renderTips()}
                            </Box>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No tips to display.
                            </Typography>
                        )}
                    </Box>
                    {tips && tips.links && tips.links.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>Sources:</Typography>
                            <List dense>
                                {tips.links.map((link, index) => (
                                    <ListItem key={index}>
                                        <Link href={link} target="_blank" rel="noopener noreferrer">
                                            {`[${index + 1}] ${link}`}
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
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

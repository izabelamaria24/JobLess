import React, { useState, useContext } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { Box, Typography, Button, Card, CardContent, Select, MenuItem, FormControl, InputLabel, Divider, List, ListItem, Link, CircularProgress, Grid } from '@mui/material';
import '../design/InterviewQuestions.css';


const InterviewQuestions = () => {
  const { applications, getInterviewQuestions } = useContext(ApplicationContext);
  const [selectedApp, setSelectedApp] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedApp(event.target.value);
  };

  const handleGetQuestions = async () => {
    if (!selectedApp) return;

    const application = applications.find(app => app.id === selectedApp);
    if (!application) return;

    setLoading(true);
    try {
      const result = await getInterviewQuestions(application.company, application.jobTitle);
      setResults(result);
    } catch (error) {
      console.error("Failed to get interview questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const cleanAnswer = (answer) => {
    let cleaned = answer.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    }
    return cleaned;
  };


  const renderInterviewQuestions = () => {
    let questions = [];
    try {
      const cleanedAnswer = cleanAnswer(results.answer);
      questions = JSON.parse(cleanedAnswer);
    } catch (e) {
      console.error("Error parsing interview questions:", e);
      return <Typography color="error">Failed to parse results.</Typography>;
    }

    return (
      <Grid container spacing={2} className="questions-grid">
        {questions.map((question, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined" className="question-card">
              <CardContent>
                <Typography variant="h6" className="question-title">
                  {question.title}
                </Typography>
                <Typography variant="caption" className="question-category" display="block" gutterBottom>
                  Category: {question.category}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" className="question-content">
                  {question.contents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box p={3} className="interview-container">
      <Typography variant="h4" gutterBottom>Interview Questions</Typography>
 
      <Box className="selection-container" mb={4}>
        <Typography variant="h6" gutterBottom>Select a job application:</Typography>
        <Card variant="outlined">
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="application-select-label">Job Application</InputLabel>
              <Select
                labelId="application-select-label"
                id="application-select"
                value={selectedApp}
                label="Job Application"
                onChange={handleChange}
              >
                {applications.map((app) => (
                  <MenuItem key={app.id} value={app.id}>
                    {app.company} - {app.jobTitle} ({app.location})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box mt={2} display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleGetQuestions}
                disabled={!selectedApp || loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Get Interview Questions"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {results && (
        <Box className="results-container" mb={4}>
          <Typography variant="h6" gutterBottom>Interview Questions:</Typography>
          <Card variant="outlined">
            <CardContent>
              {renderInterviewQuestions()}
              {results.links && results.links.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Sources:</Typography>
                  <List dense>
                    {results.links.map((link, index) => (
                      <ListItem key={index}>
                        <Link href={link} target="_blank" rel="noopener noreferrer">
                          {`[${index + 1}] ${link}`}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default InterviewQuestions;
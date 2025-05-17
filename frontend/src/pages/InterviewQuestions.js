import React, { useState, useContext } from 'react';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import { Box, Typography, Button, Card, CardContent, Select, MenuItem, FormControl, InputLabel, Divider, List, ListItem, Link, CircularProgress } from '@mui/material';

const InterviewQuestions = () => {
  const { applications, getInterviewQuestions } = useContext(JobApplicationsContext);
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Interview Questions</Typography>
      
      <Box mb={4}>
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
        <Box>
          <Typography variant="h6" gutterBottom>Interview Questions:</Typography>
          <Card variant="outlined">
            <CardContent>
              {results.answer.split(/\d+\.\s+\*\*/).map((section, index) => {
                if (index === 0) return null; // Skip the first empty split
                
                const questionMatch = section.match(/^(.*?)\.*\*\*\s+(.*)/s);
                if (questionMatch) {
                  const [, question, explanation] = questionMatch;
                  return (
                    <Box key={index} mb={3}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {index}. {question}
                      </Typography>
                      <Typography variant="body2">
                        {explanation.replace(/\[\d+(,\s*\d+)*\]/g, '')}
                      </Typography>
                    </Box>
                  );
                }
                return <Typography key={index} variant="body1">{section}</Typography>;
              })}
              
              {results.links && results.links.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Sources:</Typography>
                  <List>
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
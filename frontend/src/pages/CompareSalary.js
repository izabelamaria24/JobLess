import React, { useState, useContext } from 'react';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import { Box, Typography, Button, Card, CardContent, Checkbox, FormControlLabel, Divider, List, ListItem, Link, CircularProgress, Grid } from '@mui/material';

const CompareSalary = () => {
  const { applications, compareSalary } = useContext(JobApplicationsContext);
  const [selectedApps, setSelectedApps] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggleSelection = (app) => {
    setSelectedApps(prev => 
      prev.some(item => item.id === app.id)
        ? prev.filter(item => item.id !== app.id)
        : [...prev, app]
    );
  };

  const handleCompare = async () => {
    if (selectedApps.length < 2) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await compareSalary(selectedApps);
      setResults(result);
    } catch (error) {
      console.error("Comparison failed:", error);
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

  const renderComparisonResults = () => {
    let jobs = [];
    try {
      const cleanedAnswer = cleanAnswer(results.answer);
      jobs = JSON.parse(cleanedAnswer);
    } catch (e) {
      console.error("Error parsing salary results:", e);
      return <Typography color="error">Failed to parse results.</Typography>;
    }

    return (
      <Grid container spacing={2}>
        {jobs.map((job, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>{job.company}</Typography>
                <Typography variant="subtitle1">{job.jobTitle}</Typography>
                <Typography variant="body2" color="textSecondary">{job.location}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                  {job.salary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Compare Salaries</Typography>
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Select applications to compare:</Typography>
        <Card variant="outlined">
          <CardContent>
            <List>
              {applications.map(app => (
                <ListItem key={app.id} divider>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedApps.some(item => item.id === app.id)}
                        onChange={() => handleToggleSelection(app)}
                      />
                    }
                    label={`${app.company} - ${app.jobTitle} (${app.location})`}
                  />
                </ListItem>
              ))}
            </List>
            <Box mt={2} display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleCompare}
                disabled={selectedApps.length < 2 || loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Compare Salaries"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {results && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>Comparison Results:</Typography>
          <Card variant="outlined">
            <CardContent>
              {renderComparisonResults()}
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

export default CompareSalary;
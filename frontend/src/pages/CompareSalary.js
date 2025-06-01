import React, { useState, useContext } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { 
  Box, Typography, Button, Card, CardContent, Checkbox, FormControlLabel, Divider, List, ListItem, Link, CircularProgress 
} from '@mui/material';
import '../design/CompareSalary.css';

const CompareSalary = () => {
  const { applications, compareSalary } = useContext(ApplicationContext);
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
    if (selectedApps.length < 2) return;
    
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

  // A new helper function that parses the JSON response and renders cards for each job.
  const renderComparisonResults = () => {
    let jobs = [];
    try {
      let answer = results.answer.trim();
      if (answer.startsWith("```json")) {
        answer = answer.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      }
      jobs = JSON.parse(answer);
    } catch (e) {
      console.error("Error parsing results:", e);
      return <Typography color="error">Failed to parse salary comparison results.</Typography>;
    }
    
    return (
      <Box className="results-cards">
        {jobs.map((job, index) => (
          <Card key={index} variant="outlined" className="result-card">
            <CardContent>
              <Typography variant="h6">{job.company}</Typography>
              <Typography variant="subtitle1">{job.jobTitle}</Typography>
              <Typography variant="body2" color="textSecondary">{job.location}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" className="job-salary">{job.salary}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box p={3} className="compare-container">
      <Typography variant="h4" gutterBottom>Compare Salaries</Typography>

      {/* Selection container */}
      <Box className="selection-container">
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

      {/* Results container */}
      {results && (
        <Box className="results-container">
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
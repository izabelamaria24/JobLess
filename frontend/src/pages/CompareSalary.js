import React, { useState, useContext } from 'react';
import { JobApplicationsContext } from '../context/JobApplicationsContext';
import { Box, Typography, Button, Card, CardContent, Checkbox, FormControlLabel, Divider, List, ListItem, Link, CircularProgress } from '@mui/material';

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
        <Box>
          <Typography variant="h6" gutterBottom>Comparison Results:</Typography>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {results.answer}
              </Typography>
              
              {results.links && results.links.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Sources:</Typography>
                  <List>
                    {results.links.map((link, index) => (
                      <ListItem key={index}>
                        <Link href={link} target="_blank" rel="noopener noreferrer">
                          {link}
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
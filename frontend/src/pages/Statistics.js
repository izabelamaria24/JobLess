import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [stagesData, setStagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const stageColors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#FF5722', // Deep Orange
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#795548', // Brown
  ];

  const actionColors = [
    '#3F51B5', // Indigo
    '#009688', // Teal
    '#FF9800', // Orange
    '#F44336', // Red
    '#8BC34A', // Light Green
    '#607D8B', // Blue Grey
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const [summaryRes, stagesRes] = await Promise.all([
          axiosInstance.get('/api/Applications/summary'),
          axiosInstance.get('/api/Applications/stages')
        ]);
        
        setSummaryData(summaryRes.data);
        setStagesData(stagesRes.data);
      } catch (err) {
        setError('Failed to load statistics data');
        console.error('Error loading statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const applicationStagesData = {
    labels: summaryData?.stages ? Object.keys(summaryData.stages) : [],
    datasets: [
      {
        data: summaryData?.stages ? Object.values(summaryData.stages) : [],
        backgroundColor: stageColors.slice(0, summaryData?.stages ? Object.keys(summaryData.stages).length : 0),
        borderColor: stageColors.slice(0, summaryData?.stages ? Object.keys(summaryData.stages).length : 0),
        borderWidth: 1,
      },
    ],
  };

  const responseStagesData = {
    labels: stagesData?.stages ? Object.keys(stagesData.stages) : [],
    datasets: [
      {
        label: 'Number of Responses',
        data: stagesData?.stages ? Object.values(stagesData.stages) : [],
        backgroundColor: actionColors.slice(0, stagesData?.stages ? Object.keys(stagesData.stages).length : 0),
      },
    ],
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Application Statistics</Typography>

      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Applications</Typography>
                <Typography variant="h3" align="center" color="primary">
                  {summaryData?.totalApplications || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Active Applications</Typography>
                <Typography variant="h3" align="center" color="secondary">
                  {summaryData?.activeApplications || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Response Stages</Typography>
                <Typography variant="h3" align="center" style={{ color: '#FF9800' }}>
                  {stagesData?.totalStages || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Applications by Status</Typography>
              {summaryData?.stages && Object.keys(summaryData.stages).length > 0 ? (
                <Box height={300}>
                  <Pie 
                    data={applicationStagesData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Typography align="center">No status data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Responses by Type</Typography>
              {stagesData?.stages && Object.keys(stagesData.stages).length > 0 ? (
                <Box height={300}>
                  <Bar 
                    data={responseStagesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.dataset.label || '';
                              const value = context.raw || 0;
                              return `${label}: ${value}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Typography align="center">No response data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
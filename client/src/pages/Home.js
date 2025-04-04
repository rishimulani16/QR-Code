import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  CameraAlt as CameraIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Generate QR Codes',
      description: 'Create QR codes from text or URLs with a single click.',
      icon: <QrCodeIcon sx={{ fontSize: 40 }} />,
      path: '/generate',
    },
    {
      title: 'Scan QR Codes',
      description: 'Use your device camera to scan and decode QR codes.',
      icon: <CameraIcon sx={{ fontSize: 40 }} />,
      path: '/scan',
    },
    {
      title: 'View History',
      description: 'Access your generated QR codes with filtering and pagination.',
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      path: '/history',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Welcome to QR Code System
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Generate, scan, and manage QR codes with ease
        </Typography>
        {!isAuthenticated && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Paper>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s',
                },
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 
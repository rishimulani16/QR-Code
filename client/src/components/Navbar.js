import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  CameraAlt as CameraIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          QR Code System
        </Typography>
        {isAuthenticated ? (
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/generate"
              startIcon={<QrCodeIcon />}
            >
              Generate
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/scan"
              startIcon={<CameraIcon />}
            >
              Scan
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/history"
              startIcon={<HistoryIcon />}
            >
              History
            </Button>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Signup
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
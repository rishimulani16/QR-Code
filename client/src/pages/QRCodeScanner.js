import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import axios from 'axios';

const QRCodeScanner = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      setError('');
    }
  };

  const handleError = (err) => {
    setError(err?.message || 'Error scanning QR code');
  };

  const handleCopy = () => {
    if (!result) return;

    navigator.clipboard.writeText(result);
    setSnackbar({
      open: true,
      message: 'Text copied to clipboard',
      severity: 'success',
    });
  };

  const handleOpenUrl = () => {
    if (!result) return;

    if (result.startsWith('http://') || result.startsWith('https://')) {
      window.open(result, '_blank');
    } else {
      setSnackbar({
        open: true,
        message: 'Not a valid URL',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Scan QR Code
        </Typography>
        <Box sx={{ mb: 4 }}>
          <QrScanner
            onDecode={handleScan}
            onError={handleError}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
        </Box>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        {result && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Scanned Result:
            </Typography>
            <TextField
              fullWidth
              value={result}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                sx={{ mr: 1 }}
              >
                Copy
              </Button>
              <Button
                startIcon={<OpenInNew />}
                onClick={handleOpenUrl}
              >
                Open URL
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QRCodeScanner; 
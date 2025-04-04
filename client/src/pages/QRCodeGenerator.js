import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share, ContentCopy } from '@mui/icons-material';
import axios from 'axios';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleGenerate = async () => {
    if (!text.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter text or URL',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/qrcodes', { text });
      setQrCode(response.data.qrCode);
      setSnackbar({
        open: true,
        message: 'QR Code generated successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error generating QR Code',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode.imageUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    if (!qrCode) return;

    navigator.clipboard.writeText(qrCode.text);
    setSnackbar({
      open: true,
      message: 'Text copied to clipboard',
      severity: 'success',
    });
  };

  const handleShare = async () => {
    if (!qrCode) return;

    const recipientEmail = prompt('Enter recipient email:');
    if (!recipientEmail) return;

    try {
      await axios.post('http://localhost:5000/api/qrcodes/share', {
        qrCodeId: qrCode.id,
        recipientEmail,
      });
      setSnackbar({
        open: true,
        message: 'QR Code shared successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error sharing QR Code',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate QR Code
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter text or URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading}
              fullWidth
            >
              Generate QR Code
            </Button>
          </Grid>
          {qrCode && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <QRCodeSVG value={qrCode.text} size={256} />
                <Box sx={{ mt: 2 }}>
                  <Button
                    startIcon={<Download />}
                    onClick={handleDownload}
                    sx={{ mr: 1 }}
                  >
                    Download
                  </Button>
                  <Button
                    startIcon={<ContentCopy />}
                    onClick={handleCopy}
                    sx={{ mr: 1 }}
                  >
                    Copy Text
                  </Button>
                  <Button
                    startIcon={<Share />}
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
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

export default QRCodeGenerator; 
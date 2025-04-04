import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const QRCodeHistory = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchQrCodes = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 6,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await axios.get(`http://localhost:5000/api/qrcodes?${params}`);
      setQrCodes(response.data.qrCodes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error fetching QR codes',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, [page, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/qrcodes/${id}`);
      setSnackbar({
        open: true,
        message: 'QR Code deleted successfully',
        severity: 'success',
      });
      fetchQrCodes();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error deleting QR code',
        severity: 'error',
      });
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (qrCode) => {
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
        message: error.response?.data?.message || 'Error sharing QR code',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          QR Code History
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Grid container spacing={3}>
          {qrCodes.map((qrCode) => (
            <Grid item xs={12} sm={6} md={4} key={qrCode._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {qrCode.text.length > 30
                      ? `${qrCode.text.substring(0, 30)}...`
                      : qrCode.text}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {format(new Date(qrCode.generatedAt), 'PPp')}
                  </Typography>
                  <Box
                    component="img"
                    src={qrCode.imageUrl}
                    alt="QR Code"
                    sx={{ width: '100%', height: 'auto' }}
                  />
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownload(qrCode.imageUrl)}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleShare(qrCode)}
                  >
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(qrCode._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
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

export default QRCodeHistory; 
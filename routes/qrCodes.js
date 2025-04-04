const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const QRCodeModel = require('../models/QRCode');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Generate QR Code
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const isUrl = text.startsWith('http://') || text.startsWith('https://');

    // Generate QR Code image
    const qrCodeDataUrl = await QRCode.toDataURL(text);

    // Save QR Code to database
    const qrCode = new QRCodeModel({
      text,
      userId: req.user._id,
      imageUrl: qrCodeDataUrl,
      isUrl
    });

    await qrCode.save();

    res.status(201).json({
      message: 'QR Code generated successfully',
      qrCode: {
        id: qrCode._id,
        text: qrCode.text,
        imageUrl: qrCode.imageUrl,
        generatedAt: qrCode.generatedAt,
        isUrl: qrCode.isUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR Code', error: error.message });
  }
});

// Get all QR Codes with pagination and date filtering
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.generatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const qrCodes = await QRCodeModel.find(query)
      .sort({ generatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await QRCodeModel.countDocuments(query);

    res.json({
      qrCodes,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching QR Codes', error: error.message });
  }
});

// Delete QR Code
router.delete('/:id', auth, async (req, res) => {
  try {
    const qrCode = await QRCodeModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    res.json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting QR Code', error: error.message });
  }
});

// Share QR Code via email
router.post('/share', auth, async (req, res) => {
  try {
    const { qrCodeId, recipientEmail } = req.body;

    const qrCode = await QRCodeModel.findOne({
      _id: qrCodeId,
      userId: req.user._id
    });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Shared QR Code',
      html: `
        <h1>QR Code Shared with You</h1>
        <p>Here is the QR Code that was shared with you:</p>
        <img src="${qrCode.imageUrl}" alt="QR Code" />
        <p>Content: ${qrCode.text}</p>
      `
    });

    res.json({ message: 'QR Code shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing QR Code', error: error.message });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: true
  },
  isUrl: {
    type: Boolean,
    default: false
  }
});

// Index for better query performance
qrCodeSchema.index({ userId: 1, generatedAt: -1 });

module.exports = mongoose.model('QRCode', qrCodeSchema); 
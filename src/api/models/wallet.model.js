const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const walletSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Use UUID as the ID for the wallet
  balance: { type: Number, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wallet', walletSchema);

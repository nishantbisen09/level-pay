const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const transactionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // system generated ids)
  walletId: { type: String, required: true }, // Store the wallet ID as a string
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
})

module.exports = mongoose.model('Transaction', transactionSchema)

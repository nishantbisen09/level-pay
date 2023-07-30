const httpStatus = require('http-status')
const Wallet = require('../models/wallet.model')
const Transaction = require('../models/transaction.model')

const initializeWallet = async (req, res) => {
  try {
    const { balance, name } = req.body
    // Check if the username already exists in the database
    const existingWallet = await Wallet.findOne({ name })
    console.log('existingWallet', existingWallet)
    if (existingWallet) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Username already exists. Please choose a different username.',
      })
    }

    const wallet = await Wallet.create({ balance, name })

    // Create a new transaction to record the initial setup balance
    const transaction = await Transaction.create({
      walletId: wallet._id,
      amount: balance,
      balance,
      description: 'Wallet initialized!',
      type: 'CREDIT',
    })

    res.status(httpStatus.OK).json({
      id: wallet._id,
      balance: wallet.balance,
      transactionId: transaction._id,
      name: wallet.name,
      date: wallet.createdAt,
    })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error })
  }
}

const getWalletDetails = async (req, res) => {
  try {
    const { id } = req.params
    const wallet = await Wallet.findById(id)
    if (!wallet) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Wallet not found' })
    }

    res.status(httpStatus.OK).json({
      id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.createdAt,
    })
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Unable to fetch wallet details' })
  }
}

module.exports = {
  initializeWallet,
  getWalletDetails,
}

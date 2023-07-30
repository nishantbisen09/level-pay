const fs = require('fs')
const path = require('path')

const httpStatus = require('http-status')
const { startSession } = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const Wallet = require('../models/wallet.model')
const Transaction = require('../models/transaction.model')

const creditDebitAmount = async (req, res) => {
  const session = await startSession()
  session.startTransaction()
  try {
    const { walletId } = req.params
    const { amount, description, type } = req.body

    // Convert the amount to have 4 decimal precision
    const roundedAmount = parseFloat(amount.toFixed(4))

    // Validate that the amount is not zero
    if (roundedAmount === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Amount must be non-zero' })
    }

    const wallet = await Wallet.findById(walletId)
    if (!wallet) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Wallet not found' })
    }

    // Calculate the new balance based on the type of transaction (CREDIT or DEBIT)
    let newBalance
    if (type === 'CREDIT') {
      newBalance = wallet.balance + roundedAmount
    } else if (type === 'DEBIT') {
      // Ensure the debit amount does not exceed the current balance
      if (roundedAmount > wallet.balance) {
        return res.status(httpStatus.BAD_REQUEST).json({
          error: 'Insufficient balance for debit transaction',
        })
      }
      newBalance = wallet.balance - roundedAmount
    }

    // Update the wallet's balance
    wallet.balance = parseFloat(newBalance.toFixed(4))
    await wallet.save({ session })

    // Create a new transaction
    const transaction = new Transaction({
      walletId: wallet._id,
      amount: roundedAmount,
      balance: parseFloat(newBalance.toFixed(4)),
      description,
      type,
    })

    // Save the transaction to the database
    await transaction.save({ session })

    await session.commitTransaction()

    res.status(httpStatus.OK).json({
      balance: parseFloat(wallet.balance.toFixed(4)),
      transactionId: transaction._id,
    })
  } catch (error) {
    await session.abortTransaction()
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error processing the transaction',
    })
  } finally {
    session.endSession()
  }
}

const fetchTransactions = async (req, res) => {
  try {
    const { walletId, skip = 0, limit = 10 } = req.query
    const wallet = await Wallet.findById(walletId)
    if (!wallet) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Wallet not found' })
    }

    const transactions = await Transaction.find({ walletId })
      .sort({ date: -1 })
      .skip(Number(skip))
      .limit(Number(limit))

    const totalCount = await Transaction.countDocuments({ walletId })

    res.status(httpStatus.OK).json({ transactions, totalCount })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Unable to fetch transactions',
    })
  }
}

const downloadTransactionsCSV = async (req, res, next) => {
  try {
    const { walletId } = req.params

    // Fetch all transactions for the given walletId
    const transactions = await Transaction.find({ walletId }).sort({ date: -1 })

    // Set the response headers to trigger the file download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${walletId}_transactions.csv`
    )

    // Create the tmp directory if it doesn't exist
    const tmpDirectory = path.join(__dirname, '../tmp')
    if (!fs.existsSync(tmpDirectory)) {
      fs.mkdirSync(tmpDirectory)
    }

    // Create the CSV writer
    const csvWriter = createCsvWriter({
      header: [
        { id: '_id', title: 'Transaction ID' },
        { id: 'walletId', title: 'Wallet ID' },
        { id: 'amount', title: 'Amount' },
        { id: 'balance', title: 'Balance' },
        { id: 'description', title: 'Description' },
        { id: 'date', title: 'Date' },
        { id: 'type', title: 'Type' },
      ],
      path: path.join(tmpDirectory, 'transactions.csv'), // Set the temporary file path (optional)
    })

    // Write the transactions to the CSV file
    await csvWriter.writeRecords(transactions)

    // Stream the CSV file to the response
    const readStream = fs.createReadStream(
      path.join(tmpDirectory, 'transactions.csv')
    ) // Path to the temporary file
    readStream.pipe(res)

    // Remove the temporary file after streaming
    readStream.on('end', () => {
      fs.unlinkSync(path.join(tmpDirectory, 'transactions.csv'))
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  creditDebitAmount,
  fetchTransactions,
  downloadTransactionsCSV,
}

const express = require('express')
const validate = require('express-validation')
const controller = require('../../controllers/transaction.controller')
const {
  creditDebitAmount,
  fetchTransactions,
} = require('../../validations/transaction.validation')

const router = express.Router()

router
  .route('/transact/:walletId')
  .post(validate(creditDebitAmount), controller.creditDebitAmount)

router
  .route('/transactions')
  .get(validate(fetchTransactions), controller.fetchTransactions)

router.route('/downloadCSV/:walletId').get(controller.downloadTransactionsCSV)

module.exports = router

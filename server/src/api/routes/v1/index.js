const express = require('express')
const walletRoutes = require('./wallet.route')
const transactionRoutes = require('./transaction.route')

const router = express.Router()

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'))

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'))

router.use('/wallet', walletRoutes)
router.use('/transaction', transactionRoutes)

module.exports = router

const Joi = require('joi');

module.exports = {
  // POST /api/transactions/:walletId
  creditDebitAmount: {
    params: {
      walletId: Joi.string().uuid({ version: 'uuidv4' }).required(), // Wallet ID should be a valid UUID v4
    },
    body: {
      amount: Joi.number().required().min(0).precision(4), // Amount should be a positive number
      description: Joi.string().max(256),
      type: Joi.string().valid('CREDIT', 'DEBIT').required(), // Type can be either 'CREDIT' or 'DEBIT'
    },
  },

  // GET /api/wallets/transactions
  fetchTransactions: {
    query: {
      walletId: Joi.string().uuid({ version: 'uuidv4' }).required(), // Wallet ID should be a valid UUID v4
      skip: Joi.number().min(0).default(0), // 'skip' should be a non-negative number, default to 0
      limit: Joi.number().min(1).max(100).default(10), // 'limit' should be between 1 and 100
    },
  },
};

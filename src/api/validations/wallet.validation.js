const Joi = require('joi');

module.exports = {
  // POST /api/wallets/setup
  initializeWallet: {
    body: {
      balance: Joi.number().required().min(0).precision(4), // Balance should be a positive number
      name: Joi.string().max(128),
    },
  },

  // GET /api/wallets/:id
  getWalletDetails: {
    params: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required(), // Wallet ID should be a valid UUID v4
    },
  },
};

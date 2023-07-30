const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/wallet.controller');
const {
  initializeWallet,
  getWalletDetails,
} = require('../../validations/wallet.validation');

const router = express.Router();

router.route('/setup')
  .post(validate(initializeWallet), controller.initializeWallet);

router.route('/:id')
  .get(validate(getWalletDetails), controller.getWalletDetails);

module.exports = router;

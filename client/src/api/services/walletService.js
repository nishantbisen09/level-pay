// services/walletService.js

import api from '../api'

const walletService = {
  initializeWallet: async (username, initialBalance) => {
    try {
      const response = await api.post('/wallet/setup', {
        balance: initialBalance,
        name: username,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  creditDebitAmount: async (walletId, amount, description, type) => {
    try {
      const response = await api.post(`/transaction/transact/${walletId}`, {
        amount,
        description,
        type,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  getWalletTransactions: async (walletId, skip, limit) => {
    try {
      const response = await api.get(
        `/transaction/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`
      )
      return response
    } catch (error) {
      throw error
    }
  },

  getWalletDetails: async (walletId) => {
    try {
      const response = await api.get(`/wallet/${walletId}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default walletService

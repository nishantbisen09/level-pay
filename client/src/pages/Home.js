import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import walletService from '../api/services/walletService'
import userAccount from '../assets/user-account-placeholder.jpeg'
import { useLoader } from '../contexts/LoaderContext'
import LocalStorageUtil from '../util/LocalStorageUtil'
import { toast } from 'react-hot-toast'
import InfoIcon from '@mui/icons-material/Info'

const WalletApp = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [initialBalance, setInitialBalance] = useState()
  const walletId = LocalStorageUtil.getItem('walletId')
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactionAmount, setTransactionAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isCreditTransaction, setIsCreditTransaction] = useState(true)
  const { showLoader, hideLoader } = useLoader()

  useEffect(() => {
    if (walletId) {
      // Fetch wallet details if walletId is available
      fetchWalletDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchWalletDetails = async () => {
    try {
      showLoader()
      const walletDetails = await walletService.getWalletDetails(walletId)
      setUsername(walletDetails.name)
      setWalletBalance(walletDetails.balance)
      hideLoader()
    } catch (error) {
      hideLoader()
      console.error('Error fetching wallet details:', error)
      toast.error(error.response.data.error)
    }
  }

  const handleInitializeWallet = async () => {
    if (!username) {
      toast('Username is required!')
      return
    }
    try {
      showLoader()
      const response = await walletService.initializeWallet(
        username,
        parseFloat(initialBalance || 0)
      )
      LocalStorageUtil.setItem('walletId', response.id)
      setWalletBalance(response.balance)
      hideLoader()
    } catch (error) {
      hideLoader()
      console.error('Error initializing wallet:', error)
      toast.error(error.response.data.error)
    }
  }

  const handleTransaction = async () => {
    if (!transactionAmount) {
      toast('Transaction amount is required!', {
        icon: <InfoIcon sx={{ color: 'yellowgreen' }} />,
      })
      return
    }
    const amount = parseFloat(parseFloat(transactionAmount).toFixed(4))
    const type = isCreditTransaction ? 'CREDIT' : 'DEBIT'
    setTransactionAmount('')

    try {
      showLoader()
      const response = await walletService.creditDebitAmount(
        walletId,
        amount,
        description,
        type
      )
      setWalletBalance(response.balance)
      hideLoader()
    } catch (error) {
      hideLoader()
      console.error('Error executing transaction:', error)
      toast.error(error.response.data.error)
    }
  }

  return (
    <Box sx={{ height: '100vh', background: '#F0EDD4' }}>
      {!walletId && (
        <Card
          sx={{
            p: 3,
            height: 220,
            width: 400,
            background: '#F9FBE7',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
          }}
          elevation={2}
        >
          <TextField
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="balance"
            value={initialBalance}
            onChange={(e) =>
              (/^[+-]?\d+(\.\d*)?$/.test(e.target.value) || !e.target.value) &&
              setInitialBalance(e.target.value)
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            sx={{
              mt: 1,
              borderRadius: '8px',
              background: '#FEA1A1',
            }}
            onClick={handleInitializeWallet}
          >
            Initialize Wallet
          </Button>
        </Card>
      )}

      {walletId && (
        <Grid container height="100%">
          <Grid item md={7} position="relative" p={3}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 8,
                border: '1px solid #FEA1A1',
                color: '#FEA1A1',
                '&:hover': {
                  backgroundColor: 'transparent', // Same color on hover
                  border: '1px solid #FEA1A1',
                },
                '&:active': {
                  backgroundColor: 'transparent', // Same color on active
                  border: '1px solid #FEA1A1',
                },
                mr: 3,
              }}
              onClick={() => navigate('/')}
            >
              Dashboard
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 8,
                border: '1px solid #FEA1A1',
                color: '#FEA1A1',
                '&:hover': {
                  backgroundColor: 'transparent', // Same color on hover
                  border: '1px solid #FEA1A1',
                },
                '&:active': {
                  backgroundColor: 'transparent', // Same color on active
                  border: '1px solid #FEA1A1',
                },
              }}
              onClick={() => navigate('/transactions')}
            >
              Transactions
            </Button>
            <Card
              sx={{
                p: 3,
                width: 400,
                background: '#F9FBE7',
                borderRadius: '8px',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              elevation={2}
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Grid item>
                  <TextField
                    label="Transaction Amount"
                    value={transactionAmount}
                    onChange={(e) =>
                      (/^[+-]?\d+(\.\d*)?$/.test(e.target.value) ||
                        !e.target.value) &&
                      setTransactionAmount(e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />

                  <TextField
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={isCreditTransaction}
                        onChange={() => setIsCreditTransaction((prev) => !prev)}
                      />
                    }
                    label={
                      isCreditTransaction
                        ? 'Credit Transaction'
                        : 'Debit Transaction'
                    }
                  />

                  <Button
                    variant="contained"
                    sx={{ background: '#FEA1A1' }}
                    onClick={handleTransaction}
                  >
                    Execute Transaction
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid
            item
            md={5}
            sx={{
              boxShadow: '-11px 2px 19px -10px rgba(0,0,0,0.63)',
              backgroundColor: '#F0EDD4',
              p: 5,
            }}
          >
            <Card
              sx={{
                maxWidth: 350,
                height: 400,
                background: '#F9FBE7',
                p: 2,
                m: '0 auto',
              }}
            >
              <CardMedia
                component="img"
                image={userAccount}
                sx={{
                  borderRadius: '50% !important',
                  height: '200px !important',
                  width: '200px !important',
                  margin: '0 auto',
                }}
              />
              <CardContent>
                <Typography variant="h5" textAlign="center" gutterBottom>
                  <Typography
                    variant="body2"
                    textAlign="center"
                    display="inline-block"
                    gutterBottom
                  >
                    Welcome
                  </Typography>{' '}
                  {username}!
                </Typography>
                <Typography
                  variant="h6"
                  textAlign="center"
                  fontSize="1rem"
                  gutterBottom
                >
                  Wallet Balance:
                  <Typography variant="body2"> {walletBalance}</Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default WalletApp

import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import walletService from '../api/services/walletService'
import LocalStorageUtil from '../util/LocalStorageUtil'
import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { useLoader } from '../contexts/LoaderContext'

const columns = [
  {
    field: 'amount',
    headerName: 'Amount',
    width: 130,
    type: 'number',
    sortable: true,
    valueGetter: (params) => {
      const isCredit = params.row.type === 'CREDIT'
      return params.row.amount * (isCredit ? 1 : -1)
    },
    renderCell: (params) => {
      const isCredit = params.row.type === 'CREDIT'
      return (
        <Typography variant="body" color={isCredit ? 'green' : 'red'}>
          {params.row.amount * (isCredit ? 1 : -1)}
        </Typography>
      )
    },
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 160,
    sortable: false,
    headerAlign: 'center',
    renderCell: (params) => {
      return (
        <Typography variant="body" textAlign="center" width="100%">
          {params.row.description}
        </Typography>
      )
    },
  },
  {
    field: 'date',
    headerName: 'Date',
    sortable: true,
    type: 'date',
    valueGetter: (params) => {
      return moment(params.row.date)
    },
    valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY'),
    width: 160,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 130,
  },
  {
    field: 'balance',
    headerName: 'Balance',
    width: 130,
  },
]

const Transactions = () => {
  const navigate = useNavigate()
  const walletId = LocalStorageUtil.getItem('walletId')
  const { loading } = useLoader()
  const [transactions, setTransactions] = useState([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [rowCount, setRowCount] = useState()

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletId) {
        return navigate('/')
      }
      const response = await walletService.getWalletTransactions(
        walletId,
        paginationModel.page * paginationModel.pageSize,
        paginationModel.pageSize
      )
      setTransactions(response.transactions)
      setRowCount(response.totalCount)
    }
    fetchTransactions()
  }, [navigate, paginationModel.page, paginationModel.pageSize, walletId])

  return (
    <Box
      sx={{
        height: '100vh',
        background: '#F0EDD4',
        p: 3,
        boxSizing: 'border-box',
      }}
    >
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
      <Box sx={{ height: '70vh', width: '50vw', p: 5, margin: '0 auto' }}>
        <Button
          variant="contained"
          LinkComponent="a"
          sx={{
            mt: 1,
            borderRadius: '8px',
            background: '#FEA1A1',
            mb: 2,
          }}
          href={`https://level-pay.onrender.com/transaction/downloadCSV/${walletId}`}
          target="_blank"
        >
          Download CSV
        </Button>
        <DataGrid
          sx={{ background: '#F9FBE7' }}
          rows={transactions}
          columns={columns}
          getRowId={() => uuidv4()}
          pageSizeOptions={[5, 10, 15, 20, 25]}
          disableRowSelectionOnClick
          rowCount={rowCount}
          loading={loading}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={(data) => setPaginationModel(data)}
        />
      </Box>
    </Box>
  )
}

export default Transactions

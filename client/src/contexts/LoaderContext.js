// contexts/LoaderContext.js

import { Backdrop, CircularProgress } from '@mui/material'
import React, { createContext, useContext, useState } from 'react'

const LoaderContext = createContext()

const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const showLoader = () => {
    setLoading(true)
  }

  const hideLoader = () => {
    setLoading(false)
  }

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  )
}

const useLoader = () => {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }
  return context
}

const Loader = () => {
  const { loading } = useLoader()

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export { Loader, LoaderProvider, useLoader }

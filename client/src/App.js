import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import { Loader, LoaderProvider } from './contexts/LoaderContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <LoaderProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
      <Loader />
      <Toaster />
    </LoaderProvider>
  )
}

export default App

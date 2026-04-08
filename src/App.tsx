import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OverviewPage } from './pages/OverviewPage'
import { OperationsPage } from './pages/OperationsPage'
import { SalesPage } from './pages/SalesPage'
import { FinancePage } from './pages/FinancePage'
import { ProcurementPage } from './pages/ProcurementPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/procurement" element={<ProcurementPage />} />
      </Routes>
    </BrowserRouter>
  )
}

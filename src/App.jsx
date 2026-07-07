import LandingPage from './pages/LandingPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
    <div className="min-h-screen bg-white text-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </div>
    </Router>
  )
}

export default App
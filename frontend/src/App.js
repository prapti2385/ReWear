import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Layout and Protected Route
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ItemDetailPage from './pages/ItemDetailPage';
import UserDashboard from './pages/UserDashboard';
import AddItemPage from './pages/AddItemPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />

            {/* Private User Routes */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/add-item" 
              element={<ProtectedRoute><AddItemPage /></ProtectedRoute>} 
            />

            {/* Private Admin Route */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} 
            />

            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
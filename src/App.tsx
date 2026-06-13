/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';

// Public pages
import Home from './pages/public/Home';

// Admin pages
import Login from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Overview from './pages/admin/Overview';
import Appointments from './pages/admin/Appointments';
import Services from './pages/admin/Services';
import BusinessHours from './pages/admin/BusinessHours';
import BlockedDates from './pages/admin/BlockedDates';
import BusinessSettings from './pages/admin/BusinessSettings';

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/admin/login" element={<Login />} />
            
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="services" element={<Services />} />
                <Route path="hours" element={<BusinessHours />} />
                <Route path="blocked-dates" element={<BlockedDates />} />
                <Route path="settings" element={<BusinessSettings />} />
              </Route>
            </Route>

          </Routes>
        </AdminProvider>
      </AppProvider>
    </Router>
  );
}


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import PlacePage from './pages/PlacePage';
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';
import SavedPage from './pages/SavedPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import RoutePage from './pages/RoutePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="place/:id" element={<PlacePage />} />
                <Route path="report" element={<ReportPage />} />
                <Route path="saved" element={<SavedPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="route" element={<RoutePage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

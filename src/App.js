import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/layout/LoadingScreen';
import CompareBar from './components/layout/CompareBar';
import Gallery from './features/gallery/Gallery';
import Passport from './features/passport/Passport';
import Compare from './features/compare/Compare';
import Swap from './features/swap/Swap';
import AddVehicle from './features/add-vehicle/AddVehicle';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const [loading, setLoading] = useState(true);
  const onLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <HashRouter>
      <LoadingScreen onComplete={onLoadingComplete} />
      {!loading && (
        <AppShell
          padding={0}
          styles={{
            main: {
              background: 'var(--ag-bg-base)',
              minHeight: '100vh',
            }
          }}
        >
          <Navbar />

          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/passport/:id" element={<Passport />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/swap/:id" element={<Swap />} />
              <Route path="/add-vehicle" element={<AddVehicle />} />
              <Route path="/edit-vehicle/:id" element={<AddVehicle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </AppShell.Main>

          <CompareBar />
        </AppShell>
      )}
    </HashRouter>
  );
}

export default App;

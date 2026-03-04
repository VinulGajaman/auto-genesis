import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';
import CompareBar from './components/CompareBar';
import Gallery from './pages/Gallery';
import Passport from './pages/Passport';
import Compare from './pages/Compare';
import Swap from './pages/Swap';
import AddVehicle from './pages/AddVehicle';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);
  const onLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <AppProvider>
      <HashRouter>
        <LoadingScreen onComplete={onLoadingComplete} />
        {!loading && (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/passport/:id" element={<Passport />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/swap/:id" element={<Swap />} />
              <Route path="/add-vehicle" element={<AddVehicle />} />
            </Routes>
            <CompareBar />
            <Toast />
            <BackToTop />
          </>
        )}
      </HashRouter>
    </AppProvider>
  );
}

export default App;

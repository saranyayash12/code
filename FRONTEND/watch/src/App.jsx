import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Shop from './components/Shop';
import About from './components/About';
import Contact from './components/Contact';
const AdminDashboard = lazy(() => import('./components/Amin/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/Amin/AdminLogin'));
const CustomerLogin = lazy(() => import('./components/Customer/CustomerLogin'));
const CustomerRegister = lazy(() => import('./components/Customer/CustomerRegister'));
const CustomerDashboard = lazy(() => import('./components/Customer/CustomerDashboard'));

function App() {
  return (
    <>
      {/* Animated background and floating watches */}
      <div className="animated-bg"></div>
      <svg className="floating-watch watch1" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#fff" strokeWidth="2"/><rect x="28" y="12" width="8" height="40" rx="4" fill="#fff" opacity="0.2"/></svg>
      <svg className="floating-watch watch2" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#fff" strokeWidth="2"/><rect x="28" y="12" width="8" height="40" rx="4" fill="#fff" opacity="0.2"/></svg>
      <svg className="floating-watch watch3" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#fff" strokeWidth="2"/><rect x="28" y="12" width="8" height="40" rx="4" fill="#fff" opacity="0.2"/></svg>
      <Suspense fallback={<div style={{color: 'white', textAlign: 'center', marginTop: 40}}>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/admin-login' element={<AdminLogin/>}/>
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/customer-login' element={<CustomerLogin/>}/>
          <Route path='/customer-register' element={<CustomerRegister/>}/>
          <Route path='/customer-dashboard' element={<CustomerDashboard/>}/>
          <Route path='*' element={<Home/>}/>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import NavBar from './components/NavBar';
import Register from './components/pages/Register';
import PrivateRoutes from './components/PrivateRoutes';

export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  return (
    <>
    {isLoggedIn ? <NavBar /> : <></>}
      <Routes>
        <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
          <Route path='/' element={<MainPage />} />
        </Route>
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}
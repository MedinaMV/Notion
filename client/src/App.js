import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import NavBar from './components/NavBar';
import Register from './components/Register';

export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(false)

  return (
    <>
    {isLoggedIn ? <NavBar /> : <></>}
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path='/login' setLoggedIn={setLoggedIn} element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}
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
import Collection from './components/pages/Collection';
import Cookies from 'js-cookie';

export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(Cookies.get('userId') ? true : false);
  return (
    <>
    {isLoggedIn ? <NavBar /> : <></>}
      <Routes>
        <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
          <Route path='/' element={<MainPage />} />
          <Route path='/collection' element={<Collection />} /> 
        </Route>
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}
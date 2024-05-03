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
import AdminPanel from './components/pages/Admin';
import Cookies from 'js-cookie';
import AdminNavBar from './components/AdminNavBar';
import AdminUserSettings from './components/pages/AdminUserSettings';
import Friends from './components/pages/Friends';
import SharedNotes from './components/pages/SharedNotes';
import SharedCollections from './components/pages/SharedCollections'

export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(Cookies.get('userId') ? true : false);
  const [isAdmin, setAdmin] = React.useState(window.sessionStorage.getItem('role') === 'ADMIN' ? true : false);
  return (
    <>
      {
        isLoggedIn ? (
          isAdmin ? (
            <AdminNavBar />
          ) : (
            <NavBar />
          )
        ) : (
          <></>
        )
      }
      <Routes>
        <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
          <Route path='/' element={<MainPage />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path='/admin/userSettings' element={<AdminUserSettings />} />
          <Route path='/friends' element={<Friends />}></Route>
          <Route path='/friends/sharedNotes' element={<SharedNotes />}></Route>
          <Route path='/friends/sharedCollections' element={<SharedCollections />}></Route>
        </Route>
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn} setAdmin={setAdmin} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}
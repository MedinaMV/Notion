import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}
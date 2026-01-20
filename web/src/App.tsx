import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import withAuth from './hoc/withAuth';
import GameMain from './pages/gamemain';
import Login from './pages/login'
import './App.css'
import CreateChar from './pages/create-char';

const ProtectedCreateChar = withAuth(CreateChar);
const ProtectedGameboard = withAuth(GameMain);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/create-char' element={<ProtectedCreateChar />} />
        <Route path='/GameMain' element={<ProtectedGameboard />} />
        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

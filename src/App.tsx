import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import withAuth from './hoc/withAuth';
import GameMain from './pages/gamemain';
import Login from './pages/login'
import './App.css'
import CreateChar from './pages/create-char';
import GameLoader from './components/GameLoader';

const ProtectedCreateChar = withAuth(CreateChar);
const ProtectedGameboard = withAuth(GameMain);

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = () => setIsLoading(true);
  const handleLoadingComplete = () => setIsLoading(false);

  return (
    <BrowserRouter>
      {isLoading && <GameLoader onLoadingComplete={handleLoadingComplete} />}

      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/create-char' element={<ProtectedCreateChar onStartGame={startLoading}/>} />
        <Route path='/gamemain' element={<ProtectedGameboard />} />
        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import withAuth from './hoc/withAuth';
import GameMain from './pages/gamemain';
import Login from './pages/login'
import './App.css'
import CreateChar from './pages/create-char';
import GameLoader from './components/GameLoader';
import Signup from './pages/signup';
import EditProfile from './pages/edit-profile';
import ChangeUsername from './pages/change-username';
import ChangeEmail from './pages/change-email';
import ChangePassword from './pages/change-password';


const ProtectedCreateChar = withAuth(CreateChar);
const ProtectedGameboard = withAuth(GameMain);
const ProtectedEditProfile = withAuth(EditProfile);
const ProtectedChangeUsername = withAuth(ChangeUsername);
const ProtectedChangeEmail = withAuth(ChangeEmail);
const ProtectedChangePassword = withAuth(ChangePassword);

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = () => setIsLoading(true);
  const handleLoadingComplete = () => setIsLoading(false);

  return (
    <BrowserRouter>
      {isLoading && <GameLoader onLoadingComplete={handleLoadingComplete} />}

      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/create-char' element={<ProtectedCreateChar onStartGame={startLoading}/>} />
        <Route path='/gamemain' element={<ProtectedGameboard />} />
        
        {/* 회원 정보 수정 관련 라우트 */}
        <Route path='/edit-profile' element={<ProtectedEditProfile />} />
        <Route path='/edit-profile/username' element={<ProtectedChangeUsername />} />
        <Route path='/edit-profile/email' element={<ProtectedChangeEmail />} />
        <Route path='/edit-profile/password' element={<ProtectedChangePassword />} />

        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
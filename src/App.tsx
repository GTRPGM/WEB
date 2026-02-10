import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import withAuth from './hoc/withAuth';
import GameMain from './pages/gamemain';
import Login from './pages/login'
import './App.css'
import CreateChar from './pages/create-char';
import Signup from './pages/signup';
import EditProfile from './pages/edit-profile';
import ChangeUsername from './pages/change-username';
import ChangeEmail from './pages/change-email';
import ChangePassword from './pages/change-password';
import SelectScenario from './pages/select-scenario';
import { setNavigator } from './apiinterceptor';
// GameLoader imports removed

const ProtectedCreateChar = withAuth(CreateChar);
const ProtectedSelectScenario = withAuth(SelectScenario);
const ProtectedGameboard = withAuth(GameMain);
const ProtectedEditProfile = withAuth(EditProfile);
const ProtectedChangeUsername = withAuth(ChangeUsername);
const ProtectedChangeEmail = withAuth(ChangeEmail);
const ProtectedChangePassword = withAuth(ChangePassword);

function App() {
  const navigate = useNavigate();
  // isLoadingGameSession and other loader-related state removed

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      {/* GameLoader rendering removed */}

      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/create-char' element={<ProtectedCreateChar />} />
        <Route path='/select-scenario' element={<ProtectedSelectScenario />} />
        <Route path='/gamemain' element={<ProtectedGameboard />} />
        
        {/* 회원 정보 수정 관련 라우트 */}
        <Route path='/edit-profile' element={<ProtectedEditProfile />} />
        <Route path='/edit-profile/username' element={<ProtectedChangeUsername />} />
        <Route path='/edit-profile/email' element={<ProtectedChangeEmail />} />
        <Route path='/edit-profile/password' element={<ProtectedChangePassword />} />

        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
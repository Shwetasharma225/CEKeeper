import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Licence from './components/Licence';
import MuiDrawer from './components/MuiDrawer';
import SignIn from './components/SignIn';
import Signup from './components/SignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmailVerification from './components/EmailVerification';
import ChangePassword from './components/ChangePassword';
import ResetPassword from './components/ResetPassword';
import UserSettings from './components/UserSettings';
import AddOrganisation from './components/Test';
import Organization from './components/Test';
import FileUpload from './components/Upload';

// import Table from './components/Table';
// import Grid from './components/Grid';
// import { Modal } from './components/Modal';



function App() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  return (
    <div>

      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left">
          {/* <FileUpload/> */}
          
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={< Signup />} />
              <Route path="/" element={<SignIn setUserId={setUserId} setUserName={setUserName} />} />
              <Route path="/dashboard" element={<MuiDrawer userName={userName} content={<Dashboard userId={userId} />} />} />
              <Route path="/licence" element={<MuiDrawer content={<Licence userId={userId} />} />} />
              <Route path="/email-verification/:token" element={<EmailVerification />} />
              <Route path="/changepassword" element={<MuiDrawer userName={userName} content={<ChangePassword userId={userId} />} />} />
              <Route path="/usersetting" element={<MuiDrawer userId={userId} userName={userName} content={<UserSettings userId={userId} />} />} />
              <Route path="/reset-password/:userId" element={<ResetPassword />} />
            </Routes>
          </BrowserRouter>

        </div>
      </div>
    </div>

  );
}

export default App;

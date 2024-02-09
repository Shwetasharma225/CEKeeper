import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const clearForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);

    // Perform password strength validation
    const strength = calculatePasswordStrength(newPasswordValue);
    setPasswordStrength(strength);
  };

  const calculatePasswordStrength = (password) => {
    // Implement your password strength logic here
    // For simplicity, let's consider a password with at least 8 characters and a special case as strong
    if (password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'strong';
    } else {
      return 'weak';
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storeduserId = JSON.parse(sessionStorage.getItem('userId'));

    if (newPassword === confirmPassword) {
      const strength = calculatePasswordStrength(newPassword);

      if (strength === 'weak') {
        setError('Password must be at least 8 characters long and include a special character.');
        setSuccess(null);
        return;
      }
      const requestData = {
        RegistrationId: userId || storeduserId,
        OldPassword: oldPassword,
        NewPassword: newPassword,
      };

      try {
        const response = await fetch('http://warals1.ddns.net:8045/api/UpdatePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
            'Access-Control-Allow-Origin': 'http://localhost:3000',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const data = await response.json();
          if (data === 'Error') {
            setError('Old password is incorrect.');
            setSuccess(null);
          } else {
            setSuccess('Password successfully changed.');
            setError(null);
            clearForm(); // Clear form fields
          }
        } else {
          setError('Password change failed. Please try again.');
          setSuccess(null);
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
        setSuccess(null);
      }
    } else {
      setError('New password and confirm password do not match.');
      setSuccess(null);
    }
  };

  return (
    <div className='container' style={{ height: '70vh' }}>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='oldPassword' className='form-label'>
            Old Password
          </label>
          <input
            type='password'
            className='form-control'
            id='oldPassword'
            value={oldPassword}
            onChange={handleOldPasswordChange}
          />
          <div id='emailHelp' className='form-text' style={{ color: '#006FFD' }}>
            Please enter your old password
          </div>
        </div>

        <div className='mb-3'>
          <label htmlFor='newPassword' className='form-label'>
            New Password
          </label>
          <div className='input-group'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='form-control'
              id='newPassword'
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <button
              type='button'
              className='btn btn-outline-secondary mx-2'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordStrength && (
            <div
              id='passwordStrength'
              className={`form-text ${passwordStrength === 'strong' ? 'text-success' : 'text-danger'}`}
            >
              {passwordStrength === 'strong' ? 'Strong password' : 'Weak password'}
            </div>
          )}
        </div>

        <div className='mb-3'>
          <label htmlFor='confirmPassword' className='form-label'>
            Confirm Password
          </label>
          <input
            type='password'
            className='form-control'
            id='confirmPassword'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>

        {error && <p className='text-danger'>{error}</p>}
        {success && <p className='text-success'>{success}</p>}

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

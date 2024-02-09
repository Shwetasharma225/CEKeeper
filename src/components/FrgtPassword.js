import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Stack,
  Modal,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

const FrgtPassword = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleBothClose = () => {
    setIsModalOpen(false);
    setResetSuccess(false)
  }

  const handleResetPassword = async () => {
    try {
      const response = await fetch("http://warals1.ddns.net:8045/api/ForgetPassword_Email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email }),
      });

      if (response.ok) {
        // Password reset request successful
        setResetSuccess(true);
      } else {
        // Handle the error, e.g., display an error message
        console.error("Password reset request failed");
      }
    } catch (error) {
      // Handle any network or other errors
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Typography>
        <Link to="#" onClick={handleOpenModal}>
          Forgot password?
        </Link>
      </Typography>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Paper elevation={3} style={{ padding: 20, width: 300 }}>
            <Typography variant="h5">Reset Password</Typography>
            <TextField
              label="Enter your registered email..."
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={handleEmailChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 10 }}
              onClick={handleResetPassword}
            >
              Send
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleCloseModal}
              style={{ marginTop: 10 }}
            >
              Cancel
            </Button>
          </Paper>
          {resetSuccess && (
        <div style={{ position: 'absolute', top: '-20%', width: '100%', backgroundColor: 'green', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Password reset link has sent to your email successfully!</span>
          <Button color="inherit" onClick={handleBothClose}>Close</Button>
        </div>
      )}
        </div>
      </Modal>
    </div>
  );
};

export default FrgtPassword;

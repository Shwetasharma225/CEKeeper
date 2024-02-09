import React, { useState, useEffect } from 'react';
import { Grid, Paper, TextField, Button, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useParams } from "react-router-dom";

// Test chnges

const ResetPassword = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [dependencies, setDependencies] = useState({ userId: null });

  useEffect(() => {
    if (userId !== dependencies.userId) {
      // userId has changed, clear any previous messages and set new userId as a dependency
      setError("");
      setSuccessMessage("");
      setDependencies({ userId });
    }
  }, [userId, dependencies]);

  const handleFormChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });

    // Perform password strength validation
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  const calculatePasswordStrength = (password) => {
    // Perform your password strength calculation logic here
    // For example, check for length, presence of special characters, etc.

    // For simplicity, let's consider a password with at least 8 characters as strong
    return password.length >= 8 ? 'strong' : 'weak';
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength === 'weak') {
      setError("Password must contain at least 8 characters with a special case");
      return;
    }

    try {
      const response = await fetch(`http://warals1.ddns.net:8045/api/resetPassword/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ NewPassword: formData.newPassword }),
      });

      if (response.ok) {
        // Password reset successful
        setDialogMessage("Password reset successful");
        setDialogOpen(true);
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Handle the error, e.g., display an error message
        setDialogMessage("Session expired");
        setDialogOpen(true);
        console.error("Password reset failed");
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      // Handle any network or other errors
      setDialogMessage("An error occurred");
      setDialogOpen(true);
      console.error("Error:", error);
    }
  };

  const paperStyle = {
    borderRadius: "14px",
    padding: 20,
    width: 300,
    margin: "0 auto",
    backgroundColor: "#e9ecef",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)", // Center vertically
  };

  const btnstyle = { margin: "20px 0",backgroundColor:'#0CE07A', padding: "8px" };

  return (
    <div className="home" style={{ minHeight: "100vh", position: "relative" }}>
      <Grid container justifyContent="center">
        <Paper elevation={3} style={paperStyle}>
          <Stack alignItems={"center"}>
            
          </Stack>
          <h2>Enter your new password</h2>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleFormChange}
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            {passwordStrength && (
              <Typography variant="body2" color={passwordStrength === 'strong' ? "success" : "error"}>
                {passwordStrength === 'strong' ? 'Strong password' : 'Weak password'}
              </Typography>
            )}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleFormChange}
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={btnstyle}
            >
              Save
            </Button>
            {successMessage && (
              <Typography variant="body2" color="success">
                {successMessage}
              </Typography>
            )}
          </form>
        </Paper>
      </Grid>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
          style={btnstyle}
           onClick={handleDialogClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResetPassword;

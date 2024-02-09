import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Modal,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  let navigate = useNavigate();
  const message = "A mail has been sent to you for your email verification.";


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const validateEmail = (email) => {
    const re =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
       if (formData.password !== formData.confirmPassword) {
      // Show error message if passwords do not match
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://warals1.ddns.net:8045/api/Registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.text();
        if (data.includes("You are already Registered with this Email!")) {
          // Set the email error message if the email is already registered
          setEmailError("This email is already registered.");
        } else if (data.includes("You have been registered successfully!")) {
          // Signup successful, show success message and redirect
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
            navigate("/");
          }, 5000);
        } else {
          console.error("Unexpected response from server");
        }
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      // Handle any network or other errors
      console.error("Error:", error);
    }
  };

  const checkPasswordStrength = (password) => {
    // Check for password strength here
    if (password.length < 6) {
      return "Password is too weak, it should be at least 6 characters";
    }
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!specialChars.test(password)) {
      return "Password should contain at least one special character";
    }
    return "Password is strong";
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
    transform: "translateY(-50%)",
  };
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  };
  const btnstyle = { backgroundColor: '#0CE07A', margin: "30px 0", padding: "8px" };

  return (
    <div className="home" style={{ minHeight: "100vh", position: "relative" }}>
      <Grid container justifyContent="center">
        <Paper elevation={3} style={paperStyle}>
          <Stack alignItems={"center"}>
            <h2>Sign Up</h2>
          </Stack>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
              placeholder="First Name"
              variant="standard"
              fullWidth
              required
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
              placeholder="Last Name"
              variant="standard"
              fullWidth
              required
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email"
              variant="standard"
              fullWidth
              required
              error={emailError ? true : false}
              helperText={emailError}
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Create Password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleFormChange(e);
                const strength = checkPasswordStrength(e.target.value);
                setPasswordStrength(strength);
              }}
              placeholder="Create password"
              type="password"
              variant="standard"
              fullWidth
              required
              style={{ marginTop: "10px" }}
              //error={emailError ? true : false}
            />
            <Typography
              variant="caption"
              color={passwordStrength.includes("weak") ? "error" : "inherit"}
            >
              {passwordStrength}
            </Typography>

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleFormChange}
              placeholder="Confirm Password"
              type="password"
              variant="standard"
              fullWidth
              required
              style={{ marginTop: "10px" }}
              error={passwordError ? true : false}
              helperText={passwordError}
            />
            <Button
              type="submit"
              color="info"
              variant="contained"
              fullWidth
              style={btnstyle}
              padding="12px"
            >
              Sign Up
            </Button>
          </form>
          <Typography>
            Already have an account? <Link to="/">Sign in</Link>
          </Typography>
        </Paper>
      </Grid>
      <Modal open={showMessage} onClose={() => setShowMessage(false)}>
        <div style={modalStyle}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h4" style={{ color: 'green' }}>Signup Successful!</Typography>
            <Typography variant="h5">{message}</Typography>
          </Paper>
        </div>
      </Modal>
    </div>
  );
};

export default SignUp;

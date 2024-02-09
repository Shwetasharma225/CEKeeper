import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FrgtPassword from "./FrgtPassword";

const SignIn = ({ setUserId, setUserName}) => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false); // Added state for remember me checkbox

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

  const avatarStyle = { backgroundColor: "#0c1a21" };
  const btnstyle = {backgroundColor:'#0CE07A', margin: "8px 0" };

  const handleInputChange = (e) => {
  
    setFormData({...formData, [e.target.name]: e.target.value})
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://warals1.ddns.net:8045/api/Userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: formData.username,
          Password: formData.password,
        }),
      });

      if (response.ok) {
        // Login successful, navigate to the dashboard page
        const responseData = await response.json();
        const { access_token, ObjLoginDetails } = responseData;
  
        // Store access token and user details in sessionStorage
        sessionStorage.setItem("access_token", access_token);
        sessionStorage.setItem("userDetails", JSON.stringify(ObjLoginDetails));
  
        const userId = ObjLoginDetails.RegistrationId;
        const userName = ObjLoginDetails.Name;
  
        // Store userId in local storage
        sessionStorage.setItem("userId", JSON.stringify(userId));
        sessionStorage.setItem("userName", JSON.stringify(userName));
  
        setUserName(userName);
        setUserId(userId);
  
        navigate("/dashboard");
      } else {
        alert('Invalid credentials')
        // Handle login failure here (e.g., show an error message)
      }
    } catch (error) {
      // Handle API request error here
      console.error("API request error:", error);
    }
  };
  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="home" style={{ minHeight: "100vh", position: "relative" }}>
      <Grid container justifyContent="center" >
        <Paper elevation={3} style={paperStyle}>
          <Stack alignItems={"center"}>
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2>Sign In</h2>
          </Stack>
          <TextField
            label="Username"
            name="username"
            placeholder="Enter username"
            variant="standard"
            fullWidth
            required
            style={{ marginTop: "10px" }}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            name="password"
            placeholder="Enter password"
            type="password"
            variant="standard"
            fullWidth
            required
            style={{ marginTop: "10px" }}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={<Checkbox name="checked18" color="primary" checked={rememberMe}
            onChange={handleCheckboxChange} // Added event handler for checkbox change
           />}
            label="Remember me"
          />
          <Button
            type="submit"
            
            variant="contained"
            fullWidth
            style={btnstyle}
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <FrgtPassword/>
          <Typography>
            Do you have an account? <Link to="/signup">Sign up</Link>
          </Typography>
        </Paper>
      </Grid>
    </div>
  );
};

export default SignIn;
import React, { useState, useEffect } from 'react';
import { TextField, Button, Modal, Paper, Box, Grid, Typography, Divider } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';


const ProfileUpdate = ({ userId }) => {
  const successMessage = "Verify the registered email to update the data";
  const confirmationMessage = "Are you sure you want to save the changes?";
  const [userData, setUserData] = useState({
    FName: '',
    LName: '',
    Email: '',
    
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = JSON.parse(sessionStorage.getItem('userId')); // Retrieve storedUserId from 
        const response = await fetch('http://warals1.ddns.net:8045/api/GetUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
          },
          body: JSON.stringify({
            RegistrationId: userId || storedUserId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        // Assuming the response structure is an array containing an object
        if (data.length > 0) {
          setUserData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]); // Added userId to the dependency array

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirmYes = async () => {
    setShowConfirmation(false);
    setIsEditing(false);
    await handleSaveChanges();
  };

  const handleConfirmCancel = () => {
    setShowConfirmation(false);
  };

  const handleSaveChanges = async () => {
    try {
      const storedUserId = JSON.parse(sessionStorage.getItem('userId'));
      const response = await fetch('http://warals1.ddns.net:8045/api/UpdateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token'),
        },
        body: JSON.stringify({
          RegistrationId: userId || storedUserId,
          FirstName: userData.FName,
          LastName: userData.LName,
          Email: userData.Email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      // Optionally, you can fetch the updated user data from the API and set it in state
      // This step is optional and depends on your backend's response structure
      const updatedData = await response.json();
      setUserData(updatedData);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    // Revert changes
    setIsEditing(false);
  };
  const handleSendEmail = () =>{

  }

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    window.location.reload(); // Reload the page
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 3 }}>
      <form onSubmit={(e) => { e.preventDefault(); setShowConfirmation(true); }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  //label="First Name"
                  value={userData.FName}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, FName: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  // label="Last Name"
                  value={userData.LName}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, LName: e.target.value })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              //label="Email"
              value={userData.Email}
              disabled={!isEditing}
              onChange={(e) => setUserData({ ...userData, Email: e.target.value })}
              
            />
            
            {userData.IsEmailVerification === 0 && (
      <Button style={{margin: "10px"}}
        variant="text"
        color="primary"
        onClick={handleSaveChanges }
      >
        Verify
      </Button>
      
      
    )}
     {userData.IsEmailVerification === 0 && (
        <Typography variant="body2" color="error">
          Your email is not verified
        </Typography>
      )}
    {userData.IsEmailVerification === 1 && (
      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', color: 'green' }}>
        <Typography variant="body1" sx={{ marginRight: '4px', marginTop: '3px' }}>
          Verified
        </Typography>
        {/* Add your check icon here */}
        <CheckIcon />
      </Grid>
    )}
          </Grid>
          {isEditing ? (
            <Grid item xs={12}>
              <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                  <Button variant="contained" style={{ backgroundColor: '#0CE07A' }} type="submit">
                    Save changes
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleEdit}>
                Edit
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sx={{ marginTop: 2, width: '100%' }}>
            <Divider />
          </Grid>
        </Grid>
      </form>
      <Modal open={showConfirmation} onClose={handleConfirmCancel}>
        <div style={modalStyle}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h6">{confirmationMessage}</Typography>
            <Button variant="contained" color="primary" style={{ margin: '10px' }} onClick={handleConfirmYes}>
              Yes
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmCancel}>
              Cancel
            </Button>
          </Paper>
        </div>
      </Modal>
      <Modal open={showSuccessMessage} onClose={handleCloseSuccessMessage}>
        <div style={modalStyle}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h4" style={{ color: 'green' }}>Email Sent!</Typography>
            <Typography variant="h5" style={{ paddingTop: '15px', }}>{successMessage}</Typography>
            <Button variant="contained" color="primary" style={{ marginTop: '15px', }} onClick={handleCloseSuccessMessage}>
              Close
            </Button>
          </Paper>
        </div>
      </Modal>
    </Box>
  );
};

export default ProfileUpdate;

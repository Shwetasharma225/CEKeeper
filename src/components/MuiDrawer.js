import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Dropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Licence from './Licence';

// Define a functional component MuiDrawer that takes content as a prop
const MuiDrawer = ({ userId, content, userName }) => {
  const [userData, setUserData] = useState({
    FName: '',
    LName: '',
    
  });

  
  // Define the width of the drawer
  const drawerWidth = 240;

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  // Define state to manage whether the drawer is open or closed
  const [isDrawerOpen, setDrawerOpen] = useState(!isMobile);
  let navigate = useNavigate();
  const storedUserName = JSON.parse(sessionStorage.getItem('userName'));


  
  // Logout after 30 minutes of inactivity
  const logoutAfterInactivity = () => {
    const inactivityTime =  30 * 60 * 1000; // 30 minutes in milliseconds
    let logoutTimer = setTimeout(() => {
      handleLogout(); // Call the logout function
    }, inactivityTime);

    const resetTimeout = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        handleLogout();
      }, inactivityTime);
    };

    // Add event listeners for user activity
    ['click', 'mousemove', 'keydown', 'scroll'].forEach((event) => {
      document.addEventListener(event, resetTimeout);
    });
  };

  useEffect(() => {
    logoutAfterInactivity(); // Initialize the inactivity timer on component mount
  }, []);

  // Function to toggle the drawer open/close
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  // Function to handle menu item click
  const handleMenuItemClick = () => {
    // Close the drawer when a menu item is clicked on mobile
    if (isMobile) {
      setDrawerOpen(false);
      
    }
  };
  const handleLogout = () => {
    // Clear session storage (if necessary)
    sessionStorage.clear();

    // Redirect to the home page ("/")
    navigate("/"); // Redirect to the specified path
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
	      const storeduserId = JSON.parse(sessionStorage.getItem('userId')); // Retrieve storeduserId from 
        const response = await fetch('http://warals1.ddns.net:8045/api/GetUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
          },
          body: JSON.stringify({
            RegistrationId: userId || storeduserId,
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
  }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          style={{
            backgroundColor: '#006FFD',
            zIndex: 1400,
            minHeight: '48px',
          }}
        >
          <Toolbar>
            {isMobile && (
              // Display a menu icon button on mobile to toggle the drawer
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ display: { xs: 'block', sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" >
              <h6>  Document Management System</h6>
            </Typography>
            <div className="drawer-container">
              <Dropdown>
              
                <Dropdown.Toggle variant="#006FFD" id="dropdown-basic" style={{ color:'white',padding: '12px' }}>
                  <ManageAccountsIcon /> {storedUserName && <span>{`${userData.FName} ${userData.LName} ` || storedUserName}</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {/* Menu items for user settings */}
                  
                  <Dropdown.Item><Link to="/changepassword">Change password</Link></Dropdown.Item>
                  <Dropdown.Item><Link to="/usersetting">User Setting</Link></Dropdown.Item>
                  <Dropdown.Item href="#" onClick={handleLogout}>SignOut</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isDrawerOpen}
          style={{ backgroundColor: '#e9ecef' }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#e9ecef',
              display: isMobile ? 'block' : 'flex',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List style={{ marginTop: '20px' }}>
              <ListItem disablePadding>
                {/* Menu item for Dashboard */}
                <ListItemButton component={Link} to="/dashboard" onClick={handleMenuItemClick}>
                  <ListItemIcon>
                    <i className="bi bi-speedometer"></i>
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                {/* Menu item for Licence */}
                <ListItemButton component={Link} to="/licence" onClick={handleMenuItemClick}>
                  <ListItemIcon>
                    <i className="fa-regular fa-id-card"></i>
                  </ListItemIcon>
                  <ListItemText primary="Add New Licence" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '48px',
          }}
        >
          <Toolbar />
          {/* Render the content passed as a prop */}
          {content}
        </Box>
      </Box>
    </>
  );
};

export default MuiDrawer;
import React, { useState, useEffect } from 'react';
import DualBarChart from './NewJerseyLic';
import NewJerseyLic from './NewJerseyLic';
import PensyLic from './PensyLic';
import NewYorkLic from './NewYorkLic';
import { Dialog, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import AddLicence from './AddLicence';

const Dashboard = ({ userId }) => {
  const [data, setData] = useState([]); // Store data fetched from API
  const [selectedItem, setSelectedItem] = useState('');
  const [defaultFinId, setDefaultFinId] = useState(0);
  const [noLicenseFound, setNoLicenseFound] = useState();
    // New state variable to keep track of API response across all components
    const [allResponseData, setAllResponseData] = useState([]);
    const [childComponentResponses, setChildComponentResponses] = useState([]);

  const fetchData = async () => {
    try {
      if (userId) {
        const response = await fetch('http://warals1.ddns.net:8045/api/UserFinYear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
          },
          body: JSON.stringify({
            RegistrationId: userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);

        // Store the data in localStorage with userId as part of the key
        //sessionStorage.setItem('dashboardData', JSON.stringify(jsonData));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('dashboardData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }

    // Fetch new data
    fetchData();
  }, [userId]);

  const handleDataCheck = (result) => {
    setChildComponentResponses(prevResponses => [...prevResponses, result]);
  };

  useEffect(() => {
    if (childComponentResponses.length === 3) {
      const allResponsesMatch = childComponentResponses.every(response => response === true);
      if (allResponsesMatch) {
        setNoLicenseFound(true);
      }
    }
  }, [childComponentResponses]);

  const handleCloseDialog = () => {
    setNoLicenseFound(false);
  };

  // Handle dropdown selection
  const handleDropdownChange = (event) => {
    setSelectedItem(event.target.value);
  };
  useEffect(() => {
    if (selectedItem === '') {
      setSelectedItem(defaultFinId);
    }
  }, [selectedItem, defaultFinId]);
  // console.log(selectedItem);

  
  return (
    <>
      <div className="rayan">
        <h1 className=''>Dashboard</h1>
        {/* <div className="btn-group">
          <div className="container mt-3">
            <div className="form-group">
              <label htmlFor="exampleDropdown">Licence</label>
              {data.length > 0 ? (
               <select className='form-control' value={selectedItem} onChange={handleDropdownChange} style={{ backgroundColor:'#0CE07A', color:'white' }}>
                 <option style={{ backgroundColor:'white', color:'343a40' }} value="">Select an item</option>
                 {data.map((item) => (
                   <option style={{ backgroundColor:'white', color:'#343a40' }} key={item.FinId} value={item.FinId}>
                     {item.Finyr}
                   </option>
                  ))}
                </select>
              ) : (
                <select className='form-control' value={selectedItem} onChange={handleDropdownChange} style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                  <option style={{ backgroundColor: 'white', color: '#343a40' }} value="">
                    Select an item
                  </option>
                </select>
              )}
            </div>
          </div>
        </div> */}
        <Dialog open={noLicenseFound} onClose={() =>{ setNoLicenseFound(false);}}>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              No Licence Found
              <Button onClick={() => setNoLicenseFound(false)}>
                <CloseIcon />
              </Button>
            </div>
          </DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SentimentVeryDissatisfied style={{ fontSize: 48, color: 'red' }} />
              <Typography variant="body1">Please add the licence from the Licence Section.</Typography>
            </div>
            {/* <Button component={Link} to="/licence" style={{backgroundColor: '#0CE07A' ,color: 'white', margin: '5px'}}>Add License</Button> */}
            <AddLicence userId={userId} handleCloseDialog={handleCloseDialog} />
          </DialogContent>
        </Dialog>
        <div className="chart-box">
          <div className="chart-container">
            {selectedItem && !data.find((item) => item.FinId === selectedItem) ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <p>Data does not exist for the selected item</p>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="row">
                {noLicenseFound && (
        <div className="dialog-box">
          <p>No license found</p>
        </div>
      )}
    
                  <NewJerseyLic userId={userId} FinId={selectedItem} onDataCheck={handleDataCheck} />
                  <PensyLic userId={userId} FinId={selectedItem} onDataCheck={handleDataCheck} />
                  <NewYorkLic  userId={userId} FinId={selectedItem} onDataCheck={handleDataCheck}/>
                  
                  {/* <Table />  */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
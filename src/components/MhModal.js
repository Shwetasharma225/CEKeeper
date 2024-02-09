import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const baseServerUrl = 'http://warals1.ddns.net:8047';

const MhModal = ({ RegistrationId, LicenceId, FinId }) => {
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
  };
  // ... (existing code)

  const handleDownload = (path) => {
    const url = `${baseServerUrl}${path.replace('~', '')}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'downloaded_file'; // Set the download attribute to the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};





const handleView = (path) => {
  const url = `${baseServerUrl}${path.replace('~', '')}`;
  // Check if the file is an image
  const isImage = url.match(/\.(jpeg|jpg|png)$/) !== null;

  if (isImage) {
    // If the file is an image, create a new window and display the image
    const newWindow = window.open();
    newWindow.document.write(`<img src="${url}" style="max-width:100%; max-height:100%; align-item:center" />`);
  } else {
    // If the file is a PDF, open it in a new tab
    window.open(url, '_blank');
  }
};

// ... (rest of the component remains the same)


  
  const fetchData = async () => {
    
    try {
      if (!FinId) {
        throw new Error('Please select a year from the dropdown.');
      }
      const storeduserId = JSON.parse(sessionStorage.getItem('userId'));
      const response = await axios.post('http://warals1.ddns.net:8045/api/MandatoryDetails', {
        RegistrationId: storeduserId,
        LicenseId: LicenceId,
        FinId: FinId
      },
      {
        headers: {
          Authorization: sessionStorage.getItem('access_token'),
        },
      });
      if (response.data && response.data.Status === "204" && response.data.Massege === "Record Not Found!!!") {
        setModalData([]);
        setError("No data to display");
      } else {
        setModalData(response.data);
        setError(null); // Reset the error state on successful fetch
      }
    } catch (error) {
      console.error('Error fetching modal data: ', error);
      setError(error.message);
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // const buttonStyle = {
  //   fontSize: '10px',
  //   backgroundColor: '#0CE07A',
  // };

  const tableWrapperStyle = {
    width: '100%',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
    },
  };
  

  return (
    <>
      <Button variant="contained" onClick={handleOpen}  style={{color: 'white', fontSize: '12px', width: '10px',
    backgroundColor: '#0CE07A',}}>
        Details
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',textAlign: 'center' }}>
            <Typography variant="h5" style={{textAlign: 'center'}}>Details</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
            {/* Displaying the error message */}
        {error && (
          <div className="alert alert-danger" role="alert" style={{ marginTop: '20px' }}>
            {error}
          </div>
        )}
          {/* {modalData && Array.isArray(modalData) && modalData.length === 0 && !error && (
            <div className="alert alert-danger" role="alert" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Typography variant="body1">No data to display.</Typography>
            </div>
          )} */}
          <div style={tableWrapperStyle}>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table aria-label="simple table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow style={{backgroundColor: '#006FFD', color: 'white'}}>
                    <TableCell>#</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Credit Hour</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Certificate</TableCell>
                    <TableCell>Receipt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modalData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{item.Topic}</TableCell>
                      <TableCell>{item.CreditHr}</TableCell>
                      <TableCell>{item.Date}</TableCell>
                      <TableCell>{item.Certificate}
                              <button className="custom-buttons primary" onClick={() => handleDownload(item.Certificate)}>Download</button>
                              <button className="custom-buttons" onClick={() => handleView(item.Certificate)}>View </button></TableCell>
                      <TableCell>{item.Receipt}
                      <button className="custom-buttons" onClick={() => handleDownload(item.Recipt)}>Download</button>
                              <button className="custom-buttons" onClick={() => handleView(item.Recipt)}>View </button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Button variant="contained" onClick={handleClose} style={{ marginTop: '10px' }}>
            Close
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

export default MhModal;

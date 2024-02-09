
import React, { useState, useEffect } from 'react';

const LicDrpdwn = ({ userId,LicenceId, handleSelectedFinId, selectedFinId }) => {
    const [data, setData] = useState([]); // Store data fetched from API
  const [selectedItem, setSelectedItem] = useState('');
  const [defaultFinId, setDefaultFinId] = useState(0);

  useEffect(() => {
    const storedLicenceIds = JSON.parse(sessionStorage.getItem('allLicenceIds'));
    if (storedLicenceIds) {
      storedLicenceIds.forEach((id) => {
        if (id) {
          fetchData(id); // Call the fetchData function for each non-empty LicenceId
        }
      });
    }
  }, []);
  

  const fetchData = async (storedLicenceId) => {
    try {
      if (storedLicenceId) {
        const response = await fetch('http://warals1.ddns.net:8045/api/UserFinYear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            //RegistrationId: userId,
            LicenceId: LicenceId || storedLicenceId
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
  }, [userId, LicenceId]);

  // Handle dropdown selection
  const handleDropdownChange = (event) => {
    const selectedId = event.target.value;
    setSelectedItem(selectedId);
    handleSelectedFinId(selectedId);
  };
  // useEffect(() => {
  //   if (selectedItem === '') {
  //     setSelectedItem(defaultFinId);
  //   }
  // }, [selectedItem, defaultFinId]);
  useEffect(() => {
    if (selectedFinId === 0 ) {
      setSelectedItem('');
    }
  }, [selectedFinId]);
  // console.log(selectedItem);
  return (
    <div className="drpdwn" style={{display: 'flex', float: 'right', padding: '5px',}}>
      <div className="form-group">
              {data.length > 0 ? (
               <select className='form-control' value={selectedItem} onChange={handleDropdownChange} style={{ backgroundColor:'#0CE07A', color:'white' }}>
                 <option style={{ backgroundColor:'white', color:'343a40' }} value="">Select an year</option>
                 
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
  )
}

export default LicDrpdwn

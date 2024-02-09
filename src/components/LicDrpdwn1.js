import React, { useState, useEffect } from 'react';

const LicDrpdwn1 = ({ userId, LicenceId, handleSelectedFinId, selectedFinId }) => {
  const [data, setData] = useState([]); 
  const [selectedItem, setSelectedItem] = useState('');
  const [defaultFinId, setDefaultFinId] = useState(0);
  const [selectedFinId1, setSelectedFinId1] = useState(0); // Define the selectedFinId1 state variable

  useEffect(() => {
    const storedLicenceIds = JSON.parse(sessionStorage.getItem('allLicenceIds'));
    if (storedLicenceIds) {
      storedLicenceIds.forEach((id) => {
        if (id) {
          fetchData(id);
        }
      });
    }
  }, []);

  const fetchData = async (storedLicenceId) => {
    try {
      const response = await fetch('http://warals1.ddns.net:8045/api/UserFinYear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LicenceId: 1 // Use the desired LicenceId value
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem('dashboardData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }

    fetchData();
  }, [userId, LicenceId]);

  const handleDropdownChange = (event) => {
    const selectedId = event.target.value;
    setSelectedItem(selectedId);
    handleSelectedFinId(selectedId); // Pass the selected FinId to the handleSelectedFinId function
    setSelectedFinId1(selectedId); // Set the selectedFinId1 state variable
  };

  useEffect(() => {
    if (selectedFinId === 0) {
      setSelectedItem('');
    }
  }, [selectedFinId]);

  return (
    <div style={{ display: 'flex', float: 'right', padding: '5px' }}>
      <div className="form-group">
        {data.length > 0 ? (
          <select className='form-control' value={selectedItem} onChange={handleDropdownChange} style={{ backgroundColor: '#0CE07A', color: 'white' }}>
            <option style={{ backgroundColor: 'white', color: '#343a40' }} value="">Select an item</option>
            {data.map((item) => (
              <option style={{ backgroundColor: 'white', color: '#343a40' }} key={item.FinId} value={item.FinId}>
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

export default LicDrpdwn1;

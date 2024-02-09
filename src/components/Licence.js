// Licence.js
import React, { useState, useEffect } from 'react';
import AddLicence from './AddLicence';

const Licence = ({ userId }) => {
  const [licenseData, setLicenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const storeduserId = JSON.parse(sessionStorage.getItem('userId')); // Retrieve storeduserId from 
        const response = await fetch('http://warals1.ddns.net:8045/api/LicenseDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
          },
          body: JSON.stringify({
            Createdby: userId || storeduserId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLicenseData(data);

        // Store the data in localStorage with userId as part of the key
        sessionStorage.setItem('licenseData', JSON.stringify(data));
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update licenseData
  // const updateLicenseData = (newLicense) => {
  //   // Update licenseData with the new license
  //   setLicenseData((prevData) => [...prevData, newLicense]);

  //   // Update local storage if needed
  //   const updatedData = [...licenseData, newLicense];
  //   localStorage.setItem('licenseData', JSON.stringify(updatedData));
  // };

  const updateLicenseData = async () => {
    try {
      // Fetch the updated data from the API
      const storeduserId = JSON.parse(sessionStorage.getItem('userId')); // Retrieve storeduserId from 
      const response = await fetch('http://warals1.ddns.net:8045/api/LicenseDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token'),
        },
        body: JSON.stringify({
          Createdby: userId || storeduserId, 
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Update licenseData with the new data
      setLicenseData(data);
  
      // Store the data in localStorage with userId as part of the key
      sessionStorage.setItem('licenseData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data from sessionStorage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('licenseData');
    if (storedData) {
      setLicenseData(JSON.parse(storedData));
    }

    // Fetch new data
    fetchData();
  }, [userId]);

  return (
    <div className="container-fluid">
       <h2>Licence</h2>
      <AddLicence userId={userId} updateLicenseData={updateLicenseData} />
      <div className="row">
        <div className="col-12">
          {loading ? (
            <p>Loading...</p>
          ) : licenseData && licenseData.length === 0 ? (
            <p>No data exist</p>
          ) : (
            <table className="table table-responsive table-dark table-striped">
              <thead style={{ backgroundColor: '#006FFD', color: 'white' }}>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">License Name</th>
                  <th scope="col">Total Cr Hours</th>
                  <th scope="col">Mandatory Hour</th>
                  <th scope="col">Non-Mandatory Hour</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Topic Description</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white', color: 'black' }}>
                {Array.isArray(licenseData) && licenseData.map((license, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{license.LicenseName}</td>
                    <td>{license.TotalHr}</td>
                    <td>{license.MandatoryHr}</td>
                    <td>{license.NonMandatoryHr}</td>
                    <td>{license.Topic}</td>
                    <td>{license.TopicDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Licence;

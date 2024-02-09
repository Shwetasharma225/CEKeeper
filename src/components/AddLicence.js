import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const AddLicence = ({ userId, updateLicenseData, handleCloseDialog }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedLicenseId, setSelectedLicenseId] = useState(null); // New state variable for the selected license ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  


  const fetchData = async () => {
    try {
      const response = await fetch('http://warals1.ddns.net:8045/api/FetchLicenseName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('access_token'),
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          "Createdby": userId,
        }),
      });

      if (response.ok) {
        const jsonData = await response.json();
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error('No Licence found! Please add the licence from Licence Section');
        }
        setOptions(jsonData);
      } else {
        throw new Error('Failed to fetch data from the API');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addLicense = async () => {
    if (!selectedOption) {
      alert('Please select a license to add.');
      return;
    }
  
    const selectedLicenseId = selectedOption.LicenseId; // Extract the LicenseId from the selected option
  
    try {
      const storeduserId = JSON.parse(sessionStorage.getItem('userId'));
      const response = await fetch('http://warals1.ddns.net:8045/api/InsertLicense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          Createdby: userId || storeduserId,
          LicenceId: selectedLicenseId,
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.Msg === 'License already Added!') {
          alert('License already exists');
        } else {
          alert('License added successfully!');
          handleCloseDialog(true); // Close the dialog box in the Dashboard component
          window.location.reload(); // Reload the dashboard
          fetchData();
  
          const newLicense = {
            LicenseId: selectedLicenseId,
          };
  
          updateLicenseData(newLicense);
          updateLicenseData(true);
  
          setSelectedOption(null); // Reset the selected option to null
          setSelectedLicenseId(null);
          setIsModalOpen(false);
          window.location.reload(); // Reload the dashboard
        }
      } else {
        throw new Error('Failed to add the license');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setSelectedLicenseId(e.target.value); // Update selectedLicenseId when the option changes
  };
  const handleSearchChange = (inputValue, { action }) => {
    if (action === 'input-change') {
      setSearchQuery(inputValue);
    } else if (action === 'select-option' && inputValue) {
      setSelectedOption(inputValue);
      setSelectedLicenseId(inputValue.LicenseId);
    }
  };


  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: 200,
    }),
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <>
      <div className='row'>
        <div className='col-6'>
         
          <button
            type='button'
            className='btn btn-custom mb-2'
            data-bs-toggle='modal'
            data-bs-target='#exampleModal'
          >
            Add new&nbsp;
            <i class="bi bi-plus-circle-fill"></i>
          </button>
        </div>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Licence</h1>
            </div>
            <div className="modal-body">
              <div className="form-group row">
                <label htmlFor="country" className="col-sm-3 col-form-label">Licence:</label>
                <div className="col-sm-9">
                <Select
              options={options}
              getOptionLabel={(option) => option.LicenseName}
              getOptionValue={(option) => option.LicenseId}
              value={selectedOption}
              onChange={setSelectedOption}
              isSearchable
              onInputChange={handleSearchChange}
              styles={customStyles}
            />
                  
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={addLicense}>Add Licence</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLicence;

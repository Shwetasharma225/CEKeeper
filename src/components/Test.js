import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Organization = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (id) => {
    navigate(`/editOrganization/${id}`);

  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await fetch(`http://warals1.ddns.net:8101/api/Organization/OrgId/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // Update the organization data after deletion
        fetchOrganizationData();
      } else {
        // Handle error, e.g., display an error message
      }
    } catch (error) {
      console.error('API request error:', error);
      // Handle general error, e.g., display an error message
    }
  };

  const handleAddOrganization = () => {
    // navigate('/addOrganization');
    console.log('Navigate to Add Organization page');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchOrganizationData = async () => {
    try {
      const connectionString = sessionStorage.getItem('ConnectionString');
      const token = sessionStorage.getItem('access_token');
      const response = await fetch('http://warals1.ddns.net:8101/api/Organization/ConnectionString', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJVc2VySWQiOiIyIiwiZXhwIjoxNzAyMzEyNzc3LCJpc3MiOiJleGFtRW5naW5lQVBpIiwiYXVkIjoiTXlBcGlTZXJ2aWNlIn0.49hzNgIVShpQMhz6O0CQBz3zop-39FjTlgS5uCtZqp8",
        },
        body: JSON.stringify({
          "connectionString": "Data Source=(local);Initial Catalog=Analytical_Edupoint;User ID=sa ;Password=9090",
          
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error('Account name incorrect');
        alert('Invalid account name');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  return (
    <div className="container mt-4">
      {/* Add Organization button */}
      <div className="mb-3">
        <button className="btn btn-success" onClick={handleAddOrganization}>
          Add Organization
        </button>
      </div>
      <div className="container mt-4">
        {/* Search input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>

        {/* Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Email-Id</th>
              <th>Mobile No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.organisationId}>
                <td>{row.organisationName}</td>
                <td>{row.email}</td>
                <td>{row.mobileNo}</td>
                <td>
                  <button className="btn btn-primary me-2" >
                    Edit
                  </button>
                  <button className="btn btn-danger" >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organization;
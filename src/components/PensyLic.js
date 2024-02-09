import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Table from './Table';
import { Dialog, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AddLicence from './AddLicence';
import LicDrpdwn from './LicDrpdwn';

const PensyLic = ({ userId, onDataCheck  }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //const [noLicenseFound, setNoLicenseFound] = useState(false);
  const [error, setError] = useState(null);
  const [licenseAdded, setLicenseAdded] = useState(false); // New state variable for tracking license addition
  const [selectedFinId, setSelectedFinId] = useState(0);
  const [showNoLicenseMessage, setShowNoLicenseMessage] = useState(false);

  const generateChartData = (chartData) => {
    const categories = ['Total Hr', 'AMA CAT-I', 'State Mandated'];

    const seriesData = [
      {
        name: ['CME Hrs Required'],
        data: [chartData.TotalHr, chartData.AMACat1Hr, chartData.StateMandatedHrs],
      },
      {
        name: ['CME Hrs Done'],
        data: [chartData.TotalHrDone, chartData.AMACat1HrDone, chartData.StateMandatedHrsDone],
      },
    ];

    return { categories, seriesData };
  };

  const handleSelectedFinId = (selectedId) => {
    setSelectedFinId(selectedId);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeduserId = JSON.parse(sessionStorage.getItem('userId')); // Retrieve storeduserId from sessionStorage
        const storedData = JSON.parse(sessionStorage.getItem('dualBarChartData')) || {};
        const response = await fetch("http://warals1.ddns.net:8045/api/DashboardCustom", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
            'Access-Control-Allow-Origin': 'http://localhost:3000',
          },
          body: JSON.stringify({
            FinId: selectedFinId || 2,
            RegistrationId: userId || storeduserId, // Use storeduserId here
            LicenceId: 2

          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        
 if (responseData.Status === "204" && responseData.Msg === "Record Not Found!!!") {
  onDataCheck(true);
  //setShowNoLicenseMessage(true);
}
        // Extract all LicenceId values
        const allLicenceIds = responseData.map((item) => item.LicenceId);

        // Store the array of LicenceIds in sessionStorage
        sessionStorage.setItem('allLicenceIds', JSON.stringify(allLicenceIds));

        // Update the stored data in localStorage for the specific FinId
        const updatedStoredData = {
          ...storedData,
          [handleSelectedFinId]: responseData,
        };
        sessionStorage.setItem('dualBarChartData', JSON.stringify(updatedStoredData));

        // Set data and update state
        setData(responseData);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedFinId]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // if (data.length === 0) {
  //   return <div>No data available for the selected year (FinId: {FinId}).</div>;
  // }

  return (
    <>
     {showNoLicenseMessage ? (
        <div>No license to display.</div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.map((chartData) => {
          const { categories, seriesData } = generateChartData(chartData);

          return (

            <div className='tables' key={chartData.LicenceId}>
              <div style={{ padding: '35px' }}>
                <h6 className='name' style={{ backgroundColor: '#006FFD', color: 'white', height: '45px', width: '100%', padding: '7px' }}>{chartData.LicenseName}</h6>
                <LicDrpdwn userId={userId} LicenceId={chartData.LicenceId} handleSelectedFinId={handleSelectedFinId} selectedFinId={selectedFinId} />
                <ReactApexChart
                  options={{
                    chart: {
                      id: `dual-bar-chart-${chartData.LicenceId}`,
                      type: 'bar',
                    },
                    xaxis: {
                      categories,
                      labels: {
                        rotate: 0,
                        maxHeight: 50,
                        style: {
                          fontSize: '12px',
                        },
                        formatter: function (value) {
                          const labelParts = value.split(' ');
                          if (labelParts.length > 1) {
                            return [labelParts[0], labelParts[1]];
                          }
                          return value;
                        },
                      },
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '60%',
                        endingShape: 'flat',
                      },
                    },
                    dataLabels: {
                      enabled: true,
                    },
                    legend: {
                      position: 'top',
                    },
                    toolbar: {
                      show: false,
                    },
                  }}
                  series={seriesData}
                  type="bar"
                  height={350}
                  width={280}
                />

              </div>
              <div>

                <Table data={chartData} userId={userId} LicenceId={chartData.LicenceId} FinId={selectedFinId} />
              </div>
            </div>
          );
        })}
       
      </div>
        )}
    </>
  );
};

export default PensyLic;
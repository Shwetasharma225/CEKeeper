import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailSchedule = ({ userId }) => {
  // Step 1: Use State to Store User Input
  const [weekday, setWeekday] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [timezoneOptions, setTimezoneOptions] = useState([]);

  // Step 2: Fetch Dropdown Options on Component Mount
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await axios.post('http://warals1.ddns.net:8045/api/GetTimeZone');
        // Assuming the API response contains an array of objects with a TimeZone property
        const options = response.data.map((item) => item.TimeZone);
        setTimezoneOptions(options);
      } catch (error) {
        console.error('Error fetching timezones:', error);
      }
    };

    fetchTimezones();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Step 3: Handle Form Changes
  const handleWeekdayChange = (e) => {
    setWeekday(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleTimezoneChange = (e) => {
    setTimezone(e.target.value);
  };

  useEffect(() => {
    const fetchReminderDetails = async () => {
      try {
        const storeduserId = JSON.parse(sessionStorage.getItem('userId'));
        const response = await axios.post('http://warals1.ddns.net:8045/api/GetReminderDetails', {
          RegistrationId: userId || storeduserId,
        }, {
            headers: {
              Authorization: sessionStorage.getItem('access_token'),
            },
          });
  
        // Assuming the API response contains the reminder details
        const reminderDetailsArray = response.data;

        // Check if the array is not empty
        if (reminderDetailsArray.length > 0) {
          const reminderDetails = reminderDetailsArray[0];
  
          // Set the initial state based on the fetched data
          setWeekday(reminderDetails.Days || ''); // Assuming the response has a 'Days' property
          setTime(reminderDetails.Time || ''); // Assuming the response has a 'Time' property
          setTimezone(reminderDetails.TimeZone || ''); // Assuming the response has a 'TimeZone' property
        }
      } catch (error) {
        console.error('Error fetching reminder details:', error);
      }
    };
  
    fetchReminderDetails();
  }, [userId]); // Trigger the effect when userId changes

  const handleReset = () => {
    setWeekday(''); // Set to default value
    setTime(''); // Set to default value
    setTimezone(''); // Set to default value
  
    // Save the reset data
    saveData({
      Days: '', // Set to default value
      Time: '', // Set to default value
      TimeZone: '', // Set to default value
    });
  };
  
  // ... (previous code)
  
  // Step 5: Make API Request for Reset
  const saveData = async (data) => {
    try {
      const storeduserId = JSON.parse(sessionStorage.getItem('userId'));
      const response = await axios.post('http://warals1.ddns.net:8045/api/InserReminderDetils', {
        RegistrationId: userId || storeduserId,
        Days: data.Days,
        Time: data.Time,
        TimeZone: data.TimeZone,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem('access_token'),
        },
      });
  
      // Handle success (you can show a success message or redirect the user)
      console.log('API Response for Reset:', response.data);
      alert('Reset data saved successfully');
    } catch (error) {
      // Handle error
      console.error('Error saving reset data:', error);
    }
  };
  

  // Step 4: Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    

    // Step 5: Make API Request
    try {
      const storeduserId = JSON.parse(sessionStorage.getItem('userId'));
      const response = await axios.post('http://warals1.ddns.net:8045/api/InserReminderDetils', {
        RegistrationId: userId || storeduserId,
        Days: weekday,
        Time: time,
        TimeZone: timezone,
      }, 
      {
        headers: {
          Authorization: sessionStorage.getItem('access_token'),
        },
      });

      // Handle success (you can show a success message or redirect the user)
      console.log('API Response:', response.data);
      alert('Time period saved successfully')
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h5 style={{ marginBottom: '20px', color: '#006FFD' }}>Select from the below option when you want the reminder of license expiry:</h5>

      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
            <label htmlFor="weekday">Select Weekday:</label>
            <select
              id="weekday"
              name="weekday"
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
              value={weekday}
              onChange={handleWeekdayChange}
            >
                <option value="0">Default</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
              value={time}
              onChange={handleTimeChange}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="timezone">Timezone:</label>
            <select
              id="timezone"
              name="timezone"
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
              value={timezone}
              onChange={handleTimezoneChange}
            >
                {/* <option value="" disabled selected>Select Timezone</option> */}
                <option value="0">Default</option>
              {timezoneOptions.map((option) => (
                
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
  <button
    type="submit"
    style={{
      padding: '8px 16px',
      borderRadius: '5px',
      border: 'none',
      background: '#0CE07A',
      color: 'white',
      cursor: 'pointer',
      marginRight: '8px',
    }}
  >
    Save
  </button>
  <button
    type="button"
    onClick={handleReset}
    style={{
      padding: '8px 16px',
      borderRadius: '5px',
      border: 'none',
      background: '#FF6347',
      color: 'white',
      cursor: 'pointer',
    }}
  >
    Reset
  </button>
</div>
      </form>
    </div>
  );
};

export default EmailSchedule;

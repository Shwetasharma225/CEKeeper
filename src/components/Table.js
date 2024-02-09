import React from 'react';
import ThModal from './ThModal';
import MhModal from './MhModal';
import SmModal from './SmModal';

// Table component displaying CME data
const Table = ({ data, userId, LicenceId, FinId }) => {
  console.log(FinId);

  // Define labels and data for each row
  const rows = [
    { label: 'Total Hr', data: `${data.TotalHr}/${data.TotalHrDone}`, component: <ThModal  RegistrationId={userId}  LicenceId ={data.LicenceId} FinId={FinId}/> },
    { label: 'AMA Cat I', data: `${data.AMACat1Hr}/${data.AMACat1HrDone}`, component: <MhModal RegistrationId={userId}  LicenceId ={data.LicenceId} FinId={FinId}/>  },
    { label: 'STATE MANDATED', data: `${data.StateMandatedHrs}/${data.StateMandatedHrsDone}`, component: <SmModal RegistrationId={userId}  LicenceId ={data.LicenceId} FinId={FinId}/>  },
    // Add more rows for other data points as needed
  ];
  return (
    <>
      {/* Table with Bootstrap styling */}
      <table className='table table-bordered' style={{ margin: "13px", marginLeft: "50px", borderRadius: '15px', width: '20rem', height: '48vh' }}>
        {/* Table header */}
        <thead>
          <tr>
            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CME Category</th>
            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CME Hr Required/ Done</th>
            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Action</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody style={{ textAlign: 'center', justifyContent: 'center', verticalAlign: 'middle' }}>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.label}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.data}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.component}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Note about State Mandated */}
      <div style={{ textAlign: 'center' }}>Note*: State Mandated should be AMA CAT I</div>
    </>
  );
};

export default Table;

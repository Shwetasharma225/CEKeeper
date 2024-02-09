import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import backgroundImage from "./scs.img.jpg"; // Replace this path with the correct path to your image

const EmailVerification = () => {
  const { token } = useParams();

  const [verificationStatus, setVerificationStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://warals1.ddns.net:8045/api/CheckVerification/${token}`, {
          method: 'POST'
        });

        if (response.ok) {
          setVerificationStatus("Email Verified Successfully.....");
        } else {
          setVerificationStatus("Email Verification Failed");
        }
      } catch (error) {
        console.error("Error:", error);
        setVerificationStatus("Email Verification Failed");
      }
    };

    verifyEmail();
  }, [token]);

  const containerStyle = {
    //textAlign: 'center',
    marginTop: '70px',
    marginLeft: '30px'
  };

  const statusStyle = {
    fontSize: '18px',
    color: verificationStatus === 'Email Verified Successfully.....' ? 'green' : 'red',
  };

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative', 
    height: '100vh',
    width: '100%',
  };

  return (
    <div style={backgroundStyle}>
      <div style={containerStyle}>
        <h1>Email Verification</h1>
        <p style={statusStyle}>{verificationStatus}</p>
      </div>
    </div>
  );
};

export default EmailVerification;

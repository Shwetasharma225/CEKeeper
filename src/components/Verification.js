import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Verification = () => {
//    const { token } = useParams(); // Assuming you pass the verification token as a URL parameter

  const [verificationStatus, setVerificationStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Make an API request to your backend to verify the email
        // You may need to replace 'YOUR_BACKEND_ENDPOINT' with your actual API endpoint URL
        const response = await fetch(`http://warals1.ddns.net:8045/api/EmailVerification`);

        if (response.ok) {
          setVerificationStatus("Email Verified Successfully");
        } else {
          setVerificationStatus("Email Verification Failed");
        }
      } catch (error) {
        console.error("Error:", error);
        setVerificationStatus("Email Verification Failed");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default Verification;

import React, { useState } from "react";
import PropTypes from "prop-types";
import OtpInput from "react-otp-input";

const TestAuth = () => {
  const [otp, setOtp] = useState("");

  return (
    <OtpInput
      value={otp}
      onChange={setOtp}
      numInputs={6}
      //   renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
      inputStyle="inputStyle"
      containerStyle="containerStyle"
      inputType="tel"
    />
  );
};

TestAuth.propTypes = {};

export default TestAuth;

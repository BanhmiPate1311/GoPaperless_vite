import { Box, TextField, Typography } from "@mui/material";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const Step1 = ({ phoneNumber }) => {
  const { t } = useTranslation();
  const phoneNumberInputRef = useRef(null);
  //   const phoneNumber = "84901790767";
  const maskedPhoneNumber = () => {
    const hiddenPart = phoneNumber
      .substring(phoneNumber.length - 7, phoneNumber.length - 2)
      .replace(/\d/g, "*");
    return (
      "+" +
      phoneNumber.slice(0, phoneNumber.length - 7) +
      hiddenPart +
      phoneNumber.slice(-2)
    );
  };

  useEffect(() => {
    // When showPersonalCode changes, reset personalCode to empty string

    const phoneNumberInput = phoneNumberInputRef.current;
    if (!phoneNumberInput) {
      return;
    }
    intlTelInput(phoneNumberInput, {
      initialCountry: "vn",
    });
  }, []);
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        {/* Confirm your phone number in order to sign the document with a Qualified
        Electronic Signature. */}
        {t("electronic.step132")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
          justifyContent: "center",
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          // defaultValue={personalInfomation?.fullName}
          sx={{
            m: 1,

            color: "#1976D2",
            // "& .MuiInputBase-input": {
            //   left: "40px",
            // },
          }}
          type="tel"
          inputRef={phoneNumberInputRef}
          value={maskedPhoneNumber()}
          // maxLength="16"
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: true,
          }}
          // onChange={handlePhoneNumber}
          inputProps={{
            style: {
              color: "#1976D2",
            },
          }}
        />
      </Box>
    </Box>
  );
};

Step1.propTypes = {
  phoneNumber: PropTypes.string,
};

export default Step1;

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PhoneInputField2 } from "../form";

export const Step7 = ({ onDisableSubmit, phoneNumberRef }) => {
  const { t } = useTranslation();

  const [phoneNumber, setPhoneNumber] = useState("");

  const checkParam = (value, condition) => {
    if (value.length >= condition) {
      onDisableSubmit(false);
    } else {
      onDisableSubmit(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handlePhoneNumber = (phone, country) => {
    setPhoneNumber(phone);
    phoneNumberRef.current = phone;
    checkParam(phone, 11);
  };

  useEffect(() => {
    onDisableSubmit(true);
  }, []);
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "textBold.main" }}>
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step71")}
      </Typography>
      <Typography
        variant="h6"
        textAlign={"center"}
        mt={2}
        sx={{ color: "signingtextBlue.main" }}
      >
        {/* Phone Verification */}
        {t("electronic.step73")}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexWrap: "wrap",
          fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
          justifyContent: "center",
        }}
        autoComplete="off"
      >
        <PhoneInputField2
          label={""}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          handlePhoneNumber={handlePhoneNumber}
        />
      </Box>
    </Box>
  );
};

Step7.propTypes = {
  onDisableSubmit: PropTypes.func,
  phoneNumberRef: PropTypes.object,
};

export default Step7;

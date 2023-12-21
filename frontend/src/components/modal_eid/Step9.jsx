import { Box, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Step9 = ({ onDisableSubmit, setErrorPG, emailRef }) => {
  const { t } = useTranslation();

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  useEffect(() => {
    onDisableSubmit(true);
  }, []);

  const handleEmail = (event) => {
    if (!isValidEmail(event.target.value) || event.target.value.length === 0) {
      setErrorPG(t("electronic.email invalid"));
      onDisableSubmit(true);
    } else {
      setErrorPG(null);
      onDisableSubmit(false);
    }

    // setEmail(event.target.value);
    emailRef.current = event.target.value;
  };
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "textBold.main" }}
        mb={"10px"}
      >
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step91")}
      </Typography>
      <Typography
        variant="h6"
        textAlign={"center"}
        mb={"15px"}
        sx={{ color: "signingtextBlue.main" }}
      >
        {/* Phone Verification */}
        {t("electronic.step93")}
      </Typography>

      <Box
        sx={{
          mt: 1,
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          label=""
          type="email"
          //   inputRef={phoneNumberInputRef}
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }} // shrink here
          inputProps={{
            style: {
              fontSize: "14px",
            },
            // maxLength: "16",
          }}
          onChange={handleEmail}
        />
      </Box>
    </Box>
  );
};

Step9.propTypes = {
  onDisableSubmit: PropTypes.func,
  setErrorPG: PropTypes.func,
  emailRef: PropTypes.object,
};

export default Step9;

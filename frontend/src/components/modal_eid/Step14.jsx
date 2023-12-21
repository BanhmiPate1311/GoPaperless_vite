import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const Step14 = ({ tax, onDisableSubmit }) => {
  const { t } = useTranslation();

  const handleTax = (e) => {
    tax.current = e.target.value;
    if (e.target.value.length < 10 || e.target.value.length > 14) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
  };
  return (
    <Box>
      <Typography variant="h6" sx={{ height: "17px" }} mb={"10px"}>
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step141")}
      </Typography>
      <Typography
        variant="h6"
        // textAlign={"center"}
        mb={"10px"}
        sx={{ fontWeight: 600, color: "textBold.main", height: "17px" }}
      >
        {/* Phone Verification */}
        {t("electronic.step142")}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "45px",
        }}
        autoComplete="off"
      >
        <TextField
          fullWidth
          size="small"
          id="outlined-read-only-input"
          label=""
          type="number"
          autoComplete="new-password"
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
            maxLength: 10,
          }}
          onChange={handleTax}
        />
      </Box>
    </Box>
  );
};

Step14.propTypes = {
  tax: PropTypes.object,
  onDisableSubmit: PropTypes.func,
};

export default Step14;

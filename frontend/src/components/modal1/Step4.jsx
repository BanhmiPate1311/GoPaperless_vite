import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { SelectField } from "../../form";

// eslint-disable-next-line react/prop-types
export const Step4 = ({ assurance, setAssurance, onDisableSubmit }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (assurance === "") {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
  }, [assurance]);

  const handleChange = (event) => {
    setAssurance(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 400 }}>
      <FormControl fullWidth size="small">
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signingForm.title5")}
        </Typography>
        <Select
          labelId="demo-simple-select1-label"
          id="demo-simple-select"
          value={assurance}
          onChange={handleChange}
          sx={{
            backgroundColor: "signingWFBackground.main",
          }}
        >
          <MenuItem value={"aes"}>Advanced Electronic (AES)</MenuItem>
          <MenuItem value={"eseal"}>Electronic Seal (eSeal)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

Step4.propTypes = {
  onDisableSubmit: PropTypes.func,
};

export default Step4;

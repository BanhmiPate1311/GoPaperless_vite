import { FormControl, Select, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";

export const Step3_eid = ({
  data,
  criteria,
  setCriteria,
  code,
  setCode,
  onDisableSubmit,
  handleSubmit,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    switch (criteria) {
      case "CITIZEN-IDENTITY-CARD":
        if (code.length === 12) {
          onDisableSubmit(false);
        } else {
          onDisableSubmit(true);
        }
        break;
      default:
        if (code.length >= 9) {
          onDisableSubmit(false);
        } else {
          onDisableSubmit(true);
        }
        break;
    }
  }, [code, onDisableSubmit, criteria]);

  const handleChange1 = (event) => {
    // console.log("event: ", event.target.value);
    setCode("");
    setCriteria(event.target.value);
  };

  const createTitle = () => {
    switch (criteria) {
      case "CITIZEN-IDENTITY-CARD":
        return t("signing.personal_code");
      case "PASSPORT-ID":
        return t("signing.passport");
      case "PERSONAL-ID":
        return t("signing.identity_card");
    }
  };

  return (
    <Stack sx={{ minWidth: 400, height: "100%" }}>
      <Typography variant="h6" fontWeight={500} mb="15px">
        {t("signingForm.title3")}
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb={"10px"}>
          {t("signing.search_criteria")}
        </Typography>
        <Select
          labelId="demo-simple-select1-label"
          id="demo-simple-select"
          value={criteria}
          onChange={handleChange1}
          sx={{
            "& .MuiListItemSecondaryAction-root": {
              right: "30px",
              display: "flex",
            },
            backgroundColor: "signingWFBackground.main",
          }}
        >
          {data?.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.remark}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box width={"100%"} flexGrow={1}>
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb={"10px"}>
          {createTitle()}
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          value={code}
          onChange={(event) => {
            if (criteria === "PASSPORT-ID") {
              setCode(event.target.value);
            } else if (criteria === "PERSONAL-ID") {
              setCode(event.target.value.replace(/[^\d-]/g, ""));
            } else {
              setCode(event.target.value.replace(/\D/g, ""));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          sx={{ my: 0, backgroundColor: "signingWFBackground.main" }}
          inputProps={{
            maxLength:
              criteria === "CITIZEN-IDENTITY-CARD"
                ? 12
                : criteria === "PERSONAL-ID"
                ? 20
                : 9,
          }}
        />
      </Box>

      {/* {errorApi && (
    <Box width={"100%"}>
      <Alert severity="error">{errorApi}</Alert>
    </Box>
  )} */}
    </Stack>
  );
};

Step3_eid.propTypes = {
  data: PropTypes.array,
  criteria: PropTypes.string,
  setCriteria: PropTypes.func,
  code: PropTypes.string,
  setCode: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
};
export default Step3_eid;

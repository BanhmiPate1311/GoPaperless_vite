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
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (code.length < 9) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
  }, [code, onDisableSubmit]);

  const handleChange1 = (event) => {
    // console.log("event: ", event.target.value);
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
      <Box mb={4} width={"100%"}>
        <FormControl fullWidth size="small">
          <Typography variant="h6" color="#1F2937" fontWeight={600}>
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
      </Box>

      <Box width={"100%"} flexGrow={1}>
        <Typography variant="h6" color="#1F2937" fontWeight={600}>
          {createTitle()}
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
          }}
          sx={{ my: 0 }}
          inputProps={{
            sx: {
              backgroundColor: "signingWFBackground.main",
            },
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
};
export default Step3_eid;

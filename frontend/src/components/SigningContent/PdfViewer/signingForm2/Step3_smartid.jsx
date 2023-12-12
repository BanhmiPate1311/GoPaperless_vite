import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FormControl, Select, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

export const Step3_smartid = ({
  data,
  dialCode,
  errorApi,
  criteria,
  setCriteria,
  code,
  setCode,
  onDisableSubmit,
}) => {
  const { t } = useTranslation();
  const [isPhoneSelect, setIsPhoneSelect] = useState(true);

  // console.log("code: ", code);
  useEffect(() => {
    if (
      (isPhoneSelect && code.length < 11) ||
      (!isPhoneSelect && code.length < 9)
    ) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
    // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
    //   onDisableSubmit(true);
    // }
  }, [isPhoneSelect, code]);
  const handleChange1 = (event) => {
    // console.log("event: ", event.target.value);
    setCriteria(event.target.value);

    if (event.target.value === "PHONE") {
      setCode("84");
      setIsPhoneSelect(true);
    } else {
      setCode("");
      setIsPhoneSelect(false);
    }
  };

  return (
    <Stack sx={{ minWidth: 400, height: "100%" }}>
      <Box mb="15px" width={"100%"}>
        <FormControl fullWidth size="small">
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
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

      <Box
        width={"100%"}
        display={isPhoneSelect ? "block" : "none"}
        // mt={6}
        flexGrow={1}
      >
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signing.phoneNumber")}
        </Typography>
        <PhoneInput
          country={"vn"}
          // placeholder={label}
          // enableSearch={true}
          specialLabel={""}
          value={code}
          onChange={(phone, country) => {
            setCode(phone);
            dialCode.current = country.dialCode;
          }}
          inputStyle={{
            height: "40px",
            width: "100%",
          }}
          copyNumbersOnly={false}
        />
      </Box>
      {/* ) : ( */}
      <Box
        width={"100%"}
        display={isPhoneSelect ? "none" : "block"}
        flexGrow={1}
      >
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
          {t("signing.personalCode")}
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

      {errorApi && (
        <Box width={"100%"}>
          <Alert severity="error">{errorApi}</Alert>
        </Box>
      )}
    </Stack>
  );
};

Step3_smartid.propTypes = {
  data: PropTypes.array,
  dialCode: PropTypes.object,
  errorApi: PropTypes.string,
  criteria: PropTypes.string,
  setCriteria: PropTypes.func,
  code: PropTypes.string,
  setCode: PropTypes.func,
  onDisableSubmit: PropTypes.func,
};

export default Step3_smartid;

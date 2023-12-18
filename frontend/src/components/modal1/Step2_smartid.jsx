import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FormControl, Select, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

export const Step2_smartid = ({
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
    // let phoneWithoutDialCode = code.slice(dialCode.current.length);
    // if (phoneWithoutDialCode.match(/^0+/)) {
    //   // Remove all leading '0's, leaving at least one '0'
    //   phoneWithoutDialCode = phoneWithoutDialCode.replace(/^0+/, "");
    // }
    // if (isPhoneSelect) {
    //   let phoneWithoutDialCode = code.slice(dialCode.current.length);
    //   console.log("phoneWithoutDialCode: ", phoneWithoutDialCode);
    //   if (
    //     phoneWithoutDialCode.match(/^0+/) &&
    //     phoneWithoutDialCode.length === 10
    //   ) {
    //     onDisableSubmit(false);
    //   } else if (
    //     phoneWithoutDialCode.match(/^(?!0+)/) &&
    //     phoneWithoutDialCode.length === 9
    //   ) {
    //     onDisableSubmit(false);
    //   } else {
    //     onDisableSubmit(true);
    //   }
    // }
    let phoneWithoutDialCode;
    switch (criteria) {
      case "PHONE":
        phoneWithoutDialCode = code.slice(dialCode.current.length);
        if (
          phoneWithoutDialCode.match(/^0+/) &&
          phoneWithoutDialCode.length === 10
        ) {
          onDisableSubmit(false);
        } else if (
          phoneWithoutDialCode.match(/^(?!0+)/) &&
          phoneWithoutDialCode.length === 9
        ) {
          onDisableSubmit(false);
        } else {
          onDisableSubmit(true);
        }
        break;
      case "CITIZEN-IDENTITY-CARD":
        if (code.length === 12) {
          onDisableSubmit(false);
        } else {
          onDisableSubmit(true);
        }
        break;
      default:
        if (code.length === 9) {
          onDisableSubmit(false);
        } else {
          onDisableSubmit(true);
        }
        break;
    }

    // if (
    //   (isPhoneSelect && code.length < 11) ||
    //   (!isPhoneSelect && code.length < 9)
    // ) {
    //   onDisableSubmit(true);
    // } else {
    //   onDisableSubmit(false);
    // }
  }, [isPhoneSelect, code, criteria]);
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
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" color="#1F2937" fontWeight={500} mb="15px">
        {t("signingForm.title1")}
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: "15px" }}>
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
          countryCodeEditable={false}
          // enableLongNumbers={11}
          inputProps={{
            maxLength: 16,
          }}
        />
      </Box>
      {/* ) : ( */}
      <Box
        width={"100%"}
        display={isPhoneSelect ? "none" : "block"}
        flexGrow={1}
      >
        <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
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
            maxLength: criteria === "CITIZEN-IDENTITY-CARD" ? 12 : 9,
            type: criteria === "PASSPORT-ID" ? "text" : "number",
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

Step2_smartid.propTypes = {
  data: PropTypes.array,
  dialCode: PropTypes.object,
  errorApi: PropTypes.string,
  criteria: PropTypes.string,
  setCriteria: PropTypes.func,
  code: PropTypes.string,
  setCode: PropTypes.func,
  onDisableSubmit: PropTypes.func,
};

export default Step2_smartid;

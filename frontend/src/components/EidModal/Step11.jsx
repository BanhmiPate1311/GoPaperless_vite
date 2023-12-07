import { useConnectorList } from "@/hook";
import { api } from "@/utils/api";
import {
  Box,
  FormControl,
  FormGroup,
  InputLabel,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Step11 = ({
  onDisableSubmit,
  providerSelected,
  isFetching,
  connectorList,
}) => {
  const { t } = useTranslation();
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");

  const handleCheckbox1Change = (event) => {
    setIsChecked1(event.target.checked);
    // Truyền giá trị isSubmitDisabled lên component cha
    onDisableSubmit(
      !(event.target.checked && isChecked2 && selectedOption !== "")
    );
  };

  const handleCheckbox2Change = (event) => {
    setIsChecked2(event.target.checked);
    // Truyền giá trị isSubmitDisabled lên component cha
    onDisableSubmit(
      !(event.target.checked && isChecked1 && selectedOption !== "")
    );
  };

  useEffect(() => {
    onDisableSubmit(!(isChecked1 && isChecked2 && selectedOption !== ""));
  }, [isChecked1, isChecked2, selectedOption]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    providerSelected.current = event.target.value;
  };

  const [options, SetOptions] = useState([]);

  const getConnectorName = async (param) => {
    try {
      const response = await api.post("/base64Logo", { param });
      SetOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getConnectorName("SMART_ID_SIGNING");
  // }, []);
  useEffect(() => {
    onDisableSubmit(true);
  }, []);

  return (
    <Stack justifyContent="space-between" height="100%">
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "textBold.main" }}
        >
          {t("electronic.step111")}
        </Typography>

        <Typography fontSize="12px" my="16px">
          {/* Please accept our certification terms to sign the document. */}
          {t("electronic.step112")}
        </Typography>

        <FormGroup>
          <label
            style={{
              marginTop: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-start",
            }}
            onChange={handleCheckbox1Change}
          >
            <input
              type="checkbox"
              style={{
                marginTop: "4px",
                marginRight: "15px",
                size: "14px",
                /* Đổ màu cho ô input */
                accentColor: "#1976D2",
              }}
            />
            <div style={{ fontSize: "14px" }}>
              {/* I have read the{" "} */}
              {t("electronic.step113")}{" "}
              <Link to="https://rssp.mobile-id.vn/vi/privacy" target="_blank">
                {/* Certification Practices Statement. */}
                {t("electronic.step114")}
              </Link>
            </div>
          </label>

          <label
            className="d-flex align-items-start"
            style={{
              marginTop: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-start",
            }}
            onChange={handleCheckbox2Change}
          >
            <input
              type="checkbox"
              style={{
                marginTop: "4px",
                marginRight: "15px",
                size: "14px",
                /* Đổ màu cho ô input */
                accentColor: "#1976D2",
              }}
            />
            <div style={{ fontSize: "14px" }}>
              {/* I agree to the{" "} */}
              {t("electronic.step113")}{" "}
              <Link to="https://rssp.mobile-id.vn/vi/terms" target="_blank">
                {/* Terms and Conditions */}
                {t("electronic.step115")}
              </Link>{" "}
              {/* on the Video Identification Process. */}
              {t("electronic.step116")}
            </div>
          </label>
        </FormGroup>
      </Box>

      <Box sx={{ fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif", mb: 6 }}>
        <FormControl
          fullWidth
          sx={{
            marginTop: "20px",
            fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif !important",
          }}
        >
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
            }}
          >
            {/* Select Remote Signing Service Provider */}
            {t("electronic.step117")}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOption}
            label={t("electronic.step117")}
            onChange={handleChange}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
              },
              fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
            }}
            disabled={!isChecked1 || !isChecked2 || isFetching}
          >
            {connectorList.map((val, index) => (
              <MenuItem key={index} value={val.connectorName}>
                {val.remark}
                <ListItemSecondaryAction>
                  <img src={val.logo} height="25" alt="logo" />
                </ListItemSecondaryAction>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );
};

Step11.propTypes = {
  onDisableSubmit: PropTypes.func,
  providerSelected: PropTypes.object,
  isFetching: PropTypes.bool,
  connectorList: PropTypes.array,
};

export default Step11;

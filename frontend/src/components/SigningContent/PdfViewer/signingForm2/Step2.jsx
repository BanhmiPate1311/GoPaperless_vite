import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Step2 = ({
  provider,
  setProvider,
  connectorName,
  setConnectorName,
  providerName,
  connectorList,
  filterConnector,
  onDisableSubmit,
  errorPG,
  errorApi,
}) => {
  const { t } = useTranslation();
  const [data2, setData2] = useState(null);
  const mapProvider = providerName.reduce((acc, option, i) => {
    switch (option) {
      case "MOBILE_ID_SIGNING":
        acc[i] = {
          label: "Mobile-ID",
          icon: <MobileIdIcon />,
          value: "MOBILE_ID_SIGNING",
        };
        break;
      case "SMART_ID_SIGNING":
        acc[i] = {
          label: "Smart-ID",
          icon: <SmartIdIcon />,
          value: "SMART_ID_SIGNING",
        };
        break;
      case "USB_TOKEN_SIGNING":
        acc[i] = {
          label: "USB-Token",
          icon: <UsbIcon />,
          value: "USB_TOKEN_SIGNING",
        };
        break;
      case "ELECTRONIC_ID":
        acc[i] = {
          label: "Electronic video base Identification",
          icon: <EidIcon />,
          value: "ELECTRONIC_ID",
        };
        break;
      default:
        // Handle unknown signing option
        break;
    }
    return acc;
  }, []);

  useEffect(() => {
    if (connectorName === "") {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
    if (
      (provider === "USB_TOKEN_SIGNING" || provider === "ELECTRONIC_ID") &&
      errorPG
    ) {
      onDisableSubmit(true);
    }
  }, [connectorName, onDisableSubmit, provider, errorPG]);

  const handleChange1 = (e) => {
    setProvider(e.target.value);
    setConnectorName("");

    const filterValue = e.target.value;
    const filterProvider = connectorList?.[filterValue];

    if (filterProvider) {
      const filterData = filterProvider.filter((item) =>
        filterConnector.includes(item.connectorName)
      );
      const content = filterData.length > 0 ? filterData : filterProvider;
      const content2 = content.map((item, i) => {
        return (
          <MenuItem
            key={i}
            value={
              item.connectorName !== "MOBILE_ID_IDENTITY"
                ? item.connectorName
                : item.remark
            }
          >
            {item.remark}
            <ListItemSecondaryAction>
              <img src={item.logo} height="25" alt="logo" />
            </ListItemSecondaryAction>
          </MenuItem>
        );
      });
      setData2(content2);
    } else {
      setData2(null); // Handle the case where filteredData is undefined or null
    }
  };

  const handleChange2 = (e) => {
    setConnectorName(e.target.value);
    // setCert({});
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Box mb="10px" width={"100%"}>
        <FormControl fullWidth size="small">
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {t("signing.signing_method")}
          </Typography>
          <Select
            labelId="demo-simple-select1-label"
            id="demo-simple-select"
            value={provider}
            onChange={handleChange1}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          >
            {mapProvider.map((item, i) => {
              return (
                <MenuItem key={i} value={item.value}>
                  {item.label}
                  <ListItemSecondaryAction>{item.icon}</ListItemSecondaryAction>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box width={"100%"} flexGrow={1}>
        <FormControl fullWidth size="small" disabled={provider === ""}>
          <Typography variant="h6" color="#1F2937" fontWeight={600} mb="10px">
            {t("signingForm.step2")}
          </Typography>
          <Select
            labelId="demo-simple-select1-label"
            id="demo-simple-select"
            value={connectorName}
            onChange={handleChange2}
            sx={{
              "& .MuiListItemSecondaryAction-root": {
                right: "30px",
                display: "flex",
              },
              backgroundColor: "signingWFBackground.main",
            }}
          >
            {data2}
          </Select>
        </FormControl>
      </Box>
      {/* <CheckIdSoft name="messageError" /> */}
      {provider === "USB_TOKEN_SIGNING" && errorApi && (
        <Box width={"100%"} mt={2}>
          <Alert severity="error">{errorApi}</Alert>
        </Box>
      )}
      {(provider === "USB_TOKEN_SIGNING" || provider === "ELECTRONIC_ID") &&
        errorPG && (
          <Box width={"100%"} mt={2}>
            <Alert severity="error">
              {errorPG}
              <a
                href="/view/uiApi/download/checkid"
                download
                style={{ color: "#991B1B", fontWeight: "bold" }}
              >
                {t("modal.download")}
              </a>
            </Alert>
          </Box>
        )}
    </Stack>
  );
};

Step2.propTypes = {
  provider: PropTypes.string,
  setProvider: PropTypes.func,
  connectorName: PropTypes.string,
  setConnectorName: PropTypes.func,
  providerName: PropTypes.array,
  connectorList: PropTypes.object,
  filterConnector: PropTypes.array,
  onDisableSubmit: PropTypes.func,
  errorPG: PropTypes.string,
  errorApi: PropTypes.string,
  setErrorApi: PropTypes.func,
};

export default Step2;

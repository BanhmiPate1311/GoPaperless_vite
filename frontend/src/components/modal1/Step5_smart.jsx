import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { convertTime } from "@/utils/commonFunction";
import styled from "@emotion/styled";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalCertInfor } from ".";

const ToggleButtonStyle = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    border: "2px solid #0f6dca !important",
  },
  "&:not(.Mui-selected)": {
    // Đặt kiểu cho các phần tử không được chọn
    color: "#111", // tắt chức năng làm mờ của Mui
  },
  marginBottom: "4px",
  border: "1px solid gray !important",
  borderRadius: "10px",
});

export const Step5_smart = ({
  data,
  certSelected,
  setCertSelected,
  onDoubleClick,
  onDisableSubmit,
  assurance,
  provider,
}) => {
  // console.log("data: ", data);
  const { t } = useTranslation();

  const [isShowCertInfor, setShowCertInfor] = useState([false]);

  useEffect(() => {
    if (certSelected === null) {
      onDisableSubmit(true);
    } else {
      onDisableSubmit(false);
    }
    // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
    //   onDisableSubmit(true);
    // }
  }, [certSelected, onDisableSubmit]);

  const content = data?.map((value, index) => (
    <ToggleButtonStyle
      sx={{
        textTransform: "capitalize",
        backgroundColor: "signingWFBackground.main",
      }}
      value={index}
      aria-label="list"
      key={index}
      onDoubleClick={(e) => {
        e.preventDefault();
        if (!isShowCertInfor[index]) {
          onDoubleClick(index);
        }
      }}
      // onMouseDown={(e) => {
      //   if (e.detail === 2) {
      //     e.preventDefault();
      //     handleSubmit(handleFormSubmit)();
      //   }
      // }}
    >
      <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
        <Tooltip title={t("signing.cert_tooltip")} followCursor>
          <Box height="60px" width="60px" mx={2}>
            <SvgIcon
              component={assurance === "aes" ? CardIcon : SealIcon}
              inheritViewBox
              sx={{
                width: "100%",
                height: "100%",
                color: "signingtextBlue.main",
                cursor: "pointer",
                // mx: 2,
              }}
              onClick={() => {
                handleShowCertInfor(index);
              }}
            />
          </Box>
        </Tooltip>

        <Box flexGrow={1} textAlign="left">
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ textTransform: "uppercase" }}
          >
            {value.subject}
          </Typography>
          <Typography variant="h6">
            {/* {t("usb.usb9")} */}
            {t("0-common.issuer")}: {value.issuer}
          </Typography>
          <Typography variant="h6">
            {t("0-common.valid")}: {convertTime(value.validFrom).split(" ")[0]}{" "}
            {t("0-common.to")} {convertTime(value.validTo).split(" ")[0]}
            {/* {t("0-common.valid")}: {value.validFrom.split(" ")[0]}{" "}
            {t("0-common.to")} {value.validTo.split(" ")[0]} */}
          </Typography>
        </Box>
      </Stack>
      <ModalCertInfor
        open={isShowCertInfor[index]}
        onClose={() => handleCloseCertInfor(index)}
        data={value}
        provider={provider}
      />
    </ToggleButtonStyle>
  ));

  const handleShowCertInfor = (index) => {
    const newValue = [...isShowCertInfor];
    newValue[index] = true;
    setShowCertInfor(newValue);
  };

  const handleCloseCertInfor = (index) => {
    const newValue = [...isShowCertInfor];
    newValue[index] = false;
    setShowCertInfor(newValue);
  };

  const handleChange = (event, nextView) => {
    // console.log("nextView: ", nextView);
    setCertSelected(nextView);
  };

  return (
    <Box sx={{ minWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: "10px" }}>
        {t("signingForm.title2")}
      </Typography>
      <Box width={"100%"}>
        {data?.length === 0 ? (
          <Alert severity="error">{t("signing.no_cert_found")}</Alert>
        ) : (
          <ToggleButtonGroup
            orientation="vertical"
            value={certSelected}
            exclusive
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {content}
          </ToggleButtonGroup>
        )}
      </Box>
    </Box>
  );
};

Step5_smart.propTypes = {
  data: PropTypes.array,
  setCertSelected: PropTypes.func,
  certSelected: PropTypes.number,
  onDoubleClick: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  assurance: PropTypes.string,
  provider: PropTypes.string,
};
export default Step5_smart;

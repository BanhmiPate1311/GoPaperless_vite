import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import { convertTime } from "@/utils/commonFunction";
import styled from "@emotion/styled";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
}) => {
  // console.log("data: ", data);
  const { t } = useTranslation();
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
      onDoubleClick={onDoubleClick}
      // onMouseDown={(e) => {
      //   if (e.detail === 2) {
      //     e.preventDefault();
      //     handleSubmit(handleFormSubmit)();
      //   }
      // }}
    >
      <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
        <Box width={50} height={50} ml={2} mr={2}>
          <CardIcon />
        </Box>

        <Box flexGrow={1} textAlign="left">
          <Typography fontWeight="bold" fontSize="14px">
            {value.subject}
          </Typography>
          <Typography fontSize="14px">
            {/* {t("usb.usb9")} */}
            {t("0-common.issuer")}: {value.issuer}
          </Typography>
          <Typography fontSize="14px">
            {t("0-common.valid")}: {convertTime(value.validFrom).split(" ")[0]}{" "}
            {t("0-common.to")} {convertTime(value.validTo).split(" ")[0]}
            {/* {t("0-common.valid")}: {value.validFrom.split(" ")[0]}{" "}
            {t("0-common.to")} {value.validTo.split(" ")[0]} */}
          </Typography>
        </Box>
      </Stack>
    </ToggleButtonStyle>
  ));

  const handleChange = (event, nextView) => {
    // console.log("nextView: ", nextView);
    setCertSelected(nextView);
  };

  return (
    <Box sx={{ minWidth: 400 }}>
      <Box width={"100%"}>
        {data?.length === 0 ? (
          <Alert severity="error">No Certificate found!</Alert>
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
};
export default Step5_smart;

import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { convertTime } from "@/utils/commonFunction";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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

export const Step13 = ({
  data,
  certSelected,
  setCertSelected,
  onDoubleClick,
  onDisableSubmit,
  assurance,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("certs");

  const handleChangeRadio = (event) => {
    setValue(event.target.value);
  };

  const handleChangeButton = (event, nextView) => {
    // console.log("nextView: ", nextView);
    setCertSelected(nextView);
  };
  useEffect(() => {
    if (value === "new") {
      onDisableSubmit(false);
    } else {
      if (certSelected === null) {
        onDisableSubmit(true);
      } else {
        onDisableSubmit(false);
      }
    }
  }, [value, certSelected, onDisableSubmit]);

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
    >
      <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
        <SvgIcon
          component={assurance === "aes" ? CardIcon : SealIcon}
          inheritViewBox
          sx={{
            width: "60px",
            height: "60px",
            color: "signingtextBlue.main",
            cursor: "pointer",
            mx: 2,
          }}
          // onClick={() => handleOpenSigningForm(index)}
        />

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
    </ToggleButtonStyle>
  ));
  return (
    <Box>
      <Typography
        style={{
          color: "#000",
          fontSize: "14px",
          fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
        }}
      >
        {t("modal.subtitle1")}
      </Typography>

      <FormControl fullWidth>
        {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChangeRadio}
        >
          <FormControlLabel
            value="certs"
            control={<Radio />}
            label={t("electronic.step121")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold !important",
                fontSize: "14px",
              },
              color: "#2978EB",
            }}
          />
          <Box
            component="div"
            id="transition1-modal-description"
            sx={{
              overflowY: "auto",
              maxHeight: 300,
              opacity: value !== "certs" ? 0.5 : 1, // Thay đổi opacity tùy thuộc vào giá trị của value
              pointerEvents: value !== "certs" ? "none" : "auto", // Vô hiệu hóa sự kiện chạm và click tùy thuộc vào giá trị của value
            }}
            disabled={value !== "certs"}
          >
            <div
              className="btn-group-vertical w-100"
              role="group"
              aria-label="Vertical radio toggle button group"
            >
              <ToggleButtonGroup
                orientation="vertical"
                value={certSelected}
                exclusive
                onChange={handleChangeButton}
                sx={{ width: "100%" }}
              >
                {content}
              </ToggleButtonGroup>
            </div>
          </Box>
          <FormControlLabel
            value="new"
            control={<Radio />}
            label={t("electronic.step122")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold !important",
                fontSize: "14px",
              },
              color: "#2978EB",
            }}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

Step13.propTypes = {
  data: PropTypes.array,
  setCertSelected: PropTypes.func,
  certSelected: PropTypes.number,
  onDoubleClick: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  assurance: PropTypes.string,
  setCertificate: PropTypes.func,
};

export default Step13;
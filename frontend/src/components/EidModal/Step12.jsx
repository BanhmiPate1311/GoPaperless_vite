import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import ToggleButton from "@mui/material/ToggleButton";
import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";

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

const Step12 = ({ certificateList, setCertificate }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("certs");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const [cerSelected, setCerSelected] = useState(0);
  const handleTokenSelected = (index) => {
    setCerSelected(index);
  };
  useEffect(() => {
    if (value === "none") {
      setCertificate(null);
    } else {
      setCertificate(certificateList[cerSelected]);
    }
  }, [value]);

  const content = certificateList?.map((value, index) => (
    <ToggleButtonStyle
      sx={{
        textTransform: "capitalize",
        backgroundColor: "signingWFBackground.main",
      }}
      value={index}
      aria-label="list"
      key={index}
      //   onMouseDown={(e) => {
      //     if (e.detail === 2) {
      //       e.preventDefault();
      //       handleSubmit(handleFormSubmit)();
      //     }
      //   }}
      onClick={() => handleTokenSelected(index)}
    >
      <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
        <Box width={50} height={50} ml={2} mr={6}>
          <CardIcon />
        </Box>

        <Box flexGrow={1} textAlign="left">
          <Typography fontWeight="bold" fontSize="14px">
            {value.subject}
          </Typography>
          <Typography fontSize="14px">
            {/* {t("usb.usb9")} */}
            Issuer: {value.issuer}
          </Typography>
          <Typography fontSize="14px">
            Valid: {value.validFrom.split(" ")[0]} to{" "}
            {value.validTo.split(" ")[0]}
          </Typography>
        </Box>
      </Stack>
    </ToggleButtonStyle>
  ));
  return (
    <Box>
      <Stack>
        <Typography
          className="modal-title fw-bold"
          style={{ color: "#2978eb", fontSize: "30px" }}
          id="exampleModalToggleLabel2"
        >
          {t("usb.usb3")}
        </Typography>
      </Stack>
      <Typography
        style={{
          color: "#000",
          fontSize: "14px",
          fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
        }}
      >
        {t("usb.usb4")}
      </Typography>

      <FormControl fullWidth>
        {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="certs"
            control={<Radio />}
            label={t("electronicid.step11a1")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold !important",
              },
              color: "#2978EB",
            }}
          />
          {/* button group ở đây */}
          {/* <ButtonGroup disabled={value !== "certs"}>
              <Button>Option 1</Button>
              <Button>Option 2</Button>
              <Button>Option 3</Button>
            </ButtonGroup> */}
          <Typography
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
              {content}
            </div>
          </Typography>
          <FormControlLabel
            value="none"
            control={<Radio />}
            label={t("electronicid.step11a2")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold !important",
              },
              color: "#2978EB",
            }}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

Step12.propTypes = {
  certificateList: PropTypes.array,
  setCertificate: PropTypes.func,
};

export default Step12;

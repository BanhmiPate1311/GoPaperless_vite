import { Box, Typography } from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OTPInput from "react-otp-input";

function CircularProgressWithLabel(props) {
  const formatTime = (seconds) => {
    const totalTime = 300;
    const minutes = Math.floor(((seconds / 100) * totalTime) / 60); // Số phút là phần nguyên khi chia cho 60
    const remainingSeconds = Math.floor(((seconds / 100) * totalTime) % 60); // Số giây còn lại là phần dư khi chia cho 60

    // Chuyển định dạng sang mm:ss
    const formattedTime = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  };

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontSize: "1.75rem" }}
          component="div"
          color="text.secondary"
        >
          {/* {`${Math.round(props.value)}%`} */}
          {formatTime(props.value)}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

const Step10 = ({
  setOtp,
  onDisableSubmit,
  processOTPResend,
  setErrorPG,
  perFormProcess,
  isFetching,
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(100);
  const [isFirst, setIsFirst] = useState(true);
  const [otp1, setOtp1] = useState("");

  useEffect(() => {
    if (progress > 0.5) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => prevProgress - 1 / 3);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [progress]);

  // close
  useEffect(() => {
    if (progress <= 0.5) {
      setProgress(0);
      setErrorPG(t("electronic.timeout"));
      // handleCloseModal1();
    }
  }, [progress]);
  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");
    // cut "-" from the data
    const formattedData = data.replace(/-/g, "");

    setOtp1(formattedData);
    if (formattedData.length === 6) {
      setOtp(formattedData);
      onDisableSubmit(false);
      if (isFirst) {
        setIsFirst(false);
        perFormProcess(formattedData);
      }
    } else {
      onDisableSubmit(true);
    }
  };

  // const [result, setResult] = useState();
  // console.log("result: ", result);
  const handleOnChange = (res) => {
    setOtp1(res);
    console.log("res: ", res.length);
    if (res.length === 6) {
      setOtp(res);
      onDisableSubmit(false);
      if (isFirst) {
        setIsFirst(false);
        perFormProcess(res);
      }
    } else {
      onDisableSubmit(true);
    }
  };
  useEffect(() => {
    onDisableSubmit(true);
  }, []);

  const [enResend, setEnResend] = useState(true);

  const handleResend = () => {
    if (enResend) {
      setProgress(100);
      setErrorPG(null);
      setIsFirst(true);
      // AuthInputRef.current?.clear();
      setOtp1("");
      processOTPResend();
      setEnResend(false);
      setTimeout(() => {
        setEnResend(true);
      }, 180000);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "textBold.main" }}>
        {/* Enter your phone number to receive a verification code. */}
        {t("electronic.step101")}
      </Typography>
      {/* <Typography
        variant="h6"
        textAlign={"center"}
        mt={2}
        sx={{ color: "signingtextBlue.main" }}
      >
       
        {t("electronic.step102")}
      </Typography> */}
      <Typography
        color="#1976D2"
        marginTop="26px"
        marginBottom="10px"
        textAlign="center"
      >
        {/* Enter The Code That Was Sent To Your Phone */}
        {t("electronic.step103")}
      </Typography>
      <OTPInput
        value={otp1}
        onChange={handleOnChange}
        numInputs={6}
        //   renderSeparator={<span>-</span>}
        renderInput={(props) => <input disabled={isFetching} {...props} />}
        inputStyle="inputStyle"
        containerStyle="containerStyle"
        inputType="tel"
        shouldAutoFocus={true}
        onPaste={handlePaste}
      />
      <Box textAlign="center" marginTop="50px">
        <CircularProgressWithLabel size={100} value={progress} />
      </Box>
      <Typography fontSize="14px" textAlign="center" marginTop="30px">
        {/* Verification process might take up to 5 minitues. */}
        {t("electronic.step104")}
      </Typography>
      <Box
        textAlign="center"
        marginTop="15px"
        sx={{
          cursor: enResend ? "pointer" : "not-allowed",
          color: enResend ? "#1976D2" : "#26293f",
        }}
        // onClick={processOTPResend}
        onClick={handleResend}
        // className="buttontet"
        disabled={!enResend}
      >
        {t("electronic.step105")}
      </Box>
    </Box>
  );
};

Step10.propTypes = {
  setOtp: PropTypes.func,
  onDisableSubmit: PropTypes.func,
  processOTPResend: PropTypes.func,
  handleCloseModal1: PropTypes.func,
  setErrorPG: PropTypes.func,
  perFormProcess: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default Step10;
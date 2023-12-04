import loading from "@/assets/images/ajax-loader.gif";
import { getLang, getSigner } from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useState } from "react";
import Step1 from "./Step1";
import { electronicService } from "@/services/electronic_service";

export const EidStepper = ({ onClose, workFlow, signatureData }) => {
  console.log("workFlow: ", workFlow);
  //   console.log("signatureData: ", signatureData);
  const [errorPG, setErrorPG] = useState(null);
  const [faceSuccess, setFaceSuccess] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState(null);
  // const [email, setEmail] = useState(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const [personalInfomation, setPersonalInformation] = useState(null);
  const [image, setImage] = useState(null);
  const [otp, setOtp] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [certificateList, setCertificateList] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [requestID, setRequestID] = useState(null);
  const [imageFace, setImageFace] = useState(null);
  const [shouldDetectFaces, setShouldDetectFaces] = useState(true);
  const [direction, setDirection] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const providerSelected = useRef(null);

  const [activeStep, setActiveStep] = useState(0);

  const [skipped, setSkipped] = useState(new Set());

  let lang = getLang();

  const signerId = getSigner(workFlow)?.signerId;

  const [subject, setSubject] = useState("");

  const [isIdentifyRegistered, setIsIdentifyRegistered] = useState(false);

  useEffect(() => {
    checkIdentity();
    // return () => {
    //   setErrorPG(null);
    //   if (sdk.current) {
    //     disconnectWSHTML();
    //   }
    // };
  }, []);

  const checkIdentity = async () => {
    const data = {
      lang: lang,
      code: workFlow.code,
      type: workFlow.criteriaAlias,
    };
    try {
      const response = await electronicService.checkIdentity(data);
      if (response.data) {
        setSubject(response.data);
      }
      if (response.data.status === 0) {
        setIsIdentifyRegistered(true);
        setPersonalInformation(response.data.personal_informations);
        setImage(response.data.personal_informations.dg2);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const isStepOptional = (step) => {
    return step === 15;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (step = 1) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + step);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 0:
        if (isIdentifyRegistered) {
          handleNext(3);
        } else {
          handleNext(1);
        }
        break;
      // case 2:
      //   connectToWS();
      //   break;
      // case 5:
      //   // faceAndCreate();
      //   setShouldDetectFaces(true);
      //   setErrorPG(null);
      //   break;
      // case 6:
      //   updateSubject();
      //   break;
      // case 7:
      //   perFormProcess(otp);
      //   break;
      // case 8:
      //   updateSubject();
      //   break;
      // case 9:
      //   perFormProcess(otp);
      //   break;
      // case 10:
      //   checkCertificate();
      //   // createCertificate();
      //   break;
      // case 11:
      //   if (certificate) {
      //     handleNext();
      //   } else {
      //     createCertificate();
      //   }
      //   // checkCertificate();
      //   break;
      // case 12:
      //   credentialOTP();
      //   break;
      // case 13:
      //   authorizeOTP(otp);
      //   break;
      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1 key="step1" isIdentifyRegistered={isIdentifyRegistered} />,
    // <Step2 onDisableSubmit={handleDisableSubmit} />,
    // <Step3 />,
    // <Step4 image={image} personalInfomation={personalInfomation} />,
    // <Step5 />,
    // <Step6
    //   handleCloseModal1={onClose}
    //   setImageFace={setImageFace}
    //   shouldDetectFaces={shouldDetectFaces}
    //   setShouldDetectFaces={setShouldDetectFaces}
    //   setIsFetching={setIsFetching}
    //   setErrorPG={setErrorPG}
    //   direction={direction}
    //   setDirection={setDirection}
    // />,
    // <Step7
    //   onDisableSubmit={handleDisableSubmit}
    //   phoneNumberRef={phoneNumberRef}
    // />,
    // <Step8
    //   setOtp={setOtp}
    //   onDisableSubmit={handleDisableSubmit}
    //   processOTPResend={processOTPResend}
    //   handleCloseModal1={onClose}
    //   setErrorPG={setErrorPG}
    //   perFormProcess={perFormProcess}
    // />,
    // <Step9
    //   onDisableSubmit={handleDisableSubmit}
    //   emailRef={emailRef}
    //   setErrorPG={setErrorPG}
    // />,
    // <Step10
    //   isFetching={isFetching}
    //   setOtp={setOtp}
    //   onDisableSubmit={handleDisableSubmit}
    //   processOTPResend={processOTPResend}
    //   handleCloseModal1={onClose}
    //   setErrorPG={setErrorPG}
    //   perFormProcess={perFormProcess}
    // />,
    // <Step11
    //   onDisableSubmit={handleDisableSubmit}
    //   providerSelected={providerSelected}
    //   isFetching={isFetching}
    // />,
    // <Step11a
    //   certificateList={certificateList}
    //   setCertificate={setCertificate}
    // />,
    // <Step12 phoneNumberRef={phoneNumberRef} />,
    // <Step13
    //   setOtp={setOtp}
    //   onDisableSubmit={handleDisableSubmit}
    //   phoneNumberRef={phoneNumberRef}
    //   resendCredentialOTP={credentialOTP}
    //   handleCloseModal1={onClose}
    //   setErrorPG={setErrorPG}
    //   authorizeOTP={authorizeOTP}
    //   isFetching={isFetching}
    // />,
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        subject &&
        Object.keys(subject).length !== 0 && (
          <Stack
            justifyContent="space-between"
            sx={{
              height: "625px",
            }}
          >
            {/* Nội dung ở đây */}
            <Typography component="div" sx={{ mt: 2, mb: 1, height: "80%" }}>
              {steps[activeStep]}
              {/* <div
              style={{ textAlign: "center", color: "red", marginTop: "5px" }}
            >
              {errorPG}
            </div> */}
            </Typography>
            {/* Hết nội dung */}
            <Typography component="div">
              {!faceSuccess && errorPG && (
                <Alert severity="error">{errorPG}</Alert>
              )}
              {faceSuccess && <Alert severity="success">{faceSuccess}</Alert>}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  // disabled={activeStep === 0}
                  // onClick={handleBack}
                  // onClick={handleCloseModal1}
                  onClick={
                    activeStep === 1 ||
                    activeStep === 2 ||
                    activeStep === 11 ||
                    activeStep === 12
                      ? handleBack
                      : onClose
                  }
                  sx={{
                    mr: 1,
                    fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
                    "&:hover": {
                      backgroundColor: "transparent", // Tắt màu nền khi hover
                    },
                  }}
                >
                  {activeStep === 1 ||
                  activeStep === 2 ||
                  activeStep === 11 ||
                  activeStep === 12
                    ? "Back"
                    : "Cancel"}
                  {/* {t("electronicid.other5")} */}
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button
                  onClick={handleSubmitClick}
                  disabled={
                    isFetching ||
                    // activeStep === 5 ||
                    ((activeStep === 1 ||
                      activeStep === 6 ||
                      activeStep === 7 ||
                      activeStep === 8 ||
                      activeStep === 9 ||
                      activeStep === 10 ||
                      activeStep === 13) &&
                      isSubmitDisabled)
                  }
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: "25px",
                    "&:hover": {
                      backgroundColor: "#0056b3",
                      // Các thuộc tính khác khi hover (nếu muốn)
                    },
                    "&:disabled": {
                      color: "#fff",
                    },
                    fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
                  }}
                >
                  {isFetching ? (
                    <div style={{ width: "76px" }}>
                      <img src={loading} width={20} alt="loading" />
                    </div>
                  ) : errorPG ? (
                    "Retry"
                  ) : activeStep === steps.length - 1 ? (
                    "Submit"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </Box>
            </Typography>
          </Stack>
        )
      )}
    </Box>
  );
};

EidStepper.propTypes = {
  workFlow: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signatureData: PropTypes.object,
};

export default EidStepper;

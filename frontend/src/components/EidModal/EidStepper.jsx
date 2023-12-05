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
import { useTranslation } from "react-i18next";
import Step2 from "./Step2";
import ISPluginClient from "@/assets/js/checkid";
import Step3 from "./Step3";
import { jwtDecode } from "jwt-decode";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";

export const EidStepper = ({ onClose, workFlow, signatureData }) => {
  // console.log("workFlow: ", workFlow);
  //   console.log("signatureData: ", signatureData);
  const { t } = useTranslation();
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
  const sdk = useRef(null);

  const providerSelected = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  // console.log("activeStep: ", activeStep);

  const [skipped, setSkipped] = useState(new Set());

  let lang = getLang();

  const signerId = getSigner(workFlow)?.signerId;

  const [subject, setSubject] = useState("");

  const [isIdentifyRegistered, setIsIdentifyRegistered] = useState(false);

  useEffect(() => {
    checkIdentity();
    return () => {
      setErrorPG(null);
      if (sdk.current) {
        disconnectWSHTML();
      }
    };
  }, []);

  useEffect(() => {
    if (imageFace != null) {
      faceAndCreate();
    }
  }, [imageFace]);

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

  function disconnectWSHTML() {
    console.log("đóng sdk");
    sdk.current.shutdown();
  }

  const connectToWS = () => {
    const ipWS = "127.0.0.1";
    const portWS = "9505";
    const typeOfWS = "wss";

    // var url = typeOfWS + "://" + ipWS + ":" + portWS + "/ISPlugin";
    sdk.current = new ISPluginClient(
      ipWS,
      portWS,
      typeOfWS,
      function () {
        console.log("connected");
        //            socket onopen => connected
        setIsFetching(true);
        if (activeStep === 2) {
          readCard();
        } else {
          // faceScan();
        }
      },
      function () {
        //            socket disconnected
        console.log("Connect error");
      },
      function () {
        //            socket stopped
      },
      function (statusCallBack) {
        console.log("connected denied");
      },
      function (cmd, id, error, data) {
        //RECEIVE
        console.log("cmd: " + cmd);
      }
    );
  };

  const readCard = () => {
    setErrorPG(null);
    sdk.current.getInformationDetails(
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      lang,
      workFlow.code.slice(-6),
      60,
      function (response) {
        console.log("subject Get: ", response);
        setIsFetching(false);
        setPersonalInformation(response.optionalDetails);
        setImage(response.image);
        handleNext();
      },
      function (error, mess) {
        console.log("error: ", error);
        console.log("mess: ", mess);
        // if (error === 1001) {
        //   setErrorPG(t("electronic.eid not found"));
        // }

        switch (error) {
          case 1001:
            setErrorPG(t("electronic.eid not found"));
            break;
          case 1102:
            setErrorPG(t("electronic.can wrong"));
            break;
          default:
            setErrorPG(mess);
            break;
        }
        setIsFetching(false);
        disconnectWSHTML();
      },
      function () {
        console.log("timeout");
        setIsFetching(false);
        sdk.current = null;
      }
    );
  };

  const faceAndCreate = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      code: workFlow.code,
      type: workFlow.criteriaAlias,
      facialImage: image,
      imageFace: imageFace,
    };

    try {
      // const response = await api.post("/elec/faceAndCreate", data);
      const response = await electronicService.faceAndCreate(data);
      // console.log("faceAndCreate: ", response);
      if (response.data.status === 0) {
        setJwt(response.data.jwt);
        // setProcessId(response.data);
        // setIsFetching(false);
        try {
          var decoded = jwtDecode(response.data.jwt);

          // console.log("decoded", decoded);

          if (decoded.mobile === "" || decoded.phone_number === "") {
            console.log("kiểm tra: ");

            checkIdentity();
          }

          let stepToNavigate = -1; // Giá trị mặc định để không thực hiện việc nhảy step

          if (decoded.phone_number === "") {
            console.log("Đăng ký số điện thoại: ");
            // stepToNavigate = 1;
            stepToNavigate = 6;
          } else if (decoded.email === "") {
            console.log("Đăng ký email: ");
            // setPhoneNumber(decoded.phone_number);
            phoneNumberRef.current = decoded.phone_number;
            // stepToNavigate = 3;
            stepToNavigate = 8;
          } else {
            // setPhoneNumber(decoded.phone_number);
            // setEmail(decoded.email);
            phoneNumberRef.current = decoded.phone_number;
            emailRef.current = decoded.email;
            // stepToNavigate = 5;
            stepToNavigate = 10;
          }

          if (stepToNavigate !== -1) {
            setDirection(t("electronic.faceSuccess"));
            setFaceSuccess(t("electronic.camSuccess"));
            setTimeout(() => {
              setIsFetching(false);
              setFaceSuccess(null);
              // handleNext(stepToNavigate);
              setActiveStep(stepToNavigate);
            }, 1000);
          }
        } catch (error) {
          console.error("Lỗi khi giải mã JWT:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API faceAndCreate:", error);
      setIsFetching(false);
      setErrorPG(error.response.data.message);
      // Xử lý lỗi tại đây nếu cần
    }
  };

  const updateSubject = async () => {
    const data = {
      lang: lang,
      jwt: jwt,
      phoneNumber: phoneNumberRef.current,
      email: emailRef.current,
      subject_id: personalInfomation.subject_id,
    };

    try {
      // const response = await api.post("/elec/updateSubject", data);
      const response = await electronicService.updateSubject(data);
      setProcessId(response.data);
      handleNext();
    } catch (error) {
      console.error("Lỗi khi gọi API updateSubject:", error);
      switch (activeStep) {
        case 6:
          setErrorPG(t("electronic.phone error"));
          break;
        case 8:
          setErrorPG(t("electronic.email error"));
          break;
        default:
          setErrorPG(error.response.data.message);
          break;
      }

      // Xử lý lỗi tại đây nếu cần
    }
  };

  const perFormProcess = async (otp) => {
    setErrorPG(null);
    const data = {
      lang: lang,
      otp: otp,
      subject_id: personalInfomation.subject_id,
      process_id: processId,
    };
    try {
      // const response = await api.post("/elec/processPerForm", data);
      const response = await electronicService.perFormProcess(data);
      if (response.data.status === 0) {
        setJwt(response.data.jwt);
        try {
          var decoded = jwtDecode(response.data.jwt);

          if (activeStep === 7) {
            if (decoded.email === "") {
              console.log("Đăng ký email: ");
              // handleNext(1); // Đăng ký email
              setActiveStep(8);
            } else {
              console.log("Email đã có, cập nhật: ");
              emailRef.current = decoded.email;
              // handleNext(3); // Chuyển tới step tiếp theo sau khi cập nhật email
              setActiveStep(10);
            }
          } else {
            console.log("Nhảy một bước tiến: ");
            // handleNext(1); // Nhảy một bước tiến nếu không phải step 7
            setActiveStep(10);
          }
        } catch (error) {
          console.error("Lỗi khi giải mã JWT:", error);
        }
      } else {
        setErrorPG(response.data.message);
        setIsFetching(false);
      }
    } catch (error) {
      console.log("error: ", error);
      // setErrorPG(t("electronic.step136"));
      setErrorPG(error.response.data.message);
    }
  };

  const processOTPResend = async () => {
    setErrorPG(null);
    const data = {
      lang: lang,
      jwt: jwt,
      subject_id: personalInfomation.subject_id,
      process_id: processId,
    };
    try {
      // const response = await api.post("/elec/processOTPResend", data);
      const response = await electronicService.processOTPResend(data);
      if (response.data.status === 0) {
        handleNext();
      } else {
        setErrorPG(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const checkCertificate = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      jwt: jwt,
      connectorName: connectorName,
      connectorNameRSSP: providerSelected.current,
      enterpriseId: workFlow.enterpriseId,
      workFlowId: workFlow.workFlowId,
    };
    try {
      // const response = await api.post("/elec/checkCertificate", data);
      const response = await electronicService.checkCertificate(data);
      setIsFetching(false);
      if (response.data.length === 0) {
        createCertificate();
        // handleNext(2);
      } else {
        setCertificateList(response.data);
        handleNext();
      }
      // setCertificate(response.data);
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
      setErrorPG(error.response.data.message);
    }
  };

  const createCertificate = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      jwt: jwt,
      connectorName: connectorName,
      connectorNameRSSP: providerSelected.current,
      enterpriseId: workFlow.enterpriseId,
      workFlowId: workFlow.workFlowId,
    };
    try {
      // const response = await api.post("/elec/createCertificate", data);
      const response = await electronicService.createCertificate(data);
      setIsFetching(false);
      setCertificate(response.data);
      // handleNext();
      setActiveStep(12);
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
      setErrorPG(error.response.data.message);
    }
  };

  const credentialOTP = async () => {
    setIsFetching(true);
    const data = {
      lang: lang,
      credentialID: certificate.credentialID,
      connectorName: connectorName,
      enterpriseId: workFlow.enterpriseId,
      workFlowId: workFlow.workFlowId,
    };
    try {
      // const response = await api.post("/elec/credentialOTP", data);
      const response = await electronicService.credentialOTP(data);
      setRequestID(response.data);
      setIsFetching(false);
      if (activeStep === 12) {
        handleNext();
      }
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
    }
  };

  const authorizeOTP = async (otp) => {
    dispatch(apiControllerManagerActions.clearsetMessageSuccess());
    console.log("authorizeOTP");
    setIsFetching(true);
    setErrorPG(null);
    const data = {
      lang: lang,
      credentialID: certificate.credentialID,
      requestID: requestID,
      otp: otp,
      signerId: signerId,
      signingToken: workFlow.signingToken,
      fileName: workFlow.fileName,
      signerToken: workFlow.signerToken,
      connectorName: connectorName,
      signingOption: "electronic_id",
      codeNumber: code,
      type: type,
      certChain: certificate.cert,
      enterpriseId: workFlow.enterpriseId,
      workFlowId: workFlow.workFlowId,
      fieldName: signature ? signature.field_name : "",
      lastFileId: workFlow.lastFileId,
      documentId: workFlow.documentId,
    };
    try {
      // const response = await api.post("/elec/authorizeOTP", data);
      const response = await electronicService.authorizeOTP(data);
      // setRequestID(response.data);
      // handleNext();
      window.parent.postMessage(
        { data: response.data, status: "Success" },
        "*"
      );
      dispatch(apiControllerManagerActions.setMessageSuccess());
      // handleCloseModal1();
    } catch (error) {
      console.log("error", error);
      setIsFetching(false);
      setErrorPG(error.response.data.message);
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

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
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
      case 2:
        connectToWS();
        break;
      case 5:
        // faceAndCreate();
        setShouldDetectFaces(true);
        setErrorPG(null);
        break;
      case 6:
        updateSubject();
        break;
      case 7:
        perFormProcess(otp);
        break;
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
    <Step2 key="step2" onDisableSubmit={handleDisableSubmit} />,
    <Step3 key="step3" />,
    <Step4 key="step4" image={image} personalInfomation={personalInfomation} />,
    <Step5 key="step5" />,
    <Step6
      key="step6"
      setImageFace={setImageFace}
      shouldDetectFaces={shouldDetectFaces}
      setShouldDetectFaces={setShouldDetectFaces}
      setIsFetching={setIsFetching}
      setErrorPG={setErrorPG}
      direction={direction}
      setDirection={setDirection}
    />,
    <Step7
      key={"step7"}
      onDisableSubmit={handleDisableSubmit}
      phoneNumberRef={phoneNumberRef}
    />,
    <Step8
      key={"step8"}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      processOTPResend={processOTPResend}
      setErrorPG={setErrorPG}
      perFormProcess={perFormProcess}
    />,
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
    <Box sx={{ width: "100%", height: 570 - 20 - 31 }}>
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
              height: "100%",
            }}
          >
            {/* Nội dung ở đây */}
            <Box flexGrow={1}>
              {steps[activeStep]}
              {/* <div
              style={{ textAlign: "center", color: "red", marginTop: "5px" }}
            >
              {errorPG}
            </div> */}
            </Box>
            {/* Hết nội dung */}
            {!faceSuccess && errorPG && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorPG}
              </Alert>
            )}
            {faceSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {faceSuccess}
              </Alert>
            )}
            <Box sx={{ height: "38px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
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
                    mr: 2,
                    fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
                    // "&:hover": {
                    //   backgroundColor: "transparent", // Tắt màu nền khi hover
                    // },
                    border: "1px solid ",
                    borderColor: "borderColor.main",
                    borderRadius: "10px",
                    fontWeight: 600,
                  }}
                >
                  {activeStep === 1 ||
                  activeStep === 2 ||
                  activeStep === 11 ||
                  activeStep === 12
                    ? t("0-common.back")
                    : t("0-common.cancel")}
                  {/* {t("electronic.other5")} */}
                </Button>
                {/* <Box sx={{ flex: "1 1 auto" }} /> */}
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button
                  variant="contained"
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
                  // sx={{
                  //   backgroundColor: "#1976D2",
                  //   color: "#fff",
                  //   padding: "10px 24px",
                  //   borderRadius: "10px",
                  //   "&:hover": {
                  //     backgroundColor: "#0056b3",
                  //     // Các thuộc tính khác khi hover (nếu muốn)
                  //   },
                  //   "&:disabled": {
                  //     color: "#fff",
                  //   },
                  //   lineHeight: 0,
                  //   fontFamily: "Montserrat, Nucleo, Helvetica, sans-serif",
                  // }}
                  sx={{
                    borderRadius: "10px",
                  }}
                >
                  {isFetching ? (
                    <div style={{ width: "76px" }}>
                      <img src={loading} width={20} alt="loading" />
                    </div>
                  ) : errorPG ? (
                    t("0-common.retry")
                  ) : activeStep === steps.length - 1 ? (
                    t("0-common.submit")
                  ) : (
                    t("0-common.continue")
                  )}
                </Button>
              </Box>
            </Box>
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

/* eslint-disable no-unused-vars */
import ISPluginClient from "@/assets/js/checkid";
import { useConnectorList } from "@/hook";
import { electronicService } from "@/services/electronic_service";
import { getLang } from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Step1,
  Step10,
  Step11,
  Step12,
  Step13,
  Step14,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
} from ".";

export const ModalEid = ({
  open,
  onClose,
  workFlow,
  setDataSigning,
  handleShowModalSignImage,
}) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(1);
  const [skipped, setSkipped] = useState(new Set());
  const [subject, setSubject] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [errorPG, setErrorPG] = useState(null);
  const [isIdentifyRegistered, setIsIdentifyRegistered] = useState(false);
  const [personalInfomation, setPersonalInformation] = useState(null);
  const [image, setImage] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [faceSuccess, setFaceSuccess] = useState(null);
  const [imageFace, setImageFace] = useState(null);
  const [shouldDetectFaces, setShouldDetectFaces] = useState(true);
  const [direction, setDirection] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processId, setProcessId] = useState(null);
  const [otp, setOtp] = useState(null);
  const [certificateList, setCertificateList] = useState([]);
  // console.log("certificateList: ", certificateList);
  const [newListCert, setNewListCert] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [assurance, setAssurance] = useState("");
  const [certSelected, setCertSelected] = useState(null);

  const sdk = useRef(null);
  //   const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const taxRef = useRef(null);
  const dialCode = useRef("");
  const providerSelected = useRef(null);

  const connectorName = "MOBILE_ID_IDENTITY";
  const providerName = ["SMART_ID_SIGNING"];
  const connectorList = useConnectorList(providerName);

  let lang = getLang();

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

  useEffect(() => {
    setErrorPG(null);
    setFaceSuccess(null);
  }, [activeStep]);

  function disconnectWSHTML() {
    console.log("đóng sdk");
    sdk.current.shutdown();
  }

  const handleReset = () => {
    setActiveStep(0);
  };

  //   const isStepOptional = (step) => {
  //     return step === 15;
  //   };

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

  //   const handleSkip = () => {
  //     if (!isStepOptional(activeStep)) {
  //       // You probably want to guard against something like this,
  //       // it should never occur unless someone's actively trying to break something.
  //       throw new Error("You can't skip a step that isn't optional.");
  //     }

  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     setSkipped((prevSkipped) => {
  //       const newSkipped = new Set(prevSkipped.values());
  //       newSkipped.add(activeStep);
  //       return newSkipped;
  //     });
  //   };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  // step submit
  const checkIdentity = async () => {
    const data = {
      lang: lang,
      code: workFlow.code,
      type: workFlow.criteriaAlias,
    };
    try {
      const response = await electronicService.checkIdentity(data);
      if (response.data) {
        console.log("checkIdentity: ", response.data);
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
        if (activeStep === 3) {
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
            stepToNavigate = 7;
          } else if (decoded.email === "") {
            console.log("Đăng ký email: ");
            setPhoneNumber(decoded.phone_number);
            // phoneNumberRef.current = decoded.phone_number;
            // stepToNavigate = 3;
            stepToNavigate = 9;
          } else {
            setPhoneNumber(decoded.phone_number);
            // setEmail(decoded.email);
            // phoneNumberRef.current = decoded.phone_number;
            emailRef.current = decoded.email;
            // stepToNavigate = 5;
            stepToNavigate = 11;
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
      phoneNumber: phoneNumber,
      email: emailRef.current,
      subject_id: personalInfomation.subject_id,
    };

    try {
      // const response = await api.post("/elec/updateSubject", data);
      const response = await electronicService.updateSubject(data);
      setProcessId(response.data);
      switch (activeStep) {
        case 7:
          setActiveStep(8);
          break;
        case 9:
          setActiveStep(10);
          break;
      }
      // handleNext();
    } catch (error) {
      console.error("Lỗi khi gọi API updateSubject:", error);
      switch (activeStep) {
        case 7:
          setErrorPG(t("electronic.phone error"));
          break;
        case 9:
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
      setIsFetching(true);
      // const response = await api.post("/elec/processPerForm", data);
      const response = await electronicService.perFormProcess(data);
      setIsFetching(false);
      if (response.data.status === 0) {
        setJwt(response.data.jwt);
        try {
          var decoded = jwtDecode(response.data.jwt);

          if (activeStep === 8) {
            if (decoded.email === "") {
              console.log("Đăng ký email: ");
              // handleNext(1); // Đăng ký email
              setActiveStep(9);
            } else {
              console.log("Email đã có, cập nhật: ");
              emailRef.current = decoded.email;
              // handleNext(3); // Chuyển tới step tiếp theo sau khi cập nhật email
              setActiveStep(11);
            }
          } else {
            // handleNext(1); // Nhảy một bước tiến nếu không phải step 7
            setActiveStep(11);
          }
        } catch (error) {
          console.error("Lỗi khi giải mã JWT:", error);
        }
      } else {
        setErrorPG(response.data.message);
        setIsFetching(false);
      }
    } catch (error) {
      setIsFetching(false);
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
        switch (activeStep) {
          case 8:
            setActiveStep(9);
            break;
          case 10:
            setActiveStep(11);
            break;
        }
        // handleNext();
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
      // console.log("response: ", response);
      setIsFetching(false);
      setCertificateList(response.data);
      // handleNext(1);
      setActiveStep(12);

      // if (response.data.length === 0) {
      //   createCertificate();
      // } else {
      //   setCertificateList(response.data);
      //   handleNext();
      // }
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
      assurance: assurance,
      taxCode: taxRef.current,
    };
    try {
      // const response = await api.post("/elec/createCertificate", data);
      const response = await electronicService.createCertificate(data);
      setIsFetching(false);
      setCertificate(response.data);
      setDataSigning({
        ...workFlow,
        connectorName: "MOBILE_ID_IDENTITY",
        email: emailRef.current,
        phoneNumber: phoneNumber,
        certChain: response.data,
        assurance: assurance,
      });

      onClose();
      handleShowModalSignImage();

      // handleNext();
      // setActiveStep(12);
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
      setErrorPG(error.response.data.message);
    }
  };

  let phoneWithoutDialCode;
  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        if (isIdentifyRegistered) {
          // handleNext(3);
          setActiveStep(4);
        } else {
          // handleNext(1);
          setActiveStep(2);
        }
        break;
      case 3:
        connectToWS();
        break;
      case 6:
        // faceAndCreate();
        setShouldDetectFaces(true);
        setErrorPG(null);
        break;
      case 7:
        phoneWithoutDialCode = phoneNumber.slice(dialCode.current.length);
        if (phoneWithoutDialCode.match(/^0+/)) {
          // Remove all leading '0's, leaving at least one '0'
          phoneWithoutDialCode = phoneWithoutDialCode.replace(/^0+/, "");
          //   phoneNumberRef.current = dialCode.current + phoneWithoutDialCode;
          setPhoneNumber(dialCode.current + phoneWithoutDialCode);
          break;
        }
        updateSubject();
        break;
      case 8:
        perFormProcess(otp);
        break;
      case 9:
        updateSubject();
        break;
      case 10:
        perFormProcess(otp);
        break;
      case 11:
        checkCertificate();
        break;
      case 12:
        switch (assurance) {
          case "aes":
            if (
              certificateList.length > 0 &&
              certificateList.filter((item) => item.seal === false).length > 0
            ) {
              setNewListCert(
                certificateList.filter((item) => item.seal === false)
              );
              // handleNext(1);
              setActiveStep(13);
            } else {
              createCertificate();
            }
            break;
          case "eseal":
            if (
              certificateList.length > 0 &&
              certificateList.filter((item) => item.seal === true).length > 0
            ) {
              setNewListCert(
                certificateList.filter((item) => item.seal === true)
              );
              // handleNext(1);
              setActiveStep(13);
            } else {
              // handleNext(2);
              setActiveStep(14);
              // createCertificate();
            }
            break;
        }
        break;
      case 13:
        console.log("certSelected: ", certSelected);
        if (certSelected !== null) {
          setDataSigning({
            ...workFlow,
            connectorName: "MOBILE_ID_IDENTITY",
            email: emailRef.current,
            phoneNumber: phoneNumber,
            assurance: assurance,
            certChain: newListCert[certSelected],
          });
          onClose();
          handleShowModalSignImage();
          // handleNext(); // chuyển modal
        } else {
          createCertificate();
        }
        break;
      case 14:
        setDataSigning({
          ...workFlow,
          connectorName: "MOBILE_ID_IDENTITY",
        });
        createCertificate();
        break;
      default:
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
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      dialCode={dialCode}
      handleSubmit={handleSubmitClick}
      isSubmitDisabled={isSubmitDisabled}
    />,
    <Step8
      key={"step8"}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      processOTPResend={processOTPResend}
      setErrorPG={setErrorPG}
      perFormProcess={perFormProcess}
    />,
    <Step9
      key={"step9"}
      onDisableSubmit={handleDisableSubmit}
      emailRef={emailRef}
      setErrorPG={setErrorPG}
      handleSubmit={handleSubmitClick}
      isSubmitDisabled={isSubmitDisabled}
    />,
    <Step10
      key={"step10"}
      isFetching={isFetching}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      processOTPResend={processOTPResend}
      handleCloseModal1={onClose}
      setErrorPG={setErrorPG}
      perFormProcess={perFormProcess}
    />,
    <Step11
      key={"step11"}
      onDisableSubmit={handleDisableSubmit}
      providerSelected={providerSelected}
      isFetching={isFetching}
      connectorList={connectorList?.data.SMART_ID_SIGNING}
      setErrorPG={setErrorPG}
    />,
    <Step12
      key={"step12"}
      assurance={assurance}
      setAssurance={setAssurance}
      onDisableSubmit={handleDisableSubmit}
    />,
    <Step13
      key={"step13"}
      data={newListCert}
      certSelected={certSelected}
      setCertSelected={setCertSelected}
      assurance={assurance}
      onDisableSubmit={handleDisableSubmit}
      provider="ELECTRONIC_ID"
    />,
    <Step14
      key={"step14"}
      tax={taxRef}
      onDisableSubmit={handleDisableSubmit}
      handleSubmit={handleSubmitClick}
      isSubmitDisabled={isSubmitDisabled}
    />,
  ];

  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "500px", // Set your width here
          height: "700px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          p: "10px 20px",
          height: "51px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "inline-block",
            color: "signingtextBlue.main",
            borderBottom: "4px solid",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
          }}
        >
          {t("electronic.title")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "dialogBackground.main",
          height: "100%",
          // py: "10px",
          borderBottom: "1px solid",
          borderColor: "borderColor.main",
          p: "0 20px 10px",
        }}
      >
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          // className="choyoyoy"
        >
          <Stack sx={{ mt: 0, mb: 1, height: "100%" }}>
            {activeStep === steps.length + 1 ? (
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
                  <Box flexGrow={1}>{steps[activeStep - 1]}</Box>
                  {/* Hết nội dung */}
                  {!faceSuccess && errorPG && (
                    <Alert severity="error" sx={{ mt: "10px" }}>
                      {errorPG}
                    </Alert>
                  )}
                  {faceSuccess && (
                    <Alert severity="success">{faceSuccess}</Alert>
                  )}
                </Stack>
              )
            )}

            {/* {unavail && <Alert severity="error">{unavail}</Alert>} */}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={activeStep === 2 || activeStep === 3 ? handleBack : onClose}
        >
          {activeStep === 2 || activeStep === 3
            ? t("0-common.back")
            : t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={
            isFetching ||
            // activeStep === 5 ||
            ((activeStep === 2 ||
              activeStep === 7 ||
              activeStep === 8 ||
              activeStep === 9 ||
              activeStep === 10 ||
              activeStep === 11 ||
              activeStep === 13 ||
              activeStep === 14) &&
              isSubmitDisabled)
          }
          //   disabled={isPending || isSubmitDisabled}
          startIcon={
            isFetching ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {errorPG
            ? t("0-common.retry")
            : activeStep === steps.length - 1
            ? t("0-common.submit")
            : t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEid.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  workFlow: PropTypes.object,
  setDataSigning: PropTypes.func,
  handleShowModalSignImage: PropTypes.func,
};

export default ModalEid;

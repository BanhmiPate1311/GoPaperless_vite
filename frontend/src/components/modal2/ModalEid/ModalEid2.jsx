import loading from "@/assets/images/ajax-loader.gif";
import { electronicService } from "@/services/electronic_service";
import { convertEidType } from "@/utils/commonFunction";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useQueryClient } from "@tanstack/react-query";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  // height: 700,
  maxHeight: 648,
  bgcolor: "dialogBackground.main",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  padding: "10px 15px 23px",
  overflowY: "auto",
  fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
};

export const EidModal2 = ({ open, onClose, dataSigning, signatureData }) => {
  console.log("dataSigning: ", dataSigning);
  console.log("signatureData: ", signatureData);

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [errorPG, setErrorPG] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [requestID, setRequestID] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [otp, setOtp] = useState(null);

  const credentialOTP = async () => {
    setIsFetching(true);
    const data = {
      lang: dataSigning.language,
      credentialID: dataSigning.certChain.credentialID,
      connectorName: dataSigning.connectorName,
      enterpriseId: dataSigning.enterpriseId,
      workFlowId: dataSigning.workFlowId,
    };
    try {
      // const response = await api.post("/elec/credentialOTP", data);
      const response = await electronicService.credentialOTP(data);
      setRequestID(response.data);
      setIsFetching(false);
      if (activeStep === 0) {
        handleNext();
      }
    } catch (error) {
      setIsFetching(false);
      console.log("error", error);
    }
  };

  const authorizeOTP = async (otp) => {
    // dispatch(apiControllerManagerActions.clearsetMessageSuccess());
    console.log("authorizeOTP");
    setIsFetching(true);
    setErrorPG(null);
    const data = {
      lang: dataSigning.language,
      credentialID: dataSigning.certChain.credentialID,
      requestID: requestID,
      otp: otp,
      signerId: dataSigning.signerId,
      signingToken: dataSigning.signingToken,
      fileName: dataSigning.fileName,
      signerToken: dataSigning.signerToken,
      connectorName: dataSigning.connectorName,
      signingOption: "electronic_id",
      codeNumber: dataSigning.code,
      type: convertEidType(dataSigning.criteriaAlias), //CITIZEN-IDENTITY-CARD
      certChain: dataSigning.certChain.cert,
      enterpriseId: dataSigning.enterpriseId,
      workFlowId: dataSigning.workFlowId,
      fieldName: signatureData.field_name,
      lastFileId: dataSigning.lastFileId,
      documentId: dataSigning.documentId,
      country: dataSigning.country,
      countryRealtime: dataSigning.countryRealtime,
      signingPurpose: dataSigning.signingPurpose,
      imageBase64: dataSigning.imageBase64,
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
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
      onClose();
      // dispatch(apiControllerManagerActions.setMessageSuccess());
      // handleCloseModal1();
    } catch (error) {
      console.log("error", error);
      setIsFetching(false);
      setErrorPG(error.response.data.message);
    }
  };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => {
    return step === 10;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 0:
        credentialOTP();
        break;
      // case 2:
      //   connectToWS();
      //   break;
      case 1:
        authorizeOTP(otp);
        break;
      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1 key={"step1"} phoneNumber={dataSigning.phoneNumber} />,
    <Step2
      key={"step2"}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      phoneNumber={dataSigning.phoneNumber}
      resendCredentialOTP={credentialOTP}
      handleCloseModal1={onClose}
      setErrorPG={setErrorPG}
      authorizeOTP={authorizeOTP}
      isFetching={isFetching}
    />,
  ];

  return (
    <Box>
      <Modal
        aria-labelledby="transition1-modal-title"
        aria-describedby="transition1-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Grow
          in={open}
          style={{
            width: "499px",
            transform: "translate(-50%, -50%)",
            transformOrigin: "0 0 0",
            // padding: "16px 0px 59px 16px",
            // paddingTop: "16px",
            // paddingLeft: "30px",
            border: "none",
            outline: "none",
          }}
          {...(open ? { timeout: 1000 } : {})}
        >
          <Box sx={style}>
            <Stack
              direction="row"
              // justifyContent="flex-end"
              alignItems="center"
              height={"31px"}
              marginBottom={"10px"}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  display: "inline-block",
                  color: "signingtextBlue.main",
                  borderBottom: "4px solid",
                  borderColor: "signingtextBlue.main",
                  borderRadius: "5px",
                  // paddingBottom: "5px",
                  // marginBottom: "10px",
                  p: 0,
                }}
              >
                {t("electronic.title")}
              </Typography>
            </Stack>
            <Stack sx={{ width: "100%", height: 570 - 20 - 31 }}>
              <Box flexGrow={1} sx={{ mt: 2, mb: 1 }}>
                {steps[activeStep]}
              </Box>
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
                      (activeStep === 1 && isSubmitDisabled)
                    }
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
          </Box>
        </Grow>
      </Modal>
    </Box>
  );
};

EidModal2.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  signatureData: PropTypes.object,
};

export default EidModal2;

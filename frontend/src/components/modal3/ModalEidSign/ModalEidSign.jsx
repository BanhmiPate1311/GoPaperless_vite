import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import { Step1, Step2 } from ".";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { electronicService } from "@/services/electronic_service";
import { convertEidType } from "@/utils/commonFunction";
import CircularProgress from "@mui/material/CircularProgress";

export const ModalEidSign = ({ open, onClose, dataSigning, signatureData }) => {
  console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [skipped, setSkipped] = useState(new Set());
  const [errorPG, setErrorPG] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [requestID, setRequestID] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [otp, setOtp] = useState(null);

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
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

  //   const handleBack = () => {
  //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
  //   };

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
      if (activeStep === 1) {
        // handleNext();
        setActiveStep(2);
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
      assurance: dataSigning.assurance,
      contactInfor: dataSigning.contactInfor,
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

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        credentialOTP();
        break;
      // case 2:
      //   connectToWS();
      //   break;
      case 2:
        authorizeOTP(otp);
        break;
      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1 key={"Step1"} phoneNumber={dataSigning.phoneNumber} />,
    <Step2
      key={"Step2"}
      setOtp={setOtp}
      onDisableSubmit={handleDisableSubmit}
      phoneNumber={dataSigning.phoneNumber}
      resendCredentialOTP={credentialOTP}
      handleCloseModal1={onClose}
      setErrorPG={setErrorPG}
      errorPG={errorPG}
      authorizeOTP={authorizeOTP}
      isFetching={isFetching}
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
          {t("signing.sign_document")}
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
            {/* {steps[activeStep]} */}
            <Box flexGrow={1}>{steps[activeStep - 1]}</Box>
            {/* {unavail && <Alert severity="error">{unavail}</Alert>} */}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isFetching || (activeStep === 2 && isSubmitDisabled)}
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
            : activeStep === 2
            ? t("0-common.submit")
            : t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEidSign.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  signatureData: PropTypes.object,
};

export default ModalEidSign;

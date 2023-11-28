import { apiService } from "@/services/api_service";
import { rsspService } from "@/services/rssp_service";
import {
  convertSignOptionsToProvider,
  getLang,
  getSigner,
} from "@/utils/commonFunction";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  useIsFetching,
  useIsMutating,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Step1, Step2, Step3_smartid, Step4 } from "../Signing";
import { toast } from "react-toastify";

const SigningForm = ({ open, onClose, workFlow, handleShowModalSignImage }) => {
  // console.log("workFlow: ", workFlow);
  // console.log("index: ", index);
  // console.log("open: ", open);

  const descriptionElementRef = useRef(null);

  let lang = getLang();

  // console.log("lang: ", lang);

  const dataApi = useRef({
    documentId: workFlow.documentId,
    workFlowId: workFlow.workFlowId,
    signingToken: workFlow.signingToken,
    signerToken: workFlow.signerToken,
    language: lang,
  });

  const isFetching = useIsFetching();

  const isMutating = useIsMutating();

  const isPending = isFetching + isMutating > 0;

  // console.log("dataApi: ", dataApi.current);

  const [activeStep, setActiveStep] = useState(1);

  const signer = getSigner(workFlow);

  const signingOptions = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.keys(item)[0])
    : ["mobile", "smartid", "usbtoken", "electronic_id"];

  const providerName = convertSignOptionsToProvider(signingOptions);

  const filterConnector = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.values(item)[0].join(","))
    : [];

  const handleNext = (step = 1) => {
    setActiveStep((prevActiveStep) => prevActiveStep + step);
  };

  const { data: prefixList } = useQuery({
    queryKey: ["prefixList"],
    queryFn: () => {
      return apiService.getPrefixList();
    },
  });
  //   console.log("prefixList: ", prefixList?.data);

  const { data: connectorList } = useQuery({
    queryKey: ["getConnectorList"],
    queryFn: () => {
      return apiService.getConnecterProvider(providerName);
    },
  });

  const getCertificates = useMutation({
    mutationFn: (data) => {
      return rsspService.getCertificates(data);
    },
    onSuccess: () => {
      // console.log("data: ", data);
      handleNext(1);
    },
  });

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const elementRef = useRef();
  const elementRef2 = useRef();
  const elementRef3 = useRef();
  const elementRef4 = useRef();

  const filterPrefix = prefixList?.data?.filter(
    (item) => item.type === "PHONE-ID" || item.type === "PERSONAL-ID"
  );

  const handleStep1Submit = (data) => {
    // console.log("data: ", data);
    if (data.method === "eseal") {
      // onClose();
      toast.warn("Functionality is under development!");
    } else {
      handleNext(1);
    }
    // setMethod(data.method);
  };

  const handleStep2Submit = (data) => {
    // console.log("data: ", data);

    dataApi.current = {
      ...dataApi.current,
      signerId: signer.signerId,
      connectorName: data.connector,
      provider: data.provider,
    };
    if (data.connector === "SMART_ID_MOBILE_ID") {
      handleNext(1);
    } else {
      // onClose();
      toast.warn("Functionality is under development!");
    }
    // setMethod(data.method);
  };

  const dialCode = useRef("");

  const handleStep3Submit = (data) => {
    const codeNumber =
      data.criteria +
      ":" +
      (data.personalCode
        ? data.personalCode
        : data.phoneNumber.replace(dialCode.current, "0").trim());
    dataApi.current = {
      ...dataApi.current,
      codeNumber: codeNumber,
    };
    getCertificates.mutate(dataApi.current);
  };

  const handleStep4Submit = (data) => {
    dataApi.current = {
      ...dataApi.current,
      certChain: getCertificates?.data?.data?.listCertificate[data],
    };
    // handleNext(1);
    onClose();
    handleShowModalSignImage();
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        elementRef.current.requestSubmit();
        break;
      case 2:
        elementRef2.current.requestSubmit();
        break;
      case 3:
        elementRef3.current.requestSubmit();
        break;
      case 4:
        elementRef4.current.requestSubmit();
        break;
      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1 key="step1" ref={elementRef} onStep1Submit={handleStep1Submit} />,
    <Step2
      key="step2"
      ref={elementRef2}
      providerName={providerName}
      onStepSubmit={handleStep2Submit}
      connectorList={connectorList}
      filterConnector={filterConnector}
    />,
    <Step3_smartid
      key="step3"
      ref={elementRef3}
      onStepSubmit={handleStep3Submit}
      data={filterPrefix}
      dialCode={dialCode}
      errorApi={getCertificates?.error?.response?.data?.message}
    />,
    <Step4
      key="step4"
      ref={elementRef4}
      data={getCertificates?.data?.data?.listCertificate}
      onStepSubmit={handleStep4Submit}
    />,
  ];

  let { title, subtitle } = useMemo(() => {
    switch (activeStep) {
      case 3:
        return {
          title: "SIGN DOCUMENT",
          subtitle:
            "Signing with Mobile-ID creates a qualified electronic signature which has equivalent legal effect of a handwritten signature.",
        };
      case 4:
        return {
          title: "SELECT CERTIFICATE",
          subtitle:
            "By choosing the certificate, I agree to the transfer of my name and personal identification code to the service provider.",
        };
      default:
        return {
          title: "SIGN DOCUMENT",
          subtitle: "",
        };
    }
  }, [activeStep]);

  return (
    <Dialog
      keepMounted={false}
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "470px", // Set your width here
            borderRadius: "10px",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{ backgroundColor: "dialogBackground.main", paddingBottom: "0px" }}
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
            marginBottom: "10px",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h5" width={"100%"}>
            {subtitle}
          </Typography>
        )}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {/* <Box sx={{ px: "24px" }}>
        <Divider />
      </Box> */}
      <DialogContent sx={{ backgroundColor: "dialogBackground.main" }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Typography component="div" sx={{ mt: 2, mb: 1, height: "80%" }}>
            {/* {steps[activeStep]} */}
            {steps[activeStep - 1]}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleCancelClick}
        >
          cancel
        </Button>
        <Button
          variant="outlined"
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleSubmitClick}
          type="button"
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
SigningForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleShowModalSignImage: PropTypes.func,
  workFlow: PropTypes.object,
};
export default SigningForm;

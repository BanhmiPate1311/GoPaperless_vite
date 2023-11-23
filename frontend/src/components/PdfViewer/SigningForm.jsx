import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Step1, Step2 } from "../Signing";

const SigningForm = ({ open, onClose, index, workFlow }) => {
  console.log("index: ", index);
  console.log("open: ", open);
  const descriptionElementRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  console.log("activeStep: ", activeStep);

  //   const [method, setMethod] = useState("");
  //   console.log("method: ", method);

  const handleNext = (step = 1) => {
    setActiveStep((prevActiveStep) => prevActiveStep + step);
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  //   useEffect(() => {
  //     return () => {
  //       // Reset activeStep when the component is unmounted
  //       setActiveStep(1);
  //     };
  //   }, []);

  const elementRef = useRef();

  const handleStep1Submit = (data) => {
    console.log("data: ", data);
    if (data.method === "eseal") {
      onClose();
    } else {
      handleNext(1);
    }
    // setMethod(data.method);
  };

  const handleCancelClick = () => {
    onClose();
    // setActiveStep(1);
    // setMethod("");
  };

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        elementRef.current.requestSubmit();
        // if (method === "eseal") {
        //   console.log("dzo");
        //   onClose();
        // }
        break;
      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1 key="step1" ref={elementRef} onStep1Submit={handleStep1Submit} />,
    <Step2 key="step2" workFlow={workFlow} />,
  ];

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
            // width: "100%",
            maxWidth: "900px", // Set your width here
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
          }}
        >
          Sign Document
        </Typography>
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
  index: PropTypes.number,
  workFlow: PropTypes.object,
};
export default SigningForm;

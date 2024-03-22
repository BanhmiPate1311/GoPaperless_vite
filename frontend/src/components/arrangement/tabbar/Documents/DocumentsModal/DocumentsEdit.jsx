/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import { Step, Stepper, StepButton, StepContent } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import StepIndicator from "@mui/joy/StepIndicator";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckBox from "@mui/icons-material/CheckBox";
import Check from "@mui/icons-material/Check";

const steps = [
  {
    label: "Qualified Electronic Signature (QES)",
    description: `It has equivalent legal effect of a handwritten signature.`,
  },
  {
    label: "All signature levels (QES, AES, SES)",
    description:
      "For documents without legal form requirement and with low liability risk. Document recipients can choose all levels, as low as simple electronic signature.",
  },
];

// const steps = ["Order placed", "In review", "Approved"];

const DocumentsEdit = ({ open, title, handleClose }) => {
  const { t } = useTranslation();

  const descriptionElementRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const queryClient = useQueryClient();
  const handleSubmitClick = () => {
    participant.map((value) => {
      updateParticipant(value);
    });
    handleClose();
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const [activeStep, setActiveStep] = useState(1);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //   const handleReset = () => {
  //     setActiveStep(0);
  //   };

  // const [value, setValue] = useState(dayjs("2022-04-17T15:30"));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      // sx={{
      //   "& .MuiDialog-container": {
      //     "> .MuiPaper-root": {
      //       width: "100%",
      //       height: "650px",
      //       maxWidth: "950px", // Set your width here
      //       borderRadius: "10px",
      //     },
      //   },
      // }}
      PaperProps={{
        sx: {
          width: "531px",
          maxWidth: "531px", // Set your width here
          //   height: "243px",
          height: "290px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        component="div"
        id="scroll-dialog-title"
        sx={{
          backgroundColor: "dialogBackground.main",
          paddingBottom: "0px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
            display: "inline-block",
            color: "#1F2937",
            borderColor: "signingtextBlue.main",
            borderRadius: "5px",
            paddingBottom: "5px",
            height: "31px",
            // textTransform: "uppercase",
            // borderBottom: "4px solid",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "dialogBackground.main" }}>
        <Box sx={{ maxWidth: 400 }}>
          <Stepper orientation="vertical">
            {steps.map((step, index) => (
              <Step
                key={step}
                indicator={
                  <StepIndicator
                    variant={activeStep <= index ? "soft" : "solid"}
                    color={activeStep < index ? "neutral" : "primary"}
                  >
                    {activeStep <= index ? index + 1 : <Check />}
                  </StepIndicator>
                }
                sx={{
                  "&::after": {
                    ...(activeStep > index &&
                      index !== 2 && { bgcolor: "primary.solidBg" }),
                  },
                }}
              >
                <StepButton onClick={() => setActiveStep(index)}>
                  {/* <StepContent> */}
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#1F2937",
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#6B7280",
                    }}
                  >
                    {step.description}
                  </Typography>
                  {/* </StepContent> */}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          {/* 
          <Stepper orientation="vertical" sx={{ width: 200 }}>
            <Step>Order placed</Step>
            <Step>In review</Step>
            <Step>Approved</Step>
          </Stepper> */}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleClose}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DocumentsEdit.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  //   data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default DocumentsEdit;

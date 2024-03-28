/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import { Step, Stepper } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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

// const steps = [
//   "Select campaign settings",
//   "Create an ad group",
//   "Create an ad",
// ];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#357EEB",
      margin: "-27px 0px -10px",
      height: "53px",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#357EEB",
      margin: "-27px 0px -10px",
      height: "53px",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#357EEB",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#357EEB",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className, handleActive, index } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        // <Check className="QontoStepIcon-completedIcon" />
        <Checkbox
          sx={{ padding: "0px" }}
          defaultChecked
          onClick={() => (index === 0 ? null : handleActive(index))}
        />
      ) : (
        // <div className="QontoStepIcon-circle" />
        <Checkbox
          sx={{ padding: "0px" }}
          onClick={() => (index === 0 ? null : handleActive(index))}
        />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

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

  const handleActive = (index) => {
    console.log(index);
    if (index === 0) return;
    setActiveStep(activeStep === 1 ? 0 : 1);
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
          <Stepper
            orientation="vertical"
            // alternativeLabel
            activeStep={activeStep}
            connector={<QontoConnector />}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={QontoStepIcon}
                  sx={{ alignItems: "start" }}
                >
                  <Typography
                    sx={{
                      color: "#1F2937",
                      fontFamily: "Montserrat",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {label.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#6B7280",
                      fontFamily: "Montserrat",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {label.description}
                  </Typography>
                </StepLabel>
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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Step1 } from ".";

export const AssuranceModal = ({ open, onClose, dataSigning }) => {
  console.log("dataSigning: ", dataSigning);
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(1);
  const [assurance, setAssurance] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [listCert, setListCert] = useState([]);
  console.log("listCert: ", listCert);

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  let { title } = useMemo(() => {
    switch (activeStep) {
      case 1:
        return {
          title: t("signing.sign_document"),
          subtitle: t("signingForm.title4"),
        };
      case 3:
        return {
          title: t("signing.sign_document"),
          subtitle: t("signingForm.title1"),
        };
      case 4:
      case 5:
        return {
          title: t("modal.title1"),
          subtitle: t("signingForm.title2"),
        };
      case 6:
        return {
          title: t("signing.sign_document"),
          subtitle: t("signingForm.title3"),
        };
      default:
        return {
          title: t("signing.sign_document"),
          subtitle: "",
        };
    }
  }, [activeStep]);

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        console.log("assurance: ", assurance);
        if (assurance === "aes") {
          setListCert(
            dataSigning.listCertificate.filter((item) => item.seal === false)
          );
        } else {
          setListCert(
            dataSigning.listCertificate.filter((item) => item.seal === true)
          );
        }
        break;
    }
  };

  const steps = [
    <Step1
      key="step1"
      assurance={assurance}
      setAssurance={setAssurance}
      onDisableSubmit={handleDisableSubmit}
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
          {title}
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
          disabled={isSubmitDisabled}
          //   startIcon={
          //     isPending ? <CircularProgress color="inherit" size="1em" /> : null
          //   }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AssuranceModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
};

export default AssuranceModal;

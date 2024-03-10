import { apiService } from "@/services/api_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Step1, Step2 } from ".";
import CircularProgress from "@mui/material/CircularProgress";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const ApproveModal = ({ open, onClose, workFlow }) => {
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [comment, setComment] = useState("");
  // console.log("comment: ", comment);

  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);

  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        setActiveStep(2);
        break;
      case 2:
        approve();
        break;
    }
  };

  useEffect(() => {
    return () => {
      // console.log("thót");
      setComment("");
    };
  }, [activeStep]);

  const approve = async () => {
    setIsPending(true);
    const data = {
      workFlowId: workFlow.workFlowId,
      participantID: signer.id,
      comment: comment,
      recipientID: null,
      signerName: signer.lastName + " " + signer.firstName,
      signerEmail: signer.email,
      fileName: workFlow.fileName,
      signerToken: workFlow.signerToken,
      signingToken: workFlow.signingToken,
      workFlowProcessType: workFlow.workflowProcessType,
      documentId: workFlow.documentId,
      signerType: signer.signerType,
    };
    try {
      await apiService.approve(data);
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
      setIsPending(false);
      onClose();
    } catch (error) {
      setIsPending(false);
      console.log("error: ", error);
    }
  };

  const steps = [
    <Step1 key={"step1"} />,
    <Step2 key={"step2"} setComment={setComment} />,
  ];

  useEffect(() => {
    setActiveStep(1);
  }, [open]);

  let title = useMemo(() => {
    switch (activeStep) {
      case 1:
        return t("modal.legal_notice");
      case 2:
        return t("modal.approve_documents");
    }
  }, [activeStep]);

  return (
    <Dialog
      // keepMounted={false}
      // TransitionComponent={Transition}
      open={!!open}
      onClose={onClose}
      TransitionComponent={Transition}
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
          {/* title */}
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
            <Box className="choyoyoy1" flexGrow={1}>
              {steps[activeStep - 1]}
            </Box>
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
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
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

ApproveModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  workFlow: PropTypes.object,
};

export default ApproveModal;

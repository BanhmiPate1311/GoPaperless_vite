/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ParticipantsTable from "./ParticipantsTable";
import { participantsService } from "@/services/participants_service";
import { useQueryClient } from "@tanstack/react-query";

export const ParticipantsModal = ({
  open,
  data,
  title,
  handleClose,
  workFlow,
}) => {
  const descriptionElementRef = useRef(null);
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
  const [participant, setParticipant] = useState([]);

  const updateParticipant = async (data) => {
    // const data = {
    //   fullName,
    //   firstName,
    //   lastName,
    //   customReason,
    //   position,
    //   signingPurpose,
    //   structuralSubdivision,
    //   metaInformation,
    //   signerToken: row.signerToken,
    // };

    try {
      const response = await participantsService.updateParticipant(data);
      // setProcess(response.data);
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
    } catch (error) {
      console.error("Lỗi khi gọi API updateParticipant:", error);
      alert("UPDATE PARTICIPANTS ERROR");
      // Xử lý lỗi tại đây nếu cần
    }
    handleClose();
  };
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
          width: "950px",
          maxWidth: "950px", // Set your width here
          height: "650px",
          borderRadius: "10px",
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
            height: "31px",
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "dialogBackground.main" }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <ParticipantsTable
            workFlow={workFlow}
            data={data}
            handleClose={handleClose}
            setParticipant={setParticipant}
            updateParticipant={updateParticipant}
            participant={participant}
          />
        </DialogContentText>
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

ParticipantsModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default ParticipantsModal;

import { rsspService } from "@/services/rssp_service";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

export const ModalSmartid = ({ open, onClose, dataSigning }) => {
  //   console.log("dataSigning: ", dataSigning);

  const { data: sign } = useQuery({
    queryKey: ["signFile"],
    queryFn: () => {
      return rsspService.signFile(dataSigning);
    },
  });
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
          {/* {title} */}
          Sign Document
        </Typography>
        {/* {subtitle && (
      <Typography variant="h5" width={"100%"}>
        {subtitle}
      </Typography>
    )} */}
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
          //   ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Typography variant="body2" color="text.secondary">
            Your verification code is:
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="outlined"
          //   disabled={isPending}
          //   startIcon={
          //     isPending ? <CircularProgress color="inherit" size="1em" /> : null
          //   }
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          //   onClick={handleSubmitClick}
          type="button"
        >
          Sign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalSmartid.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
};

export default ModalSmartid;

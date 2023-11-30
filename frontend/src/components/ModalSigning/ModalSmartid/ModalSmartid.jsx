import { rsspService } from "@/services/rssp_service";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const mathRound = (number) => {
  const totalTime = 300;
  return Math.floor((number / 100) * totalTime); // Số phút là phần nguyên khi chia cho 60
};

function CircularProgressWithLabel(props) {
  const formatTime = (seconds) => {
    const totalTime = 300;
    const minutes = Math.floor(((seconds / 100) * totalTime) / 60); // Số phút là phần nguyên khi chia cho 60
    const remainingSeconds = Math.floor(((seconds / 100) * totalTime) % 60); // Số giây còn lại là phần dư khi chia cho 60

    // Chuyển định dạng sang mm:ss
    const formattedTime = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  };

  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
  };
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontSize: "1.75rem" }}
          component="div"
          color="text.secondary"
        >
          {/* {`${Math.round(props.value)}%`} */}
          {formatTime(props.value)}
        </Typography>
      </Box>
    </Box>
  );
}

export const ModalSmartid = ({ open, onClose, dataSigning }) => {
  //   console.log("dataSigning: ", dataSigning);

  const queryClient = useQueryClient();
  const timer = useRef(null);

  const sign = useQuery({
    queryKey: ["signFile"],
    queryFn: async ({ signal }) => {
      try {
        const response = await rsspService.signFile(dataSigning, { signal });
        window.parent.postMessage(
          { data: response.data, status: "Success" },
          "*"
        );
        queryClient.invalidateQueries({ queryKey: ["getField"] });
        queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
        queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        onClose();
        return true;
      } catch (error) {
        console.log("error1: ", error);
        clearInterval(timer.current);
        throw new Error(error.response?.data?.message || "An error occurred");
      }
    },
    retry: 0,
  });

  const handelCancel = (e) => {
    e.preventDefault();
    queryClient.cancelQueries({ queryKey: ["signFile"] });
    clearInterval(timer.current);
    onClose();
  };

  console.log("error: ", sign?.error?.message);

  const { data: getVc } = useQuery({
    queryKey: ["getVc"],
    queryFn: () => {
      return rsspService.getVc(dataSigning);
    },
  });

  // console.log("getVc: ", getVc?.data);

  const [progress, setProgress] = useState(100);
  // console.log("progress: ", progress);

  useEffect(() => {
    if (progress > 0.5) {
      timer.current = setInterval(() => {
        setProgress((prevProgress) => prevProgress - 1 / 3);
      }, 1000);

      return () => {
        clearInterval(timer.current);
      };
    }
    if (progress <= 0.5) {
      setProgress(0);
      // handleCloseModal1();
    }
  }, [progress]);
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
      <DialogContent sx={{ backgroundColor: "dialogBackground.main", py: 0 }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          //   ref={descriptionElementRef}
          tabIndex={-1}
          sx={{
            color: "signingtext1.main",
            fontWeight: "bold",
            // mb: 5,
          }}
        >
          <Typography variant="body2">Your verification code is:</Typography>
          <Box p={3} textAlign={"center"}>
            <Typography fontSize={"40px"} fontWeight={"bold"}>
              {getVc?.data}
              {/* 1983-1991 */}
            </Typography>
            <Typography>
              Your verification code will expire in{" "}
              <span style={{ fontWeight: "bold" }}>{mathRound(progress)}s</span>
            </Typography>
          </Box>
          {/* <Box sx={{ flexGrow: 1, mb: 2 }}>
            <BorderLinearProgress variant="determinate" value={progress} />
          </Box> */}
          <Typography variant="body2">
            If the code above matches the one you see on your device screen,
            please enter your Smart-ID PIN2.
          </Typography>
          <Box textAlign="center" marginTop="50px">
            <CircularProgressWithLabel size={100} value={progress} />
          </Box>
          <Typography fontSize="14px" textAlign="center" my="30px">
            {/* Verification process might take up to 5 minitues. */}
            Verification process might take up to 5 minitues.
          </Typography>
          <Stack width={"100%"} mb={2}>
            {sign?.error && (
              <Alert severity="error">{sign?.error?.message}</Alert>
            )}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handelCancel}
        >
          Cancel
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

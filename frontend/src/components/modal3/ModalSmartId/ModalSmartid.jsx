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
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSmartIdSign } from "@/hook";
import { rsspService } from "@/services/rssp_service";

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
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const [vcode, setVc] = useState(null);
  const [progress, setProgress] = useState(100);

  // click on cancel
  const [signFileController, setSignFileController] = useState(
    new AbortController()
  );
  const timer = useRef(null);
  // const [getVCController, setGetVCController] = useState(new AbortController());

  const smartSign = useSmartIdSign({ signal: signFileController.signal });

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

  useEffect(() => {
    smartSign.mutate(dataSigning, {
      onSuccess: (data) => {
        window.parent.postMessage({ data: data.data, status: "Success" }, "*");
        queryClient.invalidateQueries({ queryKey: ["getField"] });
        queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
        queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        onClose();
        return true;
      },
      onError: (err) => {
        console.log("err: ", err);
        setProgress(0);
        clearInterval(timer.current);
      },
    });
    getVCEnabled();
  }, []);

  const getVCEnabled = async () => {
    const response = await rsspService.getVc({
      requestID: dataSigning.requestID,
    });
    console.log("response: ", response.data);
    setVc(response.data);
    // setVCEnabled(false);
  };

  const handleCancelSign = () => {
    signFileController.abort();
    // getVCController.abort();
    setSignFileController(new AbortController());
    // setGetVCController(new AbortController());
    clearInterval(timer.current);
    onClose();
  };

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
          {/* {title} */}
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
            <Typography variant="h6">{t("modal.smartid1")}</Typography>
            <Box p="25px" textAlign={"center"} mb={"10px"}>
              <Typography fontSize={"48px"} height={"59px"} fontWeight={"bold"}>
                {vcode ? vcode : <CircularProgress />}
              </Typography>
              {/* <Typography>
              {t("modal.smartid2")}{" "}
              <span style={{ fontWeight: "bold" }}>
                {mathRound(progress)} {t("modal.smartid3")}
              </span>
            </Typography> */}
            </Box>
            {/* <Box sx={{ flexGrow: 1, mb: 2 }}>
            <BorderLinearProgress variant="determinate" value={progress} />
          </Box> */}
            <Typography variant="h6" mb={"10px"}>
              {t("modal.smartid4")}
            </Typography>
            <Box textAlign="center" my="10px" flexGrow={1}>
              <CircularProgressWithLabel size={150} value={progress} />
            </Box>

            <Stack width={"100%"}>
              {smartSign?.error && (
                <Alert severity="error">
                  {smartSign?.error?.response?.data.message}
                </Alert>
              )}
            </Stack>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleCancelSign}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={smartSign.isPending}
          startIcon={
            smartSign.isPending ? (
              <CircularProgress color="inherit" size="1em" />
            ) : null
          }
          sx={{
            borderRadius: "10px",
            borderColor: "borderColor.main",
            marginLeft: "20px !important",
          }}
          onClick={() => {
            setProgress(100);
            setVc(null);
            // queryClient.invalidateQueries({ queryKey: ["getVc"] });
            smartSign.mutate(dataSigning, {
              onSuccess: (data) => {
                window.parent.postMessage(
                  { data: data.data, status: "Success" },
                  "*"
                );
                queryClient.invalidateQueries({ queryKey: ["getField"] });
                queryClient.invalidateQueries({
                  queryKey: ["verifySignatures"],
                });
                queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
                onClose();
                return true;
              },
              onError: () => {
                setProgress(0);
                clearInterval(timer.current);
              },
            });
            getVCEnabled();
          }}
          type="button"
        >
          {t("0-common.retry")}
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

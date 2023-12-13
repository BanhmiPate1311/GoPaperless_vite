/* eslint-disable no-unused-vars */
import { ReactComponent as CardIcon } from "@/assets/images/svg/card.svg";
import ISPluginClient from "@/assets/js/checkid";
import { PasswordField } from "@/components/form";
import { usePending, useUsbHash, useUsbPackFile } from "@/hook";
import {
  convertTime,
  getLang,
  getUrlWithoutProtocol,
} from "@/utils/commonFunction";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ModalUsb = ({ open, onClose, dataSigning, setDataSigning }) => {
  // console.log("dataSigning: ", dataSigning);

  const isPending = usePending();

  const schema = yup.object().shape({
    // pin: yup.string().min(dataSigning.tokenDetails.minPinLength, "Pin too short").required("Please input your pin"),
    pin: yup
      .string()
      .test(
        "pin",
        `Must be from ${dataSigning?.tokenDetails?.minPinLength} to ${dataSigning?.tokenDetails?.maxPinLength} characters `,
        (val) =>
          val.length >= dataSigning?.tokenDetails?.minPinLength &&
          val.length <= dataSigning?.tokenDetails?.maxPinLength
      )
      .required("Please input your pin"),
  });

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      pin: "",
    },
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const usbHash = useUsbHash(dataSigning);
  // console.log("usbHash: ", usbHash.data);
  const queryClient = useQueryClient();

  const packFile = useUsbPackFile(dataSigning);
  // console.log("packFile: ", packFile);

  const getCertificate = useMutation({
    mutationFn: async (data) => {
      // console.log("data: ", data);
      try {
        const response = await connectWS(data);
        // console.log("response: ", response);
        return response;
      } catch (error) {
        // console.log("error: ", error);
        throw new Error(error);
      }
    },

    onSuccess: (data) => {
      // console.log("data: ", data);
      // setDataSigning({
      //   ...dataSigning,
      //   signatures: data.signatures,
      // });
      const request = {
        ...dataSigning,
        signatures: data.signatures,
      };
      packFile.mutate(request, {
        onSuccess: (data) => {
          window.parent.postMessage(
            { data: data.data, status: "Success" },
            "*"
          );
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
          onClose();
          return data;
        },
      });
      return data;
    },
  });
  // console.log("getCertificate: ", getCertificate);
  const formRef = useRef();
  const sdk = useRef(null);
  let lang = getLang();
  const [errorApi, setErrorApi] = useState(null);
  const urlWithoutProtocol = getUrlWithoutProtocol();
  // const urlWithoutProtocol = "localhost:3000";

  useEffect(() => {
    if (
      watch("pin").length >= dataSigning?.tokenDetails?.minPinLength &&
      watch("pin").length <= dataSigning?.tokenDetails?.maxPinLength
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
    // if (provider === "USB_TOKEN_SIGNING" && errorPG) {
    //   onDisableSubmit(true);
    // }
  }, [watch("pin"), setIsSubmitDisabled, watch]);

  function disconnectWSHTML() {
    sdk.current.shutdown();
  }

  const connectWS = (data) => {
    // console.log("data: ", data);
    return new Promise(function (resolve, reject) {
      const ipWS = "127.0.0.1";
      const portWS = "9505";
      const typeOfWS = "wss";
      sdk.current = new ISPluginClient(
        ipWS,
        portWS,
        typeOfWS,
        function () {
          // console.log("connected");
          //            socket onopen => connected
          getSignature(data, resolve, reject);
          // flagFailedConnectHTML = 1;
        },
        function () {
          //            socket disconnected
          // console.log("Connect error");
        },
        function () {
          //            socket stopped
        },
        function () {
          // console.log("connected denied");
          // console.log("statusCallBack: ", statusCallBack);
          disconnectWSHTML();
        },
        function (cmd, id, error, data) {
          console.log("id: ", id);
          //RECEIVE
          console.log("cmd: ", cmd);
          console.log("error: ", error);
          console.log("data: ", data);
        }
      );
    });
  };

  const getSignature = (data, resolve, reject) => {
    // console.log("dataSigning: ", dataSigning);
    const certId = dataSigning.certChain.id;
    const pin = data.pin;
    const temp = {
      dtbsHash: data.dtbsHash,
      algorithm: "SHA256",
    };
    const signObjects = [];
    signObjects.push(temp);
    const timeOutInterval = 60;
    sdk.current.signTokenCertificate(
      certId,
      pin,
      signObjects,
      urlWithoutProtocol,
      timeOutInterval,
      lang,
      function (response) {
        // console.log("response: ", response);
        resolve(response);
        disconnectWSHTML();
      },
      function (error, mess) {
        console.log("error: ", error);
        console.log("mess: ", mess);
        reject(mess);
        // setErrorGetCert(mess);
        disconnectWSHTML();
      },
      function () {
        // console.log("timeout");
        sdk.current = null;
      }
    );
  };

  const handelCancel = () => {
    onClose();
    disconnectWSHTML();
  };

  const handleSubmitClick = () => {
    // if (formRef.current) {
    //   formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
    // }
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data1) => {
    // console.log("data: ", data1);
    usbHash.mutateAsync(dataSigning, {
      onSuccess: (data) => {
        // console.log("data: ", data);
        setDataSigning({
          ...dataSigning,
          pin: data1.pin,
          dtbsHash: data.hashPG,
          hashList: data.hash,
        });
        const request = {
          dtbsHash: data.hashPG,
          pin: data1.pin,
        };
        getCertificate.mutateAsync(request);
      },
    });
  };

  useEffect(() => {
    const error1 = getCertificate?.error?.message || packFile?.error?.message;
    setErrorApi(error1);
  }, [getCertificate?.error, packFile?.error]);

  return (
    <Dialog
      keepMounted={false}
      TransitionComponent={Transition}
      open={!!open}
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
          {t("signing.sign_document")}
        </Typography>
        <Typography variant="h5" width={"100%"}>
          {t("modal.usb1")}
        </Typography>
      </DialogTitle>
      {/* <IconButton
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
      </IconButton> */}
      {/* <Box sx={{ px: "24px" }}>
    <Divider />
  </Box> */}
      <DialogContent sx={{ backgroundColor: "dialogBackground.main", py: 0 }}>
        <DialogContentText
          component="div"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            color: "signingtext1.main",
            fontWeight: "bold",
            // mb: 5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              width: "100%",
              border: "1px solid",
              borderColor: "borderColorBlue.main",
              borderRadius: "10px",
              my: 2,
              px: 2,
              py: 1,
            }}
          >
            <Box width={50} height={50} mx={1}>
              <CardIcon />
            </Box>

            <Box flexGrow={1} textAlign="left">
              <Typography fontWeight="bold" fontSize="14px">
                {dataSigning?.certChain?.subject?.commonName}
              </Typography>
              <Typography fontSize="14px">
                {t("0-common.issuer")}:{" "}
                {dataSigning?.certChain?.issuer?.commonName}
              </Typography>
              <Typography fontSize="14px">
                {t("0-common.valid")}:{" "}
                {convertTime(dataSigning?.certChain?.validFrom).split(" ")[0]}{" "}
                {t("0-common.to")}{" "}
                {convertTime(dataSigning?.certChain?.validTo).split(" ")[0]}
              </Typography>
            </Box>
          </Stack>
          <Typography
            variant="body2"
            mb={2}
            textAlign={"center"}
            color={"signingtextBlue.main"}
          >
            {/* Enter <span style={{ fontWeight: "bold" }}>PIN</span> for signing */}
            {t("modal.usb2")}
          </Typography>
          <Box
            width={"100%"}
            component="form"
            autoComplete="off"
            ref={formRef}
            onSubmit={handleSubmit(handleFormSubmit)}
            my={2}
          >
            <PasswordField
              name="pin"
              control={control}
              //   sx={{ height: "28px" }}
              inputProps={{
                sx: {
                  textAlign: "center",
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  handleSubmit(handleFormSubmit)();
                }
              }}
            />
          </Box>
          <Stack width={"100%"} mb={2}>
            {errorApi && <Alert severity="error">{errorApi}</Alert>}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handelCancel}
        >
          {t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || isSubmitDisabled}
          startIcon={
            isPending ? <CircularProgress color="inherit" size="1em" /> : null
          }
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={handleSubmitClick}
          type="button"
        >
          {t("0-common.sign")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalUsb.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
};

export default ModalUsb;

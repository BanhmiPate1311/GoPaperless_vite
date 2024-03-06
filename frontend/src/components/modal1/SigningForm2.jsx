/* eslint-disable no-unused-vars */
import { ReactComponent as EidIcon } from "@/assets/images/svg/e-id.svg";
import { ReactComponent as MobileIdIcon } from "@/assets/images/svg/mobile-id.svg";
import { ReactComponent as SmartIdIcon } from "@/assets/images/svg/smart-id.svg";
import { ReactComponent as UsbIcon } from "@/assets/images/svg/usb-token.svg";
import ISPluginClient from "@/assets/js/checkid";
import {
  useConnectorList,
  usePending,
  usePreFixList,
  useSmartIdCertificate,
} from "@/hook";
import {
  checkEseal,
  convertProviderToSignOption,
  convertSignOptionsToProvider,
  convertTypeEid,
  getLang,
  getSigner,
  getUrlWithoutProtocol,
} from "@/utils/commonFunction";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import {
  Step1,
  Step2_smartid,
  Step3_eid,
  Step4,
  Step5_smart,
  Step6_usb,
} from ".";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SigningForm2 = ({
  open,
  onClose,
  workFlow,
  handleShowModalSignImage,
  handleShowEidModal,
  setDataSigning,
  signatureData,
}) => {
  const { t } = useTranslation();

  const descriptionElementRef = useRef(null);

  let lang = getLang();

  const isPending = usePending();

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [assurance, setAssurance] = useState("");
  const [provider, setProvider] = useState("");
  // console.log("provider: ", provider);
  const [connectorName, setConnectorName] = useState("");
  const sdk = useRef(null);
  const urlWithoutProtocol = getUrlWithoutProtocol();
  const [errorPG, setErrorPG] = useState(null);
  const [errorApi, setErrorApi] = useState(null);
  const [unavail, setUnavail] = useState(null);
  const [criteria, setCriteria] = useState("PHONE");
  const [criteriaEid, setCriteriaEid] = useState("CITIZEN-IDENTITY-CARD");
  const [code, setCode] = useState("");
  const [newListCert, setNewListCert] = useState([]);
  const [certSelected, setCertSelected] = useState(0);

  const [activeStep, setActiveStep] = useState(1);
  // console.log("activeStep: ", activeStep);

  const signer = getSigner(workFlow);

  const signingOptions = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.keys(item)[0])
    : ["mobile", "smartid", "usbtoken", "electronic_id"];

  const providerName = convertSignOptionsToProvider(signingOptions);
  const mapProvider = useMemo(() => {
    return signingOptions
      .map((option) => {
        switch (option) {
          case "mobile":
            return {
              label: "Mobile-ID",
              icon: <MobileIdIcon />,
              value: "MOBILE_ID_SIGNING",
            };
          case "smartid":
            return {
              label: "Smart-ID",
              icon: <SmartIdIcon />,
              value: "SMART_ID_SIGNING",
            };
          case "usbtoken":
            return {
              label: "USB-Token",
              icon: <UsbIcon />,
              value: "USB_TOKEN_SIGNING",
            };
          case "electronic_id":
            return {
              label: "Electronic video based Identification",
              icon: <EidIcon />,
              value: "ELECTRONIC_ID",
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  }, [providerName]);

  const filterConnector = signer.signingOptions
    ? signer.signingOptions.map((item) => Object.values(item)[0].join(","))
    : [];

  const dataApi = useRef({
    fileName: workFlow.fileName,
    documentId: workFlow.documentId,
    workFlowId: workFlow.workFlowId,
    signingToken: workFlow.signingToken,
    signerToken: workFlow.signerToken,
    enterpriseId: workFlow.enterpriseId,
    signerId: signer.signerId,
    language: lang,
    fieldName: signatureData.field_name,
    lastFileUuid: workFlow.lastFileUuid,
    email: signer?.email,
  });

  const certificateInfor = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await connectWS(data);
        return response;
      } catch (error) {
        console.log("error: ", error);
        setErrorApi(error);
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    const ipWS = "127.0.0.1";
    const portWS = "9505";
    const typeOfWS = "wss";

    var url = typeOfWS + "://" + ipWS + ":" + portWS + "/ISPlugin";

    const socket = new WebSocket(url);

    // Xử lý sự kiện khi kết nối mở thành công
    socket.addEventListener("open", () => {
      // console.log("Kết nối WebSocket đã thành công");
      socket.close();
      // onBlur(true);
    });

    // Xử lý sự kiện khi xảy ra lỗi trong quá trình kết nối
    socket.addEventListener("error", () => {
      // console.error("Lỗi kết nối WebSocket:", error);
    });

    // Xử lý sự kiện khi kết nối bị đóng
    socket.addEventListener("close", (event) => {
      // console.log("Kết nối WebSocket đã bị đóng");
      // console.log("Mã đóng:", event.code);
      if (event.code === 1006) {
        setErrorPG(t("modal.checkidwarning"));
      }
      // console.log("Lí do:", event.reason);
    });

    // Kiểm tra trạng thái kết nối hiện tại
    // console.log("Trạng thái kết nối:", socket.readyState);
  }, []);

  const connectWS = (dllUsb) => {
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
          getCertificate(dllUsb, resolve, reject);
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
        function () {
          // console.log("id: ", id);
          //RECEIVE
          // console.log("cmd: ", cmd);
          // console.log("error: ", error);
          // console.log("data: ", data);
        }
      );
    });
  };

  function disconnectWSHTML() {
    sdk.current.shutdown();
  }

  const getCertificate = (dllUsb, resolve, reject) => {
    // console.log("sdk.current: ", sdk.current);
    sdk.current.getTokenCertificate(
      60,
      JSON.parse(dllUsb),
      urlWithoutProtocol,
      lang,
      function (response) {
        // console.log("response: ", response);
        resolve(response);
        disconnectWSHTML();
      },
      function (error, mess) {
        // console.log("error: ", error);
        // console.log("mess: ", mess);
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

  const handleBack = () => {
    switch (activeStep) {
      case 2:
        setProvider("");
        setConnectorName("");
        setCriteria("PHONE");
        setCode("");
        setActiveStep(1);
        break;
      case 3:
        setProvider("");
        setConnectorName("");
        setCriteria("PHONE");
        setCode("");
        setActiveStep(1);
        break;
      case 4:
        switch (provider) {
          case "SMART_ID_SIGNING":
            setCriteria("PHONE");
            setCode("84");
            setActiveStep(2);
            break;
          case "USB_TOKEN_SIGNING":
            setProvider("");
            setConnectorName("");
            setActiveStep(1);
            break;
        }
        break;
      case 5:
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        break;
      case 6:
        setActiveStep(4);
        break;
    }
  };

  const handleNext = (step = 1) => {
    setActiveStep((prevActiveStep) => prevActiveStep + step);
  };

  const prefixList = usePreFixList(lang);
  // console.log("prefixList: ", prefixList);

  const connectorList = useConnectorList(providerName);
  // console.log("connectorList: ", connectorList.data);

  const smartIdCertificate = useSmartIdCertificate();

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setUnavail(null);
  }, [assurance, criteria, provider, connectorName]);

  useEffect(() => {
    setErrorApi(null);
  }, [activeStep]);

  const filterPrefix = prefixList?.data?.filter(
    (item) =>
      item.type === "PHONE-ID" ||
      item.type === "PERSONAL-ID" ||
      item.name === "TAX-CODE"
  );
  const filterPrefixEid = prefixList?.data?.filter(
    (item) => item.type === "PERSONAL-ID"
  );

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const dialCode = useRef("");

  const handleCancelClick = () => {
    onClose();
  };
  let dllUsb = "";
  let codeNumber = "";
  // const requestID = uuidv4();
  const handleSubmitClick = () => {
    switch (activeStep) {
      case 1:
        //choose provider
        dataApi.current = {
          ...dataApi.current,
          signerId: signer.signerId,
          signingOption: convertProviderToSignOption(provider),
          lastFileId: workFlow.lastFileId,
          provider: provider,
          connectorName: connectorName,
        };
        switch (provider) {
          case "SMART_ID_SIGNING":
            if (
              connectorName === "SMART_ID_MOBILE_ID" ||
              connectorName === "SMART_ID_LCA"
            ) {
              // handleNext(1);
              setActiveStep(2);
            } else {
              // toast.warn("Functionality is under development!");
              setUnavail(t("signingForm.title6"));
            }
            break;
          case "USB_TOKEN_SIGNING":
            dllUsb = connectorList.data.USB_TOKEN_SIGNING.filter(
              (item) => item.connectorName === connectorName
            )[0].identifier;
            console.log("dllUsb: ", dllUsb);
            certificateInfor.mutate(dllUsb, {
              onSuccess: (data) => {
                dataApi.current = {
                  ...dataApi.current,
                  ...data,
                };
                setActiveStep(4);
                // onStepSubmit({ ...data1, ...data });
              },
            });

            break;
          case "ELECTRONIC_ID":
            // console.log("connectorName: ", connectorName);
            if (connectorName === "Vietnam") {
              setActiveStep(3);
            } else {
              // onClose();
              // toast.warn("Functionality is under development!");
              setUnavail(t("signingForm.title6"));
            }
            break;
          default:
            setUnavail(t("signingForm.title6"));
            break;
        }

        break;
      case 2:
        // smart id
        if (criteria === "PHONE") {
          let phoneWithoutDialCode = code.slice(dialCode.current.length);
          if (phoneWithoutDialCode.match(/^0+/)) {
            // Remove all leading '0's, leaving at least one '0'
            phoneWithoutDialCode = phoneWithoutDialCode.replace(/^0+/, "");
            setCode(dialCode.current + phoneWithoutDialCode);
            break;
          }

          codeNumber =
            criteria + ":" + (dialCode.current + phoneWithoutDialCode);
        } else {
          codeNumber = criteria + ":" + code;
        }
        dataApi.current = {
          ...dataApi.current,
          codeNumber: codeNumber,
        };
        smartIdCertificate.mutate(dataApi.current, {
          onSuccess: (data) => {
            // console.log("data: ", data);

            // handleNext(2);
            setActiveStep(4);
            // onClose();
            // handleShowModal2();
          },
          onError: (error) => {
            console.log("error: ", error);
            setErrorApi(error.response.data.message);
          },
        });
        break;
      case 3:
        codeNumber = criteriaEid + ":" + code;
        dataApi.current = {
          ...dataApi.current,
          codeNumber: codeNumber,
          code: code,
          criteriaAlias: convertTypeEid(criteriaEid),
        };
        setDataSigning(dataApi.current);

        onClose();
        handleShowEidModal();
        break;
      case 4:
        dataApi.current = {
          ...dataApi.current,
          assurance: assurance,
        };
        switch (provider) {
          case "SMART_ID_SIGNING":
            if (assurance === "eseal") {
              setNewListCert(
                smartIdCertificate.data.listCertificate.filter(
                  (item) => item.seal === true
                )
              );
            } else {
              setNewListCert(
                smartIdCertificate.data.listCertificate.filter(
                  (item) => item.seal === false
                )
              );
            }
            // handleNext(1);
            setActiveStep(5);
            break;
          case "USB_TOKEN_SIGNING":
            if (assurance === "eseal") {
              setNewListCert(
                certificateInfor.data.signingCertificates.filter((item) => {
                  const validToDate = new Date(item.validTo);
                  const currentDateTime = new Date();
                  return (
                    checkEseal(item) === true && validToDate > currentDateTime
                  );
                })
              );
            } else {
              setNewListCert(
                certificateInfor.data.signingCertificates.filter((item) => {
                  const validToDate = new Date(item.validTo);
                  const currentDateTime = new Date();
                  return (
                    checkEseal(item) === false && validToDate > currentDateTime
                  );
                })
              );
            }
            // handleNext(2);
            setActiveStep(6);
            break;
        }
        break;
      case 5:
        // smart id get certchain
        dataApi.current = {
          ...dataApi.current,
          requestID: uuidv4(),
          relyingParty: smartIdCertificate?.data?.relyingParty,
          codeEnable: smartIdCertificate?.data?.codeEnable,
          certChain: newListCert[certSelected],
        };
        setDataSigning(dataApi.current);
        // handleNext(1);
        onClose();
        handleShowModalSignImage();
        break;
      case 6:
        //usb token get certChain
        dataApi.current = {
          ...dataApi.current,
          certChain: newListCert[certSelected],
        };
        setDataSigning(dataApi.current);
        onClose();
        handleShowModalSignImage();
        break;

      default:
        // perFormProcess(); // chỉ để test
        handleNext();
    }
  };

  const steps = [
    <Step1
      key="step1"
      provider={provider}
      setProvider={setProvider}
      connectorName={connectorName}
      setConnectorName={setConnectorName}
      mapProvider={mapProvider}
      connectorList={connectorList?.data}
      filterConnector={filterConnector}
      onDisableSubmit={handleDisableSubmit}
      errorPG={errorPG}
      errorApi={errorApi}
      setErrorApi={setErrorApi}
    />,
    <Step2_smartid
      key="step2"
      data={filterPrefix}
      dialCode={dialCode}
      errorApi={errorApi}
      setErrorApi={setErrorApi}
      criteria={criteria}
      setCriteria={setCriteria}
      code={code}
      setCode={setCode}
      onDisableSubmit={handleDisableSubmit}
      handleSubmit={handleSubmitClick}
    />,
    <Step3_eid
      key="step3"
      data={filterPrefixEid}
      criteria={criteriaEid}
      setCriteria={setCriteriaEid}
      code={code}
      setCode={setCode}
      onDisableSubmit={handleDisableSubmit}
      handleSubmit={handleSubmitClick}
    />,
    <Step4
      key="step4"
      assurance={assurance}
      setAssurance={setAssurance}
      onDisableSubmit={handleDisableSubmit}
    />,
    <Step5_smart
      key="step5"
      data={newListCert}
      certSelected={certSelected}
      setCertSelected={setCertSelected}
      onDoubleClick={handleSubmitClick}
      onDisableSubmit={handleDisableSubmit}
      assurance={assurance}
      provider={provider}
    />,
    <Step6_usb
      key="step5"
      data={newListCert}
      certSelected={certSelected}
      setCertSelected={setCertSelected}
      onDoubleClick={handleSubmitClick}
      onDisableSubmit={handleDisableSubmit}
      assurance={assurance}
      provider={provider}
    />,
  ];

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

  return (
    <Dialog
      // keepMounted={false}
      TransitionComponent={Transition}
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
          ref={descriptionElementRef}
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
            {unavail && <Alert severity="error">{unavail}</Alert>}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "15px 20px", height: "70px" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
          onClick={
            activeStep === 2 ||
            activeStep === 3 ||
            activeStep === 4 ||
            activeStep === 5 ||
            activeStep === 6
              ? handleBack
              : handleCancelClick
          }
        >
          {activeStep === 2 ||
          activeStep === 3 ||
          activeStep === 4 ||
          activeStep === 5 ||
          activeStep === 6
            ? t("0-common.back")
            : t("0-common.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={isPending || isSubmitDisabled}
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
SigningForm2.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleShowModalSignImage: PropTypes.func,
  handleShowEidModal: PropTypes.func,
  workFlow: PropTypes.object,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  signatureData: PropTypes.object,
};
export default SigningForm2;

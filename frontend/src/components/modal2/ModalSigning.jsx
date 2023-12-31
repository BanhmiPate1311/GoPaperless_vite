import { apiService } from "@/services/api_service";
import { blobToBase64, removeBase64Prefix } from "@/utils/commonFunction";
import DrawIcon from "@mui/icons-material/Draw";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AddSubtitle, TextSignForm } from ".";
import DrawSignForm from "./DrawSignForm";
import UploadSignForm from "./UploadSignForm";
import useCountry from "@/hook/use-country";
import removeBackground from "@imgly/background-removal";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: "10px 0",
            backgroundColor: "dialogBackground.main",
            color: "black",
          }}
        >
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const ModalSigning = ({
  open,
  onClose,
  signer,
  dataSigning,
  setDataSigning,
  handleShowmodal,
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      text:
        typeof dataSigning.certChain.subject === "string"
          ? dataSigning.certChain.subject
          : dataSigning.certChain.subject.commonName,
      drawUrl: "",
      fileUrl: "",
      imageScrop: "",
      name: true,
      contactInfor: dataSigning.email,
      date: false,
      logo: false,
      reason: true,
      dn: false,
      itver: false,
      location: true,
      label: true,
      alignment: "auto",
      format: 10,
    },
  });

  const { signing_token: signingToken } = useParams();
  const [value, setValue] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const textElement = useRef();
  const drawElement = useRef();
  const fileElement = useRef();
  const formRef = useRef();

  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken),
  });

  const { address } = useCountry();
  useEffect(() => {
    setDataSigning({
      ...dataSigning,
      country: signer.metaInformation?.country
        ? signer.metaInformation?.country
        : address,
      countryRealtime: address,
      signingPurpose: signer.signingPurpose
        ? signer.signingPurpose
        : "signature",
      reason: signer.customReason ? signer.customReason : "Purpose: signature",
    });
  }, [address]);

  const currentDatetime = new Date();
  const options = {
    timeZone: "Asia/Bangkok", // 'UTC+7' is equivalent to 'Asia/Bangkok'
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedDatetime = new Intl.DateTimeFormat("en-GB", options).format(
    currentDatetime
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDisableSubmit = (disabled) => {
    setIsSubmitDisabled(disabled);
  };

  const handleFormSubmit = (data) => {
    // console.log("data: ", data);
    switch (value) {
      case 0:
        html2canvas(textElement.current).then(async (canvas) => {
          const data64 = canvas.toDataURL();
          //   console.log(data64);
          let image_src = data64;
          const imageBlob = await removeBackground(image_src);

          const url = URL.createObjectURL(imageBlob);
          console.log("url: ", url);

          blobToBase64(url).then((base64String) => {
            console.log(base64String); // i.e: data:image/jpeg;base64,/9j/4AAQSkZJ..
            setDataSigning({
              ...dataSigning,
              contactInfor: data.contactInfor,
              imageBase64: removeBase64Prefix(base64String),
            });
            onClose();
            handleShowmodal();
          });
        });
        break;
      case 1:
        html2canvas(drawElement.current).then(async (canvas) => {
          const data64 = canvas.toDataURL();

          let image_src = data64;
          const imageBlob = await removeBackground(image_src);

          const url = URL.createObjectURL(imageBlob);
          console.log("url: ", url);

          blobToBase64(url).then((base64String) => {
            console.log(base64String); // i.e: data:image/jpeg;base64,/9j/4AAQSkZJ..
            setDataSigning({
              ...dataSigning,
              contactInfor: data.contactInfor,
              imageBase64: removeBase64Prefix(base64String),
            });
            onClose();
            handleShowmodal();
          });

          //   console.log(data64);
          // setDataSigning({
          //   ...dataSigning,
          //   contactInfor: data.contactInfor,
          //   imageBase64: removeBase64Prefix(data64),
          // });
          // onClose();
          // handleShowmodal();
        });
        break;
      case 2:
        html2canvas(fileElement.current).then(async (canvas) => {
          const data64 = canvas.toDataURL();

          let image_src = data64;
          const imageBlob = await removeBackground(image_src);

          const url = URL.createObjectURL(imageBlob);
          console.log("url: ", url);

          blobToBase64(url).then((base64String) => {
            console.log(base64String); // i.e: data:image/jpeg;base64,/9j/4AAQSkZJ..
            setDataSigning({
              ...dataSigning,
              contactInfor: data.contactInfor,
              imageBase64: removeBase64Prefix(base64String),
            });
            onClose();
            handleShowmodal();
          });

          // console.log(data64);
          // setDataSigning({
          //   ...dataSigning,
          //   contactInfor: data.contactInfor,
          //   imageBase64: removeBase64Prefix(data64),
          // });
          // onClose();
          // handleShowmodal();
        });
        break;
    }
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
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
          //   component="div"
          ref={formRef}
          component="form"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          onSubmit={handleSubmit(handleFormSubmit)}
          // className="choyoyoy"
        >
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <AppBar position="static" elevation={0}>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                // textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
                sx={{
                  height: "45px",
                  minHeight: "45px", //set height for tabs and tab
                  backgroundColor: "dialogBackground.main",
                }}
              >
                <Tab
                  icon={<KeyboardIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("0-common.text")}
                  {...a11yProps(0)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                  }} //set height for tabs and tab
                />
                <Tab
                  icon={<DrawIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("0-common.draw")}
                  {...a11yProps(1)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                  }} //set height for tabs and tab
                />
                <Tab
                  icon={<UploadIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("0-common.upload")}
                  {...a11yProps(1)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                  }} //set height for tabs and tab
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                <TextSignForm
                  ref={textElement}
                  dataSigning={dataSigning}
                  headerFooter={headerFooter?.data}
                  formattedDatetime={formattedDatetime}
                  onDisableSubmit={handleDisableSubmit}
                  watch={watch}
                  control={control}
                />
                {/* text */}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DrawSignForm
                  ref={drawElement}
                  dataSigning={dataSigning}
                  headerFooter={headerFooter?.data}
                  formattedDatetime={formattedDatetime}
                  onDisableSubmit={handleDisableSubmit}
                  watch={watch}
                  control={control}
                />
                {/* draw */}
              </TabPanel>
              <TabPanel value={value} index={2}>
                <UploadSignForm
                  ref={fileElement}
                  dataSigning={dataSigning}
                  headerFooter={headerFooter?.data}
                  formattedDatetime={formattedDatetime}
                  onDisableSubmit={handleDisableSubmit}
                  watch={watch}
                  control={control}
                />
              </TabPanel>
            </AppBar>
          </Box>
          <AddSubtitle control={control} signer={signer} />
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

ModalSigning.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signer: PropTypes.object,
  dataSigning: PropTypes.object,
  setDataSigning: PropTypes.func,
  handleShowmodal: PropTypes.func,
};

export default ModalSigning;

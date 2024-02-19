/* eslint-disable no-unused-vars */
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
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GeneralTextBoxForm } from ".";
import { DetailsTextBoxForm } from "./DetailsTextBoxForm";
import { useForm } from "react-hook-form";
import { UseUpdateSig } from "@/hook/use-fpsService";

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

export const TextBoxSettingField = ({
  open,
  onClose,
  type,
  signer,
  textData,
  participants,
}) => {
  // console.log("initData: ", initData);
  console.log("signer: ", signer);
  const { t } = useTranslation();

  const putSignature = UseUpdateSig();

  const signerIndex = participants.findIndex(
    (participant) => participant.signerId === signer.signerId
  );

  console.log("signerIndex: ", signerIndex);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      assign: signerIndex,
      valid: false,
      length: 1000,
      placeHolder: textData.type,
      font: "vernada",
      fontSize: 13,
      fieldName: textData.field_name,
      left: textData.dimension.x,
      top: textData.dimension.y,
      width: textData.dimension.width,
      height: textData.dimension.height,
    },
  });

  const formRef = useRef();

  console.log(type);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handletype = (type) => {
    switch (type) {
      case "NAME":
        return t("modal.edit_name");
      case "EMAIL":
        return t("modal.edit_email");
      case "JOB_TITLE":
        return t("modal.edit_jobtitle");
      case "COMPANY":
        return t("modal.edit_company");
    }
  };
  // console.log(handletype(type));

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data) => {
    console.log("data: ", data);
    // putSignature.mutate(
    //   {
    //     body: {
    //       field_name: textData.field_name,
    //       dimension: {
    //         x: -1,
    //         y: -1,
    //         width: -1,
    //         height: -1,
    //       },
    //       font: {
    //         name: font + bold + italic,
    //         size: size || 13,
    //       },
    //       visible_enabled: true,
    //       value: "",
    //     },
    //     field: "text",
    //     documentId: workFlow.documentId,
    //   },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: ["getField"] });
    //     },
    //   }
    // );
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
          maxWidth: "500px",
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
          {handletype(type)}
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
          ref={formRef}
          component="form"
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{
            height: "100%",
          }}
          onSubmit={handleSubmit(handleFormSubmit)}
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
                  // icon={<KeyboardIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("0-common.general")}
                  {...a11yProps(0)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                  }} //set height for tabs and tab
                />
                <Tab
                  // icon={<DrawIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("0-common.details")}
                  {...a11yProps(1)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                  }} //set height for tabs and tab
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                <GeneralTextBoxForm
                  participants={participants}
                  control={control}
                />
                {/* text */}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DetailsTextBoxForm control={control} />
              </TabPanel>
            </AppBar>
          </Box>
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
          // disabled={isPending || isSubmitDisabled}
          // startIcon={
          //   isPending ? <CircularProgress color="inherit" size="1em" /> : null
          // }
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

TextBoxSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.string,
  signer: PropTypes.object,
  textData: PropTypes.object,
  participants: PropTypes.array,
};

export default TextBoxSettingField;

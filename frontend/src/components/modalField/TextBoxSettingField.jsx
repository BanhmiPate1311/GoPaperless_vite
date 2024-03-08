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
import { useQueryClient } from "@tanstack/react-query";

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
  workFlow,
}) => {
  // console.log("initData: ", initData);
  // console.log("textData: ", textData);
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  // const signerIndex = participants.findIndex(
  //   (participant) => participant.signerId === signer.signerId
  // );

  // console.log("signerIndex: ", signerIndex);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      assign: signer.signerId,
      valid: textData.required,
      length: textData.max_length || 1000,
      placeHolder: textData.place_holder,
      font: textData.font?.name || "vernada",
      fontSize: textData.font?.size || 13,
      fieldName: textData.field_name,
      left: textData.dimension.x,
      top: textData.dimension.y,
      width: textData.dimension.width,
      height: textData.dimension.height,
    },
  });

  const formRef = useRef();

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
      case "JOBTITLE":
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
    const newDimension = {
      x: data.left !== textData.dimension.x ? parseFloat(data.left) : -1,
      y: data.top !== textData.dimension.y ? parseFloat(data.top) : -1,
      width:
        data.width !== textData.dimension.width ? parseFloat(data.width) : -1,
      height:
        data.height !== textData.dimension.height
          ? parseFloat(data.height)
          : -1,
    };
    const secondLastUnderscoreIndex = textData.field_name.lastIndexOf(
      "_",
      textData.field_name.lastIndexOf("_") - 1
    );
    const suffixString = textData.field_name.substring(
      secondLastUnderscoreIndex
    );
    const replacedString = data.assign + suffixString;

    putSignature.mutate(
      {
        body: {
          field_name: textData.field_name,
          dimension: newDimension,
          font: {
            name: data.font,
            size: data.fontSize,
          },
          visible_enabled: true,
          required: data.valid,
          max_length: data.length,
          place_holder: data.placeHolder,
          renamed_as:
            textData.field_name !== replacedString ? replacedString : null,
        },
        field: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
          onClose();
        },
      }
    );
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
          {t("0-common.close")}
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
  workFlow: PropTypes.object,
};

export default TextBoxSettingField;

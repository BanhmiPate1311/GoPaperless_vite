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
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { DetailsTextBoxForm, GeneralSealForm, ReplicateForm } from ".";

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

export const SealSettingField = ({
  open,
  onClose,
  signer,
  sealData,
  totalPages,
  workFlow,
  sealList,
}) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  // eslint-disable-next-line no-unused-vars
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      assign: signer.signerId,
      replicate: [],
      fieldName: sealData.field_name,
      left: sealData.dimension.x,
      top: sealData.dimension.y,
      width: sealData.dimension.width,
      height: sealData.dimension.height,
    },
  });

  const formRef = useRef();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (data) => {
    console.log("data: ", data);
    const newDimension = {
      x: data.left !== sealData.dimension.x ? parseFloat(data.left) : -1,
      y: data.top !== sealData.dimension.y ? parseFloat(data.top) : -1,
      width:
        data.width !== sealData.dimension.width ? parseFloat(data.width) : -1,
      height:
        data.height !== sealData.dimension.height
          ? parseFloat(data.height)
          : -1,
    };
    const secondLastUnderscoreIndex = sealData.field_name.lastIndexOf(
      "_",
      sealData.field_name.lastIndexOf("_") - 1
    );
    // console.log("secondLastUnderscoreIndex: ", secondLastUnderscoreIndex);
    const suffixString = sealData.field_name.substring(
      secondLastUnderscoreIndex
    );
    // console.log("suffixString: ", suffixString);
    const replacedString = data.assign + suffixString;

    putSignature.mutate(
      {
        body: {
          field_name: sealData.field_name,
          dimension: newDimension,
          font: {
            name: data.font,
            size: data.fontSize,
          },
          visible_enabled: true,
          replicate_all_pages:
            data.replicate.length === totalPages ? true : null,
          replicate:
            data.replicate.length === totalPages || data.replicate.length === 0
              ? null
              : data.replicate,
          renamed_as:
            sealData.field_name !== replacedString ? replacedString : null,
        },
        field: "image",
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
          {t("modal.edit_seal")}
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
                <Tab
                  // icon={<DrawIcon fontSize="small" />}
                  iconPosition="start"
                  label={t("modal.replicate_initials")}
                  {...a11yProps(2)}
                  sx={{
                    height: "45px",
                    minHeight: "45px", //set height for tabs and tab
                    textTransform: "none",
                  }} //set height for tabs and tab
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                {/* <GeneralTextBoxForm
                  participants={participants}
                  control={control}
                /> */}
                <GeneralSealForm
                  participants={workFlow.participants}
                  control={control}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DetailsTextBoxForm control={control} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <ReplicateForm
                  control={control}
                  name="replicate"
                  totalPages={totalPages}
                  workFlow={workFlow}
                  initList={sealList}
                  type="seals"
                />
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

SealSettingField.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signer: PropTypes.object,
  sealData: PropTypes.object,
  totalPages: PropTypes.number,
  workFlow: PropTypes.object,
  sealList: PropTypes.array,
};

export default SealSettingField;

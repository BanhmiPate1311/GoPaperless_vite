import AppBar from "@mui/material/AppBar";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slide from "@mui/material/Slide";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  // color: theme.palette.text.secondary,
}));

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SignatureSetting = ({ open, onClose, signer, signatureData }) => {
  // console.log("signatureData: ", signatureData);
  // console.log("signer: ", signer);
  const { t } = useTranslation();

  // const [listAssurance, setListAssurance] = useState([]);
  const [value, setValue] = useState(0);
  // console.log("value: ", value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmitClick = () => {
    console.log("object");
  };
  useEffect(() => {
    return () => {
      console.log("unmount");
    };
  }, []);
  return (
    <Dialog
      // keepMounted
      TransitionComponent={Transition}
      open={open}
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
          {t("modal.modal1_title")}
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
                  height: "46px",
                  minHeight: "46px",
                  backgroundColor: "dialogBackground.main",
                }}
              >
                <Tab
                  label={t("0-common.general")}
                  {...a11yProps(0)}
                  sx={{
                    minHeight: "46px",
                    height: "46px",
                    textTransform: "none",
                  }}
                />
                <Tab
                  label={t("0-common.details")}
                  {...a11yProps(1)}
                  sx={{
                    minHeight: "46px",
                    height: "46px",
                    textTransform: "none",
                  }}
                />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Box mb="10px">
                <Typography variant="h6" mb="10px">
                  {t("0-common.participants")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  // name={name}
                  defaultValue={signer.lastName + " " + signer.firstName}
                  sx={{ my: 0, height: "44px" }}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      height: "44px",
                      backgroundColor: "signingWFBackground.main",
                      fontSize: "14px",
                    },
                  }}
                />
              </Box>
              <Box mb="10px">
                <Typography variant="h6" mb="10px">
                  {t("signingForm.title5")}
                </Typography>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  size="small"
                  forcePopupIcon={false}
                  options={top100Films}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  disableClearable
                  onChange={(event, value) => console.log(value)}
                  renderInput={({ InputProps, ...params }) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...InputProps,
                        sx: {
                          minHeight: "44px",
                          backgroundColor: "signingWFBackground.main",
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box mb={"10px"}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    // label={t("modal.modal1_1")}
                    label={
                      <Typography variant="h6">
                        {t("modal.modal1_1")}
                      </Typography>
                    }
                    sx={{ height: "24px" }}
                  />
                </FormGroup>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="sms"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="sms"
                    control={<Radio />}
                    label={
                      <Typography variant="h6">
                        {t("modal.modal1_2")}
                      </Typography>
                    }
                    sx={{ height: "24px", mx: 0, mb: "10px" }}
                  />
                </RadioGroup>
                <Box mx={"30px"}>
                  <Typography
                    variant="h6"
                    color="#1F2937"
                    fontWeight={600}
                    mb="10px"
                  >
                    {t("signing.phoneNumber")}
                  </Typography>
                  <PhoneInput
                    country={"vn"}
                    specialLabel={""}
                    inputStyle={{
                      height: "45px",
                      width: "100%",
                    }}
                    copyNumbersOnly={false}
                    countryCodeEditable={false}
                    inputProps={{
                      maxLength: 16,
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <div style={{ alignSelf: "start" }}>
                        <Checkbox defaultChecked sx={{ height: "24px" }} />
                      </div>
                    }
                    label={
                      <Typography variant="h6">
                        {t("modal.modal1_3")}
                      </Typography>
                    }
                    sx={{ height: "48px" }}
                  />
                </FormGroup>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box mb="10px">
                <Typography variant="h6" mb="10px">
                  {t("0-common.field name")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  // name={name}
                  defaultValue={signatureData.field_name}
                  sx={{ my: 0, height: "44px" }}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      height: "44px",
                      backgroundColor: "signingWFBackground.main",
                      fontSize: "14px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  rowSpacing="10px"
                  columnSpacing={{ xs: 4, sm: 5, md: 6 }}
                  p="10px"
                >
                  <Grid item xs={6}>
                    <Item
                      sx={{
                        borderBottom: "1.25px solid",
                        borderColor: "borderColor.main",
                        height: "20px",
                        p: 0,
                        borderRadius: 0,
                        textAlign: "center",
                      }}
                      elevation={0}
                    >
                      <Typography variant="h6">
                        {t("0-common.screen")}
                      </Typography>
                    </Item>
                  </Grid>
                  <Grid item xs={6}>
                    <Item
                      sx={{
                        borderBottom: "1.25px solid",
                        borderColor: "borderColor.main",
                        height: "20px",
                        p: 0,
                        borderRadius: 0,
                        textAlign: "center",
                      }}
                      elevation={0}
                    >
                      <Typography variant="h6">PDF</Typography>
                    </Item>
                  </Grid>

                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.left")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.x}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          // readOnly: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.left")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.x}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          disabled: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>

                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.top")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.y}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          // readOnly: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.top")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.y}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          disabled: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>

                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.width")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.width}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          // readOnly: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.width")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.width}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          disabled: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>

                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.height")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.height}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          // readOnly: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={6} pt={0}>
                    <Item sx={{ p: 0 }} elevation={0}>
                      <Typography variant="h6" mb="10px" height={"17px"}>
                        {t("0-common.height")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        // name={name}
                        defaultValue={signatureData.dimension.height}
                        sx={{ my: 0, height: "44px" }}
                        InputProps={{
                          disabled: true,
                          sx: {
                            height: "44px",
                            backgroundColor: "signingWFBackground.main",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
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

const top100Films = [
  { title: "Advanced Electronic (AES)", value: "aes" },
  { title: "Electronic Seal (eSeal)", value: "seal" },
];

SignatureSetting.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  signer: PropTypes.object,
  setDataSigning: PropTypes.func,
  signatureData: PropTypes.object,
};

export default SignatureSetting;

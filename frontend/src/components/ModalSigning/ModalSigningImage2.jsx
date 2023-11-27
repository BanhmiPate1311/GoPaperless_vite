import CloseIcon from "@mui/icons-material/Close";
import DrawIcon from "@mui/icons-material/Draw";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import TextSign from "./TextSign";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`modal-tabpanel-${index}`}
      aria-labelledby={`modal-tab-${index}`}
      style={{ flexGrow: 1 }}
      {...other}
    >
      {value === index && (
        <Box width="100%">
          <Box width="100%">{children}</Box>
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const ModalSigningImage2 = ({ open, onClose }) => {
  // console.log("open: ", open);
  // set value for tabs
  const [value, setValue] = useState(0);

  // const sigTextRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
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
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="icon position tabs example"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                minHeight: 0,
              },
              minHeight: 0,
              mb: 2,
            }}
          >
            <Tab
              icon={<KeyboardIcon fontSize="small" />}
              iconPosition="start"
              label="Text"
              {...a11yProps(0)}
            />
            <Tab
              icon={<DrawIcon fontSize="small" />}
              iconPosition="start"
              label="Draw"
              {...a11yProps(1)}
            />
            <Tab
              icon={<UploadIcon fontSize="small" />}
              iconPosition="start"
              label="Upload"
              {...a11yProps(2)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <TextSign />
          </TabPanel>
          <TabPanel value={value} index={1}>
            chu
          </TabPanel>
          <TabPanel value={value} index={2}>
            chi
          </TabPanel>
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

ModalSigningImage2.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ModalSigningImage2;

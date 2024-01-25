import { convertTime } from "@/utils/commonFunction";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grow from "@mui/material/Grow";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import forge from "node-forge";

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
  return <Grow ref={ref} {...props} />;
});

export const ModalCertInfor = ({ open, onClose, data, provider, certData }) => {
  console.log("certData: ", certData);
  console.log("data: ", data);
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  // console.log("value: ", value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [type, setType] = useState("all");

  const handleSelectChange = (event) => {
    setType(event.target.value);
  };

  const issuer = () => {
    switch (provider) {
      case "USB_TOKEN_SIGNING":
        return data.issuer.commonName;
      default:
        return data.issuer;
    }
  };

  const subject = () => {
    switch (provider) {
      case "USB_TOKEN_SIGNING":
        return data.subject.commonName;
      default:
        return data.subject;
    }
  };

  // const subjectDN = () => {
  //   switch (provider) {
  //     case "USB_TOKEN_SIGNING":
  //       return data.name;
  //     default:
  //       return data.subjectDN;
  //   }
  // };

  const certificate = [
    {
      title: t("modal.certDetail_4"),
      value: subject(),
    },
    {
      title: t("modal.certDetail_5"),
      value: issuer(),
    },
    // {
    //   title: t("0-common.subjectDN"),
    //   value: subjectDN(),
    // },
    {
      title: t("0-common.valid_from"),
      value: data.validFrom ? convertTime(data.validFrom) : null,
    },
    {
      title: t("0-common.valid_to"),
      value: data.validTo ? convertTime(data.validTo) : null,
    },
  ].filter((item) => item.value !== null);

  const selectData = [
    {
      value: "all",
      label: "<All>",
    },
    {
      value: "field",
      label: "Version 1 Fields Only",
    },
    {
      value: "ext",
      label: "Extensions Only",
    },
    {
      value: "crit",
      label: "Critical Extensions Only",
    },
    {
      value: "prop",
      label: "Properties Only",
    },
  ];

  const columns = [{ label: "Field" }, { label: "Details" }];

  const all = [
    {
      label: "Version",
      value: certData?.version,
    },
    {
      label: "Serial number",
      value: certData?.serialNumber,
    },
    {
      label: "Signature algorithm",
      value: certData?.sigAlgName,
    },
    {
      label: "Signature hash algorithm",
      value: certData?.algorithm,
    },
    {
      label: "Issuer",
      value: certData?.issuerDN,
    },
    {
      label: "Valid from",
      value: certData?.validFrom,
    },
    {
      label: "Valid to",
      value: certData?.validTo,
    },
    {
      label: "Subject",
      value: certData?.subjectDN,
    },
    {
      label: "Public key",
      value: certData?.subject?.split("\n")[0],
    },
    {
      label: "Authority information access",
      value: certData?.authorityInformationAccess,
    },
    {
      label: "Subject key identifier",
      value: certData?.subjectKeyIdentifier?.substring(2),
    },
    {
      label: "Authority key identifier",
      value: certData?.authorityKeyIdentifier,
    },
    {
      label: "CRL distribution point",
      value: certData?.crlDistributionPoints,
    },
    {
      label: "Enhanced key usage",
      value: certData?.enhancedKeyUsage,
    },
    {
      label: "Subject alternative name",
      value: certData?.subjectAlternativeName,
    },
    {
      label: "Basic Constraints",
      value: certData?.basicConstraints,
    },
    {
      label: "Key usage",
      value: certData?.keyUsage,
    },
    {
      label: "Thumbprint",
      value: certData?.thumbprint,
    },
  ];

  const field = [
    {
      label: "Version",
      value: certData?.version,
    },
    {
      label: "Serial number",
      value: certData?.serialNumber,
    },
    {
      label: "Signature algorithm",
      value: certData?.sigAlgName,
    },
    {
      label: "Signature hash algorithm",
      value: certData?.algorithm,
    },
    {
      label: "Issuer",
      value: certData?.issuerDN,
    },
    {
      label: "Valid from",
      value: certData?.validFrom,
    },
    {
      label: "Valid to",
      value: certData?.validTo,
    },
    {
      label: "Subject",
      value: certData?.subjectDN,
    },
    {
      label: "Public key",
      value: certData?.subject?.split("\n")[0],
    },
  ];

  const extension = [
    {
      label: "Authority information access",
      value: certData?.authorityInformationAccess,
    },
    {
      label: "Subject key identifier",
      value: certData?.subjectKeyIdentifier?.substring(2),
    },
    {
      label: "Authority key identifier",
      value: certData?.authorityKeyIdentifier,
    },
    {
      label: "CRL distribution point",
      value: certData?.crlDistributionPoints,
    },
    {
      label: "Enhanced key usage",
      value: certData?.enhancedKeyUsage,
    },
    {
      label: "Subject alternative name",
      value: certData?.subjectAlternativeName,
    },
    {
      label: "Basic Constraints",
      value: certData?.basicConstraints,
    },
    {
      label: "Key usage",
      value: certData?.keyUsage,
    },
    {
      label: "Thumbprint",
      value: certData?.thumbprint,
    },
  ];

  const crit = [
    {
      label: "Basic Constraints",
      value: certData?.basicConstraints,
    },
    {
      label: "Key usage",
      value: certData?.keyUsage,
    },
  ];

  const props = [
    {
      label: "Thumbprint",
      value: certData?.thumbprint,
    },
  ];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <Dialog
      keepMounted={false}
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
          {t("modal.modal5_title")}
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
              <Box width={"100%"}>
                <Typography variant="h6">{t("modal.certDetail_1")}</Typography>
                <Box p={"10px 20px"}>
                  <ul style={{ margin: 0 }}>
                    <li>
                      <Typography variant="h6">
                        {t("modal.certDetail_2")}
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="h6">
                        {t("modal.certDetail_3")}
                      </Typography>
                    </li>
                  </ul>
                </Box>
                {certificate.map((item, index) => (
                  <Box key={index} mb="10px">
                    <Typography
                      variant="h6"
                      height="17px"
                      fontWeight={600}
                      mb="10px"
                    >
                      {item.title}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      margin="normal"
                      multiline
                      defaultValue={item.value}
                      sx={{
                        my: 0,
                        "& .MuiInputBase-root": {
                          minHeight: "45px",
                          height: "auto !important",
                        },
                      }}
                      disabled={true}
                      InputProps={{
                        // readOnly: true,
                        sx: {
                          backgroundColor: "#EFEFEF",
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                width={"100%"}
                mb={"10px"}
              >
                <Typography variant="h4" sx={{ mr: 1 }}>
                  Show:
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select1-label"
                    id="demo-simple-select"
                    value={type}
                    onChange={handleSelectChange}
                    sx={{
                      "& .MuiListItemSecondaryAction-root": {
                        right: "30px",
                        display: "flex",
                      },
                      backgroundColor: "signingWFBackground.main",
                      fontSize: "12px",
                    }}
                  >
                    {selectData?.map((item, index) => (
                      <MenuItem
                        key={index}
                        value={item.value}
                        sx={{ fontSize: "12px" }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <TableContainer component={Paper}>
                <Table
                  sx={{ width: "100%", tableLayout: "fixed" }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow sx={{ height: "30px" }}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{ p: "0 20px", width: "50%" }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      {/* <TableCell>Dessert (100g serving)</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Fat&nbsp;(g)</TableCell>
                      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                      <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {all.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          height: "30px",
                        }}
                      >
                        {/* <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell> */}
                        <TableCell sx={{ p: "0 20px" }}>{row.label}</TableCell>
                        <TableCell sx={{ p: "0 20px" }}>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
          {t("0-common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalCertInfor.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  provider: PropTypes.string,
  certData: PropTypes.object,
};

export default ModalCertInfor;

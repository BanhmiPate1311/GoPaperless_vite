/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ReactComponent as PencilIcon } from "@/assets/images/svg/pencil_wait.svg";
import { ReactComponent as UserCheckIcon } from "@/assets/images/svg/uil_user-check.svg";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DocumentsEdit from "./DocumentsEdit";

const DocumentsTable = ({
  data,
  workFlow,
  setParticipant,
  updateParticipant,
  participant,
}) => {
  const { t } = useTranslation();
  // const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [layout, setLayout] = useState(undefined);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Typography variant="h6" fontWeight="bold" pt={1}>
        Set signing deadline
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={["DateTimePicker"]}
          sx={{
            "& .MuiStack-root": {
              overflow: "hidden",
              width: "219px",
            },
          }}
        >
          <DemoItem>
            <DateTimePicker
              // defaultValue={"Pick a Date"}
              viewRenderers={{
                hours: null,
                minutes: null,
                seconds: null,
              }}
              // label="Pick a Date"
            />
          </DemoItem>
        </DemoContainer>
        {/* <DemoContainer
          components={[
            "DateTimePicker",
            "MobileDateTimePicker",
            "DesktopDateTimePicker",
            "StaticDateTimePicker",
          ]}
          sx={{
            "& .MuiStack-root": {
              overflow: "hidden",
              width: "219px",
            },
          }}
        >
          <DemoItem>
            <MobileDateTimePicker defaultValue={dayjs("2022-04-17T15:30")} />
          </DemoItem>
        </DemoContainer> */}
      </LocalizationProvider>
      <Box>
        <Typography
          fontSize="12px"
          color="#1F2937"
          fontWeight="bold"
          pt={2}
          pr={5}
          display="inline-block"
        >
          Allowed e-signature levels
        </Typography>
        <div
          style={{
            width: "110px",
            height: "24px",
            display: "inline-block",
            background: "#EEEEEE",
            textAlign: "center",
            borderRadius: "10px",
          }}
        >
          <SvgIcon
            // color="primary"
            sx={{
              fontSize: 16,
              color: "primary.main",
              display: "inline-block",
              marginTop: "5px",
            }}
            viewBox={"0 0 16 16"}
          >
            <UserCheckIcon />
          </SvgIcon>
          <Typography
            sx={{
              color: "#1F2937",
              display: "inline-block",
              fontSize: 12,
              fontWeight: "bold",
              verticalAlign: "middle", // Canh chỉnh theo chiều dọc
              paddingLeft: "10px",
              paddingBottom: "4px",
            }}
          >
            {t("All levels")}
          </Typography>
        </div>
        <div
          style={{
            width: "110px",
            height: "24px",
            display: "inline-block",
            background: "#FFFFFF",
            textAlign: "center",
            borderRadius: "10px",
            marginLeft: "30px",
          }}
        >
          <SvgIcon
            // color="primary"
            sx={{
              fontSize: 14,
              color: "primary.main",
              display: "inline-block",
              marginTop: "5px",
            }}
            viewBox={"0 0 16 16"}
            onClick={handleOpen}
          >
            <PencilIcon />
          </SvgIcon>
          <Typography
            sx={{
              color: "#1F2937",
              display: "inline-block",
              fontSize: 12,
              fontWeight: "bold",
              verticalAlign: "middle", // Canh chỉnh theo chiều dọc
              paddingLeft: "10px",
              paddingBottom: "4px",
            }}
          >
            {t("0-common.edit")}
          </Typography>
        </div>
      </Box>
      <Grid container spacing={0} sx={{ flexGrow: 0 }}>
        <Grid xs={0}>
          <Checkbox
            defaultChecked
            style={{
              maxWidth: "4.333333%",
            }}
          />
        </Grid>
        <Grid xs={11} pt={1}>
          <span
            style={{
              // display: "inline-block",
              color: "#1F2937",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Allow signing or viewing this document without GoPaperless account
          </span>
        </Grid>
      </Grid>
      <Alert severity="warning">
        Some participants lack personal code. Those participants will not be
        required to authenticate to view the document
      </Alert>
      <Grid container spacing={0} sx={{ flexGrow: 0 }}>
        <Grid xs={0}>
          <Checkbox
            style={{
              maxWidth: "4.333333%",
            }}
          />
        </Grid>
        <Grid xs={11} pt={1}>
          <span
            style={{
              // display: "inline-block",
              color: "#1F2937",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Allow signing or viewing this document using video-based
            identification. The participant that does not have a Qualified
            Electronic Signature will have the possibility to sign or view this
            document using their vaild ID document, phone and computer with a
            camera
          </span>
        </Grid>
      </Grid>
      {/* <Box sx={{ width: 1 }}>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
          <Box gridColumn="span 1"></Box>
          <Box gridColumn="span 11"></Box>
        </Box>
      </Box> */}
      <DocumentsEdit
        workFlow={workFlow}
        open={open}
        handleClose={handleClose}
        title={t("Allowed signature levels")}
      />
    </div>
  );
};

DocumentsTable.propTypes = {
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default DocumentsTable;

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const GeneralTextBoxForm = () => {
  const { t } = useTranslation();

  //   Begin: Select
  const [assign, setAssign] = useState("Select Participant");
  const [validation, setValidation] = useState("");
  const [fontType, setFontType] = useState("");
  const [fontSize, setFontSize] = useState(1);

  const handleChangeSelect = (event, setSelect) => {
    setSelect(event.target.value);
  };
  return (
    <Box
      sx={{
        "& >.MuiBox-root": {
          marginBottom: "10px",
        },
      }}
    >
      <Box>
        <Typography variant="h6" mb="10px">
          {t("modal.assigned_to")}
        </Typography>
        <FormControl fullWidth>
          <Select
            fullWidth
            size="small"
            margin="normal"
            renderValue={(value) => `${value}`}
            displayEmpty
            value={assign}
            sx={{
              my: 0,
              height: "45px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
              "& .MuiMenuItem-root": {
                height: "36px",
              },
            }}
            IconComponent={ExpandMoreIcon}
            onChange={(e) => handleChangeSelect(e, setAssign)}
          >
            <MenuItem value={t("modal.select_participant")}></MenuItem>
            <MenuItem value={1}>assign1</MenuItem>
            <MenuItem value={2}>assign2</MenuItem>
            <MenuItem value={3}>assign3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography variant="h6" mb="10px">
          {t("modal.validation")}
        </Typography>

        <FormControl fullWidth>
          <Select
            fullWidth
            size="small"
            margin="normal"
            value={validation}
            defaultValue={1}
            sx={{
              my: 0,
              height: "45px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
            }}
            onChange={(e) => handleChangeSelect(e, setValidation)}
            IconComponent={ExpandMoreIcon}
          >
            <MenuItem value={1}>assign1</MenuItem>
            <MenuItem value={2}>assign2</MenuItem>
            <MenuItem value={3}>assign3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography variant="h6" mb="10px">
          {t("modal.allowed_length")}
        </Typography>

        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          // defaultValue={signer.lastName + " " + signer.firstName}
          sx={{ my: 0, height: "45px" }}
          InputProps={{
            //   readOnly: true,
            sx: {
              height: "45px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
            },
          }}
        />
      </Box>
      <Box>
        <Typography variant="h6" mb="10px">
          {t("modal.placeholder")}
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          // defaultValue={signer.lastName + " " + signer.firstName}
          sx={{ my: 0, height: "45px" }}
          InputProps={{
            //   readOnly: true,
            sx: {
              height: "44px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
            },
          }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h6" mb="10px">
            {t("modal.font_type")}
          </Typography>
          <FormControl fullWidth>
            {/* <InputLabel size="small" sx={{ fontSize: "14px", mt: "4px" }}>
              Select Font
            </InputLabel> */}
            <Select
              fullWidth
              size="small"
              margin="normal"
              value={fontType}
              // label="  Select Font"
              sx={{
                my: 0,
                height: "45px",
                backgroundColor: "signingWFBackground.main",
                fontSize: "14px",
              }}
              onChange={(e) => handleChangeSelect(e, setFontType)}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value={1}>small</MenuItem>
              <MenuItem value={2}>medium</MenuItem>
              <MenuItem value={3}>bold</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h6" mb="10px">
            {t("modal.font_size")}
          </Typography>
          <FormControl fullWidth>
            <Select
              fullWidth
              size="small"
              margin="normal"
              value={fontSize}
              //   label="Select Font"
              sx={{
                my: 0,
                height: "45px",
                backgroundColor: "signingWFBackground.main",
                fontSize: "14px",
              }}
              onChange={(e) => handleChangeSelect(e, setFontSize)}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value={1}>10</MenuItem>
              <MenuItem value={2}>12</MenuItem>
              <MenuItem value={3}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

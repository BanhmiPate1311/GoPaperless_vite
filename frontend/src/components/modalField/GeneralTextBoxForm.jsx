import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
          Assigned to
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
              height: "44px",
              backgroundColor: "signingWFBackground.main",
              fontSize: "14px",
              "& .MuiMenuItem-root": {
                height: "36px",
              },
            }}
            IconComponent={ExpandMoreIcon}
            onChange={(e) => handleChangeSelect(e, setAssign)}
          >
            <MenuItem value={"Select Participant"}></MenuItem>
            <MenuItem value={1}>assign1</MenuItem>
            <MenuItem value={2}>assign2</MenuItem>
            <MenuItem value={3}>assign3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Typography variant="h6" mb="10px">
          Validation
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
              height: "44px",
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
          Allowed Length
        </Typography>

        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          // defaultValue={signer.lastName + " " + signer.firstName}
          sx={{ my: 0, height: "44px" }}
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
      <Box>
        <Typography variant="h6" mb="10px">
          Placeholder
        </Typography>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          // name={name}
          // defaultValue={signer.lastName + " " + signer.firstName}
          sx={{ my: 0, height: "44px" }}
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
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" mb="10px">
            Font Type
          </Typography>
          <FormControl fullWidth>
            <InputLabel size="small" sx={{ fontSize: "14px", mt: "4px" }}>
              Select Font
            </InputLabel>
            <Select
              fullWidth
              size="small"
              margin="normal"
              value={fontType}
              label="  Select Font"
              sx={{
                my: 0,
                height: "44px",
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
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" mb="10px">
            Font Size
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
                height: "44px",
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

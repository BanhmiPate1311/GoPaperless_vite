import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const TextSign = () => {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  const [state, setState] = useState({
    name: true,
    date: false,
    logo: false,
    reason: false,
    dn: false,
    itver: false,
    location: false,
    label: false,
    alignment: "auto",
    age: 10,
  });
  // console.log("state: ", state);

  // const [alignment, setAlignment] = useState("auto");

  // const [age, setAge] = useState(10);

  const handleChangeSelect = (event) => {
    // setAge(event.target.value);
    setState((prevState) => ({
      ...prevState,
      ["age"]: event.target.value,
    }));
  };

  const handleChangeToggle = (event, newAlignment) => {
    // setAlignment(newAlignment);
    setState((prevState) => ({
      ...prevState,
      ["alignment"]: newAlignment,
    }));
  };

  // const handleChange = (event) => {

  //     setState({
  //       ...state,
  //       [event.target.name]: event.target.checked,
  //     });

  // };
  const handleChange = (event, newValue) => {
    console.log("newValue: ", newValue);
    console.log("event: ", event);
    const name = event.target.name;

    setState((prevState) => ({
      ...prevState,
      [name]: newValue !== undefined ? newValue : event.target.checked,
    }));
  };

  const {
    name,
    date,
    logo,
    reason,
    dn,
    itver,
    location,
    label,
    alignment,
    age,
  } = state;

  return (
    <>
      <Box mb={2}>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          fullWidth
          inputProps={{
            sx: {
              textTransform: "capitalize",
            },
          }}
          size="small"
          onChange={(e) => {
            console.log("e: ", e.target.value);
            setText(e.target.value);
          }}
          value={text}
        />
      </Box>
      <Stack
        sx={{
          overflow: "hidden",
          borderRadius: "6px",
          border: "1px solid #357EEB",
          backgroundColor: "white",
        }}
      >
        <Stack
          direction="row"
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            minHeight: "100px",
            // padding: "2rem 0",
          }}
          // ref={sigTextRef}
        >
          <Box
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "50%",
              fontSize: "2rem",
              textAlign: "center",
              textTransform: "capitalize",
            }}
            className="font-moon-dance"
          >
            {text}
          </Box>
        </Stack>
        <Box
          style={{
            borderTop: "2px dashed #357EEB",
            height: "2rem",
          }}
        ></Box>
      </Stack>
      <Typography mt={1}>Contact Information</Typography>
      <Box my={1}>
        <TextField
          id="outlined-basic"
          //   label="Contact Information"
          variant="outlined"
          fullWidth
          //   inputProps={{
          //     sx: {
          //       textTransform: "capitalize",
          //     },
          //   }}
          size="small"
          onChange={(e) => {
            // console.log("e: ", e.target.value);
            setEmail(e.target.value);
          }}
          value={email}
        />
      </Box>
      <FormControl
        component="fieldset"
        // variant="standard"
        sx={{ width: "100%" }}
        size="small"
      >
        <FormLabel component="legend">Include Text</FormLabel>
        <FormGroup sx={{ flexDirection: "row" }}>
          <Box width={"50%"}>
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox checked={name} onChange={handleChange} name="name" />
              }
              label="Name"
            />
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox checked={date} onChange={handleChange} name="date" />
              }
              label="Date"
            />
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox checked={logo} onChange={handleChange} name="logo" />
              }
              label="Logo"
            />
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox
                  checked={reason}
                  onChange={handleChange}
                  name="reason"
                />
              }
              label="Reason"
            />
            <FormLabel component="legend">Text Direction</FormLabel>
            <ToggleButtonGroup
              size="small"
              color="primary"
              value={alignment}
              name="alignment"
              exclusive
              onChange={handleChangeToggle}
              aria-label="Platform"
            >
              <ToggleButton value="auto">Auto</ToggleButton>
              <ToggleButton value="left">
                <FormatAlignLeftIcon />
              </ToggleButton>
              ,
              <ToggleButton value="right">
                <FormatAlignRightIcon />
              </ToggleButton>
              ,
            </ToggleButtonGroup>
          </Box>
          <Box width={"50%"}>
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox checked={dn} onChange={handleChange} name="dn" />
              }
              label="Distinguished Name"
            />
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox
                  checked={itver}
                  onChange={handleChange}
                  name="itver"
                />
              }
              label="IText Version"
            />
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox
                  checked={location}
                  onChange={handleChange}
                  name="location"
                />
              }
              label="Location"
            />
            <FormControlLabel
              sx={{
                width: "100%",
                "& .MuiCheckbox-root": {
                  padding: "0 9px",
                },
              }}
              control={
                <Checkbox
                  checked={label}
                  onChange={handleChange}
                  name="label"
                />
              }
              label="Labels"
            />
            <FormLabel component="legend">Digits Format</FormLabel>
            {/* <InputLabel id="demo-select-small-label">Age</InputLabel> */}
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={age}
              name="age"
              // label="Age"
              onChange={handleChangeSelect}
            >
              <MenuItem value={10}>0123456789</MenuItem>
              <MenuItem value={20}>0123456789</MenuItem>
            </Select>
          </Box>
        </FormGroup>
      </FormControl>
    </>
  );
};

TextSign.propTypes = {};

export default TextSign;

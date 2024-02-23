import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { InputField } from "../form";

const QryptoField = ({ control }) => {
  const [divs, setDivs] = useState([
    <Box key={0} mb="10px">
      <Stack
        mb="10px"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h6">Workflow Name</Typography>
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#F24E1E",
            cursor: "pointer",
            // display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveElement(0)}
        />
      </Stack>
      <InputField
        label=""
        name="workFlowName"
        control={control}
        InputLabelProps={{
          sx: {
            backgroundColor: "signingWFBackground.main",
          },
        }}
        inputProps={{
          // readOnly: true,
          sx: {
            py: "10.5px",
            backgroundColor: "signingWFBackground.main",
          },
        }}
        sx={{ my: 0, height: "45px" }}
      />
    </Box>,
    <Box key={1} mb="10px">
      <Stack
        mb="10px"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h6">File Name</Typography>
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#F24E1E",
            cursor: "pointer",
            // display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveElement(1)}
        />
      </Stack>
      <InputField
        label=""
        name="fileName"
        control={control}
        InputLabelProps={{
          sx: {
            backgroundColor: "signingWFBackground.main",
          },
        }}
        inputProps={{
          // readOnly: true,
          sx: {
            py: "10.5px",
            backgroundColor: "signingWFBackground.main",
          },
        }}
        sx={{ my: 0, height: "45px" }}
      />
    </Box>,
  ]);
  const handleRemoveElement = (index) => {
    console.log("index: ", index);
    if (divs.length > 0 && index >= 0 && index < divs.length) {
      const newDivs = [...divs];
      newDivs.splice(index, 1); // Xóa phần tử tại vị trí index
      setDivs(newDivs);
    } else {
      alert("Vị trí không hợp lệ hoặc không có div để xóa!");
    }
  };
  return (
    <Box>
      {divs.map((div, index) => (
        <div key={index}>
          {div}
          {/* <button onClick={() => deleteDiv(index)}>Delete</button> */}
        </div>
      ))}
    </Box>
  );
};

QryptoField.propTypes = {
  control: PropTypes.object,
};

export default QryptoField;

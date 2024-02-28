import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const QryptoField = ({ workFlow }) => {
  const [elements, setElements] = useState([
    {
      id: uuidv4(),
      type: "input",
      label: "Workflow Name",
      value: workFlow.documentName,
      readOnly: true,
    },
    {
      id: uuidv4(),
      type: "table",
      label: "File Name",
      // options: ["PDF", "DOC", "TXT"],
      value:
        workFlow.fileName.substring(0, workFlow.fileName.lastIndexOf(".")) ||
        workFlow.fileName,
      readOnly: true,
    },
  ]);

  const handleInputChange = (id, newValue) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, value: newValue } : element
      )
    );
  };

  const renderElement = (element) => {
    switch (element.type) {
      case "input":
        return (
          <Box key={element.id} mb="10px" px="5px">
            <Stack
              mb="10px"
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h6">{element.label}</Typography>
              <SvgIcon
                component={GarbageIcon}
                inheritViewBox
                sx={{
                  width: "15px",
                  height: "15px",
                  color: "#F24E1E",
                  cursor: "pointer",
                }}
                onClick={() => handleRemoveElement(element.id)}
              />
            </Stack>
            <TextField
              fullWidth
              size="small"
              margin="normal"
              // name={name}
              value={element.value}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              InputLabelProps={{
                sx: {
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              inputProps={{
                readOnly: element.readOnly,
                sx: {
                  py: "10.5px",
                  backgroundColor: "signingWFBackground.main",
                },
              }}
              sx={{ my: 0, height: "45px" }}
            />
          </Box>
        );
      case "select":
        return (
          <div key={element.id}>
            <select>
              {element.options.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
            <button onClick={() => handleRemoveElement(element.id)}>
              Remove
            </button>
          </div>
        );
      case "table":
        return (
          <Box key={element.id} mb="10px" p="5px">
            <Stack
              mb="10px"
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h6">{element.label}</Typography>
              <SvgIcon
                component={GarbageIcon}
                inheritViewBox
                sx={{
                  width: "15px",
                  height: "15px",
                  color: "#F24E1E",
                  cursor: "pointer",
                }}
                onClick={() => handleRemoveElement(element.id)}
              />
            </Stack>
            <TableContainer component={Paper}>
              <Table
                sx={{ width: "100%" }}
                size="small"
                aria-label="simple table"
              >
                <TableBody>
                  <TableRow
                    sx={{
                      height: "45px",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="right">alo</TableCell>
                    <TableCell align="right">abc</TableCell>
                    <TableCell align="right">def</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      height: "45px",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="right">ghi</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleRemoveElement = (id) => {
    setElements((prevElements) =>
      prevElements.filter((element) => element.id !== id)
    );
  };

  // const handleRemoveElement = (id) => {
  //   if (divs.length > 0 && index >= 0 && index < divs.length) {
  //     setDivs((prevDivs) => {
  //       const newDivs = [...prevDivs];
  //       newDivs.splice(index, 1);
  //       return newDivs;
  //     });
  //   } else {
  //     alert("Vị trí không hợp lệ hoặc không có div để xóa!");
  //   }
  // };
  return <Box>{elements.map((element) => renderElement(element))}</Box>;
};

QryptoField.propTypes = {
  control: PropTypes.object,
  workFlow: PropTypes.object,
};

export default QryptoField;

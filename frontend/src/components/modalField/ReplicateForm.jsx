import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export const ReplicateForm = () => {
  const { t } = useTranslation();

  //   Begin: Select
  const [assign, setAssign] = useState("Select Pages");
  const handleChangeSelect = (event, setSelect) => {
    setSelect(event.target.value);
  };
  const rows = [
    {
      initials: "Initials 1",
      documentName: "File PDF 01",
      page: 1,
    },
    {
      initials: "Initials 1",
      documentName: "File PDF 01",
      page: 1,
    },
    {
      initials: "Initials 1",
      documentName: "File PDF 01",
      page: 1,
    },
  ];
  return (
    <Box>
      <Box mb="10px">
        <Typography variant="h6" mb="10px">
          Replicate to Pages
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
            <MenuItem value={"Select Pages"}></MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Initials</TableCell>
              <TableCell align="center">Document Name</TableCell>
              <TableCell align="center">Page</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.initials}
                </TableCell>
                <TableCell align="center">{row.documentName}</TableCell>
                <TableCell align="center">{row.page}</TableCell>
                <TableCell align="center">
                  <Button>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

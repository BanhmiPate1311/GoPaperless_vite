import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { MenuProps } from "@/hook/utils";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReplicateForm = ({ control, name, totalPages, initList }) => {
  console.log("pdfInfo: ", totalPages);
  const { t } = useTranslation();

  const {
    field: { onChange, value },
    // fieldState: { error },
  } = useController({ name, control });

  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(Array.from(Array(totalPages), (_, index) => index + 1));
  }, [totalPages]);

  // const options = Array.from(
  //   Array(pdfInfo?.totalPage),
  //   (_, index) => index + 1
  // );

  // const [selected, setSelected] = useState([]);
  const isAllSelected =
    options?.length > 0 && value?.length === options?.length;

  const handleChange = (event) => {
    // console.log("event: ", event);
    const value1 = event.target.value;
    if (value1[value1?.length - 1] === "all") {
      onChange(value?.length === options?.length ? [] : options);
      return;
    }
    onChange(value1);
  };

  const options2 = initList.map((item) => item?.field_name);

  const [selected2, setSelected2] = useState([]);
  const isAllSelected2 =
    options2.length > 0 && selected2.length === options2.length;

  const handleChange2 = (event) => {
    const value2 = event.target.value;
    console.log(value);
    if (value2 === "all") {
      setSelected2(selected2.length === options2.length ? [] : options2);
      return;
    }
    // added below code to update selected options
    const list = [...selected2];
    const index = list.indexOf(value2);
    index === -1 ? list.push(value2) : list.splice(index, 1);
    setSelected2(list);
  };

  const handleRemoveInit = () => {
    console.log("selected2: ", selected2);
  };

  return (
    <Box>
      <Box mb="10px">
        <Typography variant="h6" mb="10px">
          {t("modal.replicate_to_pages")}
        </Typography>
        <FormControl fullWidth>
          {/* <InputLabel id="mutiple-select-label">Multiple Select</InputLabel> */}
          <Select
            labelId="mutiple-select-label"
            multiple
            // name="replicate"
            control={control}
            value={value}
            onChange={handleChange}
            renderValue={(value) => {
              return value.length === options.length
                ? "Select All"
                : value.join(", ");
            }}
            MenuProps={MenuProps}
            sx={{
              backgroundColor: "signingWFBackground.main",
              height: "45px",
            }}
          >
            <MenuItem value="all">
              <ListItemIcon>
                <Checkbox
                  // classes={{ indeterminate: classes.indeterminateColor }}
                  checked={isAllSelected}
                  indeterminate={
                    value.length > 0 && value.length < options.length
                  }
                />
              </ListItemIcon>
              <ListItemText
                // classes={{ primary: classes.selectAllText }}
                primary="Select All"
              />
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <ListItemIcon>
                  <Checkbox checked={value.indexOf(option) > -1} />
                </ListItemIcon>
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "116px" }}>
                {t("0-common.initials")} ({initList.length})
              </TableCell>
              <TableCell align="center" sx={{ width: "208px" }}>
                {t("modal.document_name")}
              </TableCell>
              <TableCell align="center" sx={{ width: "77px" }}>
                {t("0-common.page")}
              </TableCell>
              <TableCell align="center">
                <SvgIcon
                  component={GarbageIcon}
                  inheritViewBox
                  sx={{
                    width: "15px",
                    height: "15px",
                    color: "#545454",
                    cursor: "pointer",
                  }}
                  onClick={handleRemoveInit}
                />
                <Checkbox
                  value="all"
                  onChange={handleChange2}
                  checked={isAllSelected2}
                  indeterminate={
                    selected2.length > 0 && selected2.length < options2.length
                  }
                  // sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
                  disableRipple
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initList.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Initials {index + 1}
                </TableCell>
                <TableCell align="center">{row.documentName}</TableCell>
                <TableCell align="center">{row.page}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    value={row.field_name}
                    onChange={handleChange2}
                    checked={selected2.includes(row.field_name)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
ReplicateForm.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  totalPages: PropTypes.number,
  initList: PropTypes.array,
};

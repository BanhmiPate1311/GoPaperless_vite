import { MenuProps, options } from "@/hook/utils";
import { Checkbox, ListItemIcon, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReplicateForm = ({ control, name }) => {
  const { t } = useTranslation();

  const {
    field: { onChange, value },
    // fieldState: { error },
  } = useController({ name, control });

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
              <TableCell>{t("0-common.initials")}</TableCell>
              <TableCell align="center">{t("modal.document_name")}</TableCell>
              <TableCell align="center">{t("0-common.page")}</TableCell>
              <TableCell align="center">{t("0-common.action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.initials}
                </TableCell>
                <TableCell align="center">{row.documentName}</TableCell>
                <TableCell align="center">{row.page}</TableCell>
                <TableCell align="center">
                  <Button>{t("0-common.delete")}</Button>
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
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  name: PropTypes.string,
};

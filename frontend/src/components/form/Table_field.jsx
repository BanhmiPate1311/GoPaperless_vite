import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const TableField = ({ data }) => {
  console.log("data: ", data);
  const { t } = useTranslation();

  const columns = [
    { id: "stt", label: "#", minWidth: 40 },
    {
      id: "participants",
      label: `${t("0-common.participants")}`,
      minWidth: 90,
    },
    {
      id: "name",
      label: `${t("0-common.name")}`,
      minWidth: 140,
      // align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "email",
      label: `${t("0-common.email")}`,
      minWidth: 40,
      // align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "density",
      label: "",
      minWidth: 40,
      // align: "right",
      format: (value) => value.toFixed(2),
    },
  ];

  const Signed = data.reduce((count, item) => {
    // If the status is 1, increment the count
    if (item.signerStatus === 2) {
      count++;
    }
    return count;
  }, 0); // Initial count is 0
  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={5}>
                {t("0-common.custom")} [{Signed}/{data.length}]
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="left">Phạm Xuân Khánh Khánh</TableCell>
              <TableCell align="left">Xuân Khánh</TableCell>
              <TableCell align="left">khanhpx@mobile-id.vn</TableCell>
              <TableCell align="left">!</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="left">Phạm Xuân Khánh</TableCell>
              <TableCell align="left">Xuân Khánh</TableCell>
              <TableCell align="left">khanhpx@mobile-id.vn</TableCell>
              <TableCell align="left">!</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
TableField.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  data: PropTypes.array,
  handleClose: PropTypes.func,
};
export default TableField;

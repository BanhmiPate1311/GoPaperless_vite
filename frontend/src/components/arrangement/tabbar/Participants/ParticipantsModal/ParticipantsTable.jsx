/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ReactComponent as VectorIcon } from "@/assets/images/svg/Vector.svg";
import { ReactComponent as PencilSquareIcon } from "@/assets/images/svg/pen-to-square-regular.svg";
import { ReactComponent as PerSonIcon } from "@/assets/images/svg/person_icon.svg";
import { ReactComponent as SignedIcon } from "@/assets/images/svg/signed_icon.svg";
import { ReactComponent as WaitingMySig } from "@/assets/images/svg/waiting_mysig.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { ReactComponent as BarsIcon } from "@/assets/images/svg/bars.svg";
import { ReactComponent as CheckIcon } from "@/assets/images/svg/check.svg";
import { useCommonHook } from "@/hook";
import { checkSignerStatus } from "@/utils/commonFunction";
import styled from "@emotion/styled";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Store } from "@mui/icons-material";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: "none", // Remove uppercase transformation
  fontWeight: theme.typography.fontWeightRegular, // Adjust font weight
  fontSize: theme.typography.pxToRem(14), // Adjust font size
  color: "#3B82F6", // Adjust tab text color
  border: "1px solid #3B82F6",
  textAlign: "center",
  height: "23px",
  minHeight: "23px",
  padding: "0",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: "#3B82F6",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      // style={{ flexGrow: 1, height: "100%" }}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function Row(props) {
  const { row } = props;
  const { index } = props;
  const { signerToken } = useCommonHook();
  console.log("row:", row);
  console.log("index:", index);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const status = checkSignerStatus(row, signerToken);
  const [purpose, setPurpose] = useState("");

  const handleChange = (event) => {
    setPurpose(event.target.value);
  };

  return (
    <>
      <Draggable key={row.id} draggableId={row.id.toString()} index={index}>
        {(provided) => (
          <Fragment

          // style={getItemStyle(
          //   snapshot.isDragging,
          //   provided.draggableProps.style
          // )}
          >
            <TableRow
              className="row-container"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{
                "& > *": { borderBottom: "unset" },
                backgroundColor: open ? "#d9d9d9" : "inherit",
              }}
              ref={provided.innerRef}
            >
              <TableCell component="th" scope="row" sx={{ width: "310px" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BarsIcon />
                  <Typography>{index + 1}</Typography>
                  <PerSonIcon />
                  {/* {tableCheckStatus(item, signerToken)} */}
                  {status === 2 ? (
                    <SignedIcon />
                  ) : status === 1 ? (
                    <WaitingMySig />
                  ) : (
                    <WaitingSig />
                  )}
                  <Typography>
                    {row.lastName} {row.firstName}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="left">{row.firstName}</TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {/* {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
                  {open ? (
                    <>
                      <span
                        style={{
                          marginRight: 16.71,
                          backgroundColor: "#FEF2F2",
                          borderRadius: 999,
                          width: 30,
                          height: 30,
                        }}
                      >
                        <VectorIcon
                          style={{
                            width: 14,
                            height: 14,
                            marginTop: 7,
                          }}
                        />
                      </span>
                      <span
                        style={{
                          backgroundColor: "#F0FDFA",
                          borderRadius: 999,
                          width: 29,
                          height: 30,
                        }}
                      >
                        <CheckIcon
                          style={{
                            width: 17,
                            height: 14,
                            marginTop: 7,
                          }}
                        />
                      </span>
                    </>
                  ) : (
                    <PencilSquareIcon />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={6}
              >
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Stack
                    direction="row"
                    sx={{ margin: 1 }}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    <Box width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.name")}
                      </Typography>
                      <TextField
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                            fontSize: "14px",
                          },
                        }}
                        value={row.lastName + " " + row.firstName}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                    <Box width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.first name")}
                      </Typography>
                      <TextField
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                          },
                        }}
                        value={row.firstName}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                    <Box width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.last name")}
                      </Typography>

                      <TextField
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                          },
                        }}
                        value={row.lastName}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                    <Box pt="5px" width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.Reason")}
                      </Typography>
                      <TextField
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                          },
                        }}
                        value={row.customReason}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                    <Box pt="5px" width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.Position")}
                      </Typography>
                      <TextField
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                          },
                        }}
                        value={row.metaInformation.position}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                    <Box pt="5px" width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.purpose")}
                      </Typography>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                            value={row.metaInformation.signing_purpose}
                          ></InputLabel>
                          <Select
                            sx={{
                              minHeight: "42px",
                              height: "42px",
                              width: "250px",
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={purpose}
                            onChange={handleChange}
                          >
                            <MenuItem value={10}>Signer</MenuItem>
                            <MenuItem value={20}>Revlewer</MenuItem>
                            <MenuItem value={30}>Editor</MenuItem>
                            <MenuItem value={40}>Meeting Host</MenuItem>
                            <MenuItem value={50}>Send a Copy</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      {/* <TextField
                  sx={{
                    my: 0,
                    "& .MuiInputBase-root": {
                      minHeight: "42px",
                      height: "42px",
                      width: "250px",
                    },
                  }}
                  value={row.metaInformation.signing_purpose}
                  id="outlined-size-small"
                  size="small"
                /> */}
                    </Box>
                    <Box pt="5px" width="calc(100% / 3)">
                      <Typography
                        variant="h6"
                        color="#1F2937"
                        fontWeight={600}
                        mb="10px"
                        height={17}
                      >
                        {t("0-common.Structural subdivision")}
                      </Typography>
                      <TextField
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                          },
                        }}
                        value={row.metaInformation.structural_subdivision}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                  </Stack>
                </Collapse>
              </TableCell>
            </TableRow>
          </Fragment>
        )}
      </Draggable>
    </>
  );
}

Row.propTypes = {};

const ParticipantsTable = ({ data }) => {
  console.log("data123: ", data);
  // const { t } = useTranslation();

  // const [open, setOpen] = useState([false]);

  // const columns = [
  //   { id: "stt", label: "#", minWidth: 40 },
  //   {
  //     id: "participants",
  //     label: `${t("0-common.participants")}`,
  //     minWidth: 90,
  //   },
  //   {
  //     id: "name",
  //     label: `${t("0-common.name")}`,
  //     minWidth: 140,
  //     // align: "right",
  //     format: (value) => value.toLocaleString("en-US"),
  //   },
  //   {
  //     id: "email",
  //     label: `${t("0-common.email")}`,
  //     minWidth: 40,
  //     // align: "right",
  //     format: (value) => value.toLocaleString("en-US"),
  //   },
  //   {
  //     id: "density",
  //     label: "",
  //     minWidth: 40,
  //     // align: "right",
  //     format: (value) => value.toFixed(2),
  //   },
  // ];

  // const Signed = data.reduce((count, item) => {
  //   // If the status is 1, increment the count
  //   if (item.signerStatus === 2) {
  //     count++;
  //   }
  //   return count;
  // }, 0); // Initial count is 0

  // const handleClickOpen = (index) => {
  //   const newIsOpen = [...open];
  //   newIsOpen[index] = true;

  //   setOpen(newIsOpen);
  // };
  // const handleClose = (index) => {
  //   const newIsOpen = [...open];
  //   newIsOpen[index] = false;

  //   setOpen(newIsOpen);
  // };

  const [tabValue, setTabValue] = useState(0);
  const [tableData, setTableData] = useState(data);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      tableData,
      result.source.index,
      result.destination.index
    );

    setTableData(items);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div>
      <Tabs
        // orientation="vertical"
        value={tabValue}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          float: "right",
          border: "2px solid #3B82F6",
          borderRadius: "6px",
          height: "23px",
          minHeight: "23px",
          // "& .MuiTabs-root": {
          //   maxHeight: "20px", // Thiết lập chiều cao tối thiểu của tab
          // },
        }}
        TabIndicatorProps={{
          style: { display: "none" },
        }}
      >
        <CustomTab label="Serial"></CustomTab>
        <CustomTab label="Parallel"></CustomTab>
        <CustomTab label="Individual"></CustomTab>
        <CustomTab label="Custom"></CustomTab>
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Participants</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <TableBody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    // component={"div"}
                  >
                    {tableData.map((user, index) => (
                      <Row key={user.id} row={user} index={index} />
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <b>First</b> tab panel
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <b>Second</b> tab panel
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <b>Thirst</b> tab panel
      </TabPanel>
    </div>
  );
};

ParticipantsTable.propTypes = {
  data: PropTypes.array,
};

export default ParticipantsTable;

/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ReactComponent as VectorIcon } from "@/assets/images/svg/Vector.svg";
import { ReactComponent as BarsIcon } from "@/assets/images/svg/bars.svg";
import { ReactComponent as CheckIcon } from "@/assets/images/svg/check.svg";
import { ReactComponent as PencilSquareIcon } from "@/assets/images/svg/pen-to-square-regular.svg";
import { ReactComponent as PerSonIcon } from "@/assets/images/svg/person_icon.svg";
import { ReactComponent as SignedIcon } from "@/assets/images/svg/signed_icon.svg";
import { ReactComponent as WaitingMySig } from "@/assets/images/svg/waiting_mysig.svg";
import { ReactComponent as WaitingSig } from "@/assets/images/svg/waiting_sig.svg";
import { useCommonHook } from "@/hook";
import { checkSignerStatus } from "@/utils/commonFunction";
import styled from "@emotion/styled";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { participantsService } from "@/services/participants_service";
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
import { Fragment, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

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
  const {
    row,
    workFlow,
    index,
    setParticipant,
    updateParticipant,
    participant,
  } = props;
  const { signerToken } = useCommonHook();
  // console.log("workFlow:", workFlow);
  // console.log("row:", row);
  const queryClient = useQueryClient();
  // console.log("index:", index);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [process, setProcess] = useState(false);
  const status = checkSignerStatus(row, signerToken);
  const [purpose, setPurpose] = useState("");
  // Tạo state để lưu giá trị của TextField
  const [fullName, setFullName] = useState(row.lastName + " " + row.firstName);
  const [firstName, setFirstName] = useState(row.firstName);
  const [lastName, setLastName] = useState(row.lastName);
  const [customReason, setCustomReason] = useState(row.customReason);
  const [position, setPosition] = useState(row.metaInformation.position);
  const [signingPurpose, setSigningPurpose] = useState(
    row.metaInformation.signing_purpose
  );
  const [structuralSubdivision, setStructuralSubdivision] = useState(
    row.metaInformation.structural_subdivision
  );
  // console.log("index: ", index);
  const [data, setData] = useState({
    fullName: row.lastName + " " + row.firstName,
    firstName: row.firstName,
    lastName: row.lastName,
    customReason: row.customReason,
    position: row.metaInformation.position,
    signingPurpose: row.metaInformation.signing_purpose,
    structuralSubdivision: row.metaInformation.structural_subdivision,
    metaInformation: JSON.stringify(row.metaInformation),
    signerToken: row.signerToken,
    sequenceNumber: index + 1,
  });
  // console.log("data:", data);

  useEffect(() => {
    setData({ ...data, sequenceNumber: index + 1 });
  }, [index]);

  const [metaInformation, setMetaInformation] = useState(
    JSON.stringify(row.metaInformation)
  );

  useEffect(() => {
    let reparticipant = participant;
    reparticipant[index] = data;
    // console.log(reparticipant);
    setParticipant(reparticipant);
  }, [data]);
  // console.log("data", data);
  useEffect(() => {
    // setParticipant({
    //   fullName: row.lastName + " " + row.firstName,
    //   firstName: row.firstName,
    //   lastName: row.lastName,
    //   customReason: row.customReason,
    //   position: row.metaInformation.position,
    //   signingPurpose: row.metaInformation.signing_purpose,
    //   structuralSubdivision: row.metaInformation.structural_subdivision,
    // });
    // setFullName(row.lastName + " " + row.firstName);
    // setFirstName(row.firstName);
    // setLastName(row.lastName);
    // setCustomReason(row.customReason);
    // setPosition(row.metaInformation.position);
    // setSigningPurpose(row.metaInformation.signing_purpose);
    // setStructuralSubdivision(row.metaInformation.structural_subdivision);
  }, [row]);

  //
  const handleChangeParticipant = (event, key) => {
    switch (key) {
      case "fullName":
        setData({ ...data, fullName: event.target.value });
        break;
      case "firstName":
        setData({ ...data, firstName: event.target.value });
        break;
      case "lastName":
        setData({ ...data, lastName: event.target.value });
        break;
      case "customReason":
        setData({ ...data, customReason: event.target.value });
        break;
      case "position":
        setData({ ...data, position: event.target.value });
        break;
      case "signingPurpose":
        setData({ ...data, signingPurpose: event.target.value });
        break;
      case "structuralSubdivision":
        setData({ ...data, structuralSubdivision: event.target.value });
        break;
    }
  };
  console.log(data);

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
                  <PerSonIcon style={{ borderRadius: 999 }} />
                  {/* {tableCheckStatus(item, signerToken)} */}
                  {status === 2 ? (
                    <SignedIcon />
                  ) : status === 1 ? (
                    <WaitingMySig />
                  ) : (
                    <WaitingSig />
                  )}
                  <Typography style={{ width: "190.482px" }}>
                    {row.lastName} {row.firstName}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="left">{row.firstName}</TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={() => setOpen(!open)}
                >
                  {open ? (
                    <span
                      onClick={() => setOpen(!open)}
                      style={{
                        backgroundColor: "#FEF2F2",
                        borderRadius: 999,
                        width: 30,
                        height: 30,
                        display: open ? "block" : "none",
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
                  ) : (
                    <PencilSquareIcon

                    // style={{
                    //   display: open ? "none" : "block",
                    // }}
                    />
                  )}
                </IconButton>
                <IconButton
                  aria-label="expand row"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={() => updateParticipant(data)}
                >
                  {open ? (
                    <span
                      style={{
                        backgroundColor: "#F0FDFA",
                        borderRadius: 999,
                        width: 29,
                        height: 30,
                        display: open ? "block" : "none",
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
                  ) : (
                    ""
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
                        style={{}}
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "42px",
                            height: "42px",
                            width: "250px",
                            fontSize: "14px",
                            backgroundColor: "#E7E7E7", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
                          },
                        }}
                        disabled
                        value={data.fullName}
                        onChange={(event) =>
                          handleChangeParticipant(event, "fullname")
                        }
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
                        value={data.firstName}
                        onChange={(event) =>
                          handleChangeParticipant(event, "firstName")
                        }
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
                        value={data.lastName}
                        onChange={(event) =>
                          handleChangeParticipant(event, "lastName")
                        }
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
                        value={data.customReason}
                        onChange={(event) =>
                          handleChangeParticipant(event, "customReason")
                        }
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
                        value={data.position}
                        onChange={(event) =>
                          handleChangeParticipant(event, "position")
                        }
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
                            value={data.signingPurpose}
                            onChange={(event) =>
                              handleChangeParticipant(event, "signingPurpose")
                            }
                          ></InputLabel>
                          <Select
                            sx={{
                              minHeight: "42px",
                              height: "42px",
                              width: "250px",
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={signingPurpose}
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
                        value={data.structuralSubdivision}
                        onChange={(event) =>
                          handleChangeParticipant(
                            event,
                            "structuralSubdivision"
                          )
                        }
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

const ParticipantsTable = ({
  data,
  workFlow,
  setParticipant,
  updateParticipant,
  participant,
}) => {
  // console.log("data123: ", data);
  // console.log("workFlow: ", workFlow);

  const [tableData, setTableData] = useState(data);
  console.log(
    "tableData: "
    // tableData.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  );

  const handleWorkFlow = (value) => {
    switch (value) {
      case "serial":
        return 0;
      case "parallel":
        return 1;
      case "individual":
        return 2;
      case "custom":
        return 3;
      default:
        return 0;
    }
  };

  const [tabValue, setTabValue] = useState(
    handleWorkFlow(workFlow.workflowProcessType)
  );

  useEffect(() => {
    setTableData(data);
  }, [workFlow]);

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
    let arr = [];
    items.map((value, index) => {
      arr.push({ ...value, sequenceNumber: index + 1 });
    });
    console.log("items: ", arr);
    setTableData(arr);
  };

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState("");

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
                    {tableData
                      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                      .map((user, index) => (
                        ////////========== SERIAL ==========/////////
                        <Row
                          key={user.id}
                          row={user}
                          index={index}
                          workFlow={workFlow}
                          setParticipant={setParticipant}
                          updateParticipant={updateParticipant}
                          participant={participant}
                        />
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
                      ////////========= PARALLEL =========/////////
                      <Draggable
                        key={user.id}
                        draggableId={user.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Fragment>
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
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{ width: "310px" }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <PerSonIcon style={{ borderRadius: 999 }} />
                                  {status === 2 ? (
                                    <SignedIcon />
                                  ) : status === 1 ? (
                                    <WaitingMySig />
                                  ) : (
                                    <WaitingSig />
                                  )}
                                  <Typography style={{ width: "190.482px" }}>
                                    {user.lastName} {user.firstName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                {user.firstName}
                              </TableCell>
                              <TableCell align="left">{user.email}</TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                >
                                  <span
                                    onClick={() => setOpen(!open)}
                                    style={{
                                      marginRight: 16.71,
                                      backgroundColor: "#FEF2F2",
                                      borderRadius: 999,
                                      width: 30,
                                      height: 30,
                                      display: open ? "block" : "none",
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
                                      display: open ? "block" : "none",
                                    }}
                                  >
                                    <CheckIcon
                                      onClick={() => updateParticipant(user)}
                                      style={{
                                        width: 17,
                                        height: 14,
                                        marginTop: 7,
                                      }}
                                    />
                                  </span>
                                  <PencilSquareIcon
                                    onClick={() => setOpen(!open)}
                                    style={{
                                      display: open ? "none" : "block",
                                    }}
                                  />
                                </IconButton>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={6}
                              >
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
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
                                        value={
                                          user.lastName + " " + user.firstName
                                        }
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
                                        value={user.firstName}
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
                                        value={user.lastName}
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
                                        value={user.customReason}
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
                                        value={user.metaInformation.position}
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
                                            value={
                                              user.metaInformation
                                                .signing_purpose
                                            }
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
                                            <MenuItem value={10}>
                                              Signer
                                            </MenuItem>
                                            <MenuItem value={20}>
                                              Revlewer
                                            </MenuItem>
                                            <MenuItem value={30}>
                                              Editor
                                            </MenuItem>
                                            <MenuItem value={40}>
                                              Meeting Host
                                            </MenuItem>
                                            <MenuItem value={50}>
                                              Send a Copy
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Box>
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
                                        value={
                                          user.metaInformation
                                            .structural_subdivision
                                        }
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
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
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
                      ///////==========INDIVIDUAL==========///////
                      <Draggable
                        key={user.id}
                        draggableId={user.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Fragment>
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
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{ width: "310px" }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <PerSonIcon style={{ borderRadius: 999 }} />
                                  {status === 2 ? (
                                    <SignedIcon />
                                  ) : status === 1 ? (
                                    <WaitingMySig />
                                  ) : (
                                    <WaitingSig />
                                  )}
                                  <Typography style={{ width: "190.482px" }}>
                                    {user.lastName} {user.firstName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                {user.firstName}
                              </TableCell>
                              <TableCell align="left">{user.email}</TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                >
                                  <span
                                    onClick={() => setOpen(!open)}
                                    style={{
                                      marginRight: 16.71,
                                      backgroundColor: "#FEF2F2",
                                      borderRadius: 999,
                                      width: 30,
                                      height: 30,
                                      display: open ? "block" : "none",
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
                                      display: open ? "block" : "none",
                                    }}
                                  >
                                    <CheckIcon
                                      onClick={() => updateParticipant(user)}
                                      style={{
                                        width: 17,
                                        height: 14,
                                        marginTop: 7,
                                      }}
                                    />
                                  </span>
                                  <PencilSquareIcon
                                    onClick={() => setOpen(!open)}
                                    style={{
                                      display: open ? "none" : "block",
                                    }}
                                  />
                                </IconButton>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={6}
                              >
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
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
                                        value={
                                          user.lastName + " " + user.firstName
                                        }
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
                                        value={user.firstName}
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
                                        value={user.lastName}
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
                                        value={user.customReason}
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
                                        value={user.metaInformation.position}
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
                                            value={
                                              user.metaInformation
                                                .signing_purpose
                                            }
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
                                            <MenuItem value={10}>
                                              Signer
                                            </MenuItem>
                                            <MenuItem value={20}>
                                              Revlewer
                                            </MenuItem>
                                            <MenuItem value={30}>
                                              Editor
                                            </MenuItem>
                                            <MenuItem value={40}>
                                              Meeting Host
                                            </MenuItem>
                                            <MenuItem value={50}>
                                              Send a Copy
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Box>
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
                                        value={
                                          user.metaInformation
                                            .structural_subdivision
                                        }
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
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
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
                      ////////===========CUSTOM===========////////
                      <Draggable
                        key={user.id}
                        draggableId={user.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Fragment>
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
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{ width: "310px" }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <BarsIcon />
                                  <Typography>{index + 1}</Typography>
                                  <PerSonIcon style={{ borderRadius: 999 }} />
                                  {status === 2 ? (
                                    <SignedIcon />
                                  ) : status === 1 ? (
                                    <WaitingMySig />
                                  ) : (
                                    <WaitingSig />
                                  )}
                                  <Typography style={{ width: "190.482px" }}>
                                    {user.lastName} {user.firstName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                {user.firstName}
                              </TableCell>
                              <TableCell align="left">{user.email}</TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                >
                                  <span
                                    onClick={() => setOpen(!open)}
                                    style={{
                                      marginRight: 16.71,
                                      backgroundColor: "#FEF2F2",
                                      borderRadius: 999,
                                      width: 30,
                                      height: 30,
                                      display: open ? "block" : "none",
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
                                      display: open ? "block" : "none",
                                    }}
                                  >
                                    <CheckIcon
                                      onClick={() => updateParticipant(user)}
                                      style={{
                                        width: 17,
                                        height: 14,
                                        marginTop: 7,
                                      }}
                                    />
                                  </span>
                                  <PencilSquareIcon
                                    onClick={() => setOpen(!open)}
                                    style={{
                                      display: open ? "none" : "block",
                                    }}
                                  />
                                </IconButton>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={6}
                              >
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
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
                                        value={
                                          user.lastName + " " + user.firstName
                                        }
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
                                        value={user.firstName}
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
                                        value={user.lastName}
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
                                        value={user.customReason}
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
                                        value={user.metaInformation.position}
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
                                            value={
                                              user.metaInformation
                                                .signing_purpose
                                            }
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
                                            <MenuItem value={10}>
                                              Signer
                                            </MenuItem>
                                            <MenuItem value={20}>
                                              Revlewer
                                            </MenuItem>
                                            <MenuItem value={30}>
                                              Editor
                                            </MenuItem>
                                            <MenuItem value={40}>
                                              Meeting Host
                                            </MenuItem>
                                            <MenuItem value={50}>
                                              Send a Copy
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Box>
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
                                        value={
                                          user.metaInformation
                                            .structural_subdivision
                                        }
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
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
      </TabPanel>
    </div>
  );
};

ParticipantsTable.propTypes = {
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default ParticipantsTable;
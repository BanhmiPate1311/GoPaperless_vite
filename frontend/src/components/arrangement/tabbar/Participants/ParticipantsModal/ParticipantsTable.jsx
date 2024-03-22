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
import { ReactComponent as Signer } from "@/assets/images/svg/person-edit.svg";
import { ReactComponent as Reviewer } from "@/assets/images/svg/person-check.svg";
import { ReactComponent as Editor } from "@/assets/images/svg/note-edit-outline.svg";
import { ReactComponent as MeetingHost } from "@/assets/images/svg/person-star.svg";
import { ReactComponent as SendACopy } from "@/assets/images/svg/cc-outline.svg";
import { ReactComponent as AngleDown } from "@/assets/images/svg/angle-down-solid.svg";
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
  // border: "1px solid #3B82F6",
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
    typeWorkflow,
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

  const [data, setData] = useState({
    fullName: row.lastName + " " + row.firstName,
    firstName: row.firstName,
    lastName: row.lastName,
    customReason: row.customReason,
    position: row.metaInformation.position,
    signingPurpose: row.metaInformation.signing_purpose,
    purpose: row.signerType,
    structuralSubdivision: row.metaInformation.structural_subdivision,
    // metaInformation: JSON.stringify(row.metaInformation),
    metaInformation: {
      position: row.metaInformation.position,
      structuralSubdivision: row.metaInformation.structuralSubdivision,
    },
    signerToken: row.signerToken,
    sequenceNumber: row.sequenceNumber === 0 ? 1 : row.sequenceNumber,
    signingToken: workFlow.signingToken,
    workflowProcessType: typeWorkflow,
  });
  console.log("row:", row);
  console.log("data:", data);

  useEffect(() => {
    if (typeWorkflow === "serial") {
      setData({ ...data, sequenceNumber: index + 1 });
    }
    if (typeWorkflow === "custom") {
      setData({
        ...data,
        sequenceNumber: row.sequenceNumber === 0 ? 1 : row.sequenceNumber,
      });
    }
  }, [index]);

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
      case "purpose":
        setData({ ...data, purpose: event.target.value });
        break;
      case "structuralSubdivision":
        setData({ ...data, structuralSubdivision: event.target.value });
        break;
      case "metaInformationPosition":
        console.log({
          ...data,
          metaInformation: {
            ...data.metaInformation,
            position: event.target.value,
          },
        });
        setData({
          ...data,
          metaInformation: {
            ...data.metaInformation,
            position: event.target.value,
          },
        });
        break;
      case "metaInformationStructuralSubdivision":
        setData({
          ...data,
          metaInformation: {
            ...data.metaInformation,
            structuralSubdivision: event.target.value,
          },
        });
        break;
      case "sequenceNumber":
        console.log("event.target.value: ", event.target.value);
        // Kiểm tra xem giá trị nhập vào có phải là số không
        if (!isNaN(event.target.value)) {
          // Nếu là số, kiểm tra xem có đúng 3 chữ số không
          if (event.target.value.length <= 3) {
            // Nếu có tối đa 3 chữ số, thực hiện cập nhật giá trị
            setData({ ...data, sequenceNumber: event.target.value });
            console.log("data.sequenceNumber: ", data.sequenceNumber);
          } else {
            // Nếu có hơn 3 chữ số, hiển thị thông báo lỗi
            console.log("Vui lòng nhập số có tối đa 3 chữ số!!!");
            // alert("Vui lòng nhập số có tối đa 3 chữ số!!!");
          }
        } else {
          // Nếu không phải là số, không thực hiện gì cả hoặc có thể hiển thị thông báo lỗi
          console.log("Vui lòng nhập số!!!");
          // alert("Vui lòng nhập số!!!");
        }
        break;
    }
  };
  console.log(data);

  // const handleChange = (event) => {
  //   setPurpose(event.target.value);
  // };

  if (typeWorkflow === "parallel" || typeWorkflow === "individual") {
    return (
      <Fragment

      // style={getItemStyle(
      //   snapshot.isDragging,
      //   provided.draggableProps.style
      // )}
      >
        <TableRow
          className="row-container"
          sx={{
            "& > *": { borderBottom: "unset" },
            backgroundColor: open ? "#DBEAFE" : "#FFFFFF",
            borderRadius: "8px",
          }}
        >
          <TableCell
            component="th"
            scope="row"
            sx={{
              width: "310px",
              borderBottom: "none",
              borderRadius: "10px 0px 0px 10px",
              padding: "0px 0px 0px 16px",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {typeWorkflow === "serial" && (
                <>
                  <BarsIcon />
                  <Typography>{index + 1}</Typography>
                </>
              )}
              {typeWorkflow === "custom" && (
                <>
                  <BarsIcon />
                  <TextField
                    style={{}}
                    sx={{
                      my: 0,
                      "& input #outlined-size-small": {
                        padding: "0px",
                        textAlign: "center",
                      },
                      "& .MuiInputBase-root": {
                        minHeight: "36px",
                        height: "36px",
                        width: "38px",
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                        color: "#1F2937",
                        padding: "0px",
                      },
                    }}
                    value={
                      data.sequenceNumber == null ||
                      data.sequenceNumber === "" ||
                      data.sequenceNumber == 0
                        ? data.sequenceNumber
                        : 1
                    }
                    onChange={(event) =>
                      handleChangeParticipant(event, "sequenceNumber")
                    }
                    // id="outlined-size-small"
                    // size="small"
                  />
                </>
              )}

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
          <TableCell align="left" style={{ padding: "0px 0px 0px 0px" }}>
            {row.firstName}
          </TableCell>
          <TableCell
            style={{ width: "250px", padding: "0px 0px 0px 0px" }}
            align="left"
          >
            {row.email}
          </TableCell>
          <TableCell
            style={{
              borderBottom: "none",
              borderRadius: "0px 10px 10px 0px",
              padding: "0px 0px 0px 0px",
            }}
          >
            <IconButton
              aria-label="expand row"
              variant="plain"
              color="neutral"
              size="sm"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <span
                  // onClick={() => setOpen(!open)}
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
                <span
                  style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: 999,
                    width: 30,
                    height: 30,
                  }}
                >
                  <PencilSquareIcon
                    style={{
                      width: 14,
                      height: 14,
                      marginTop: 7,
                    }}
                  />
                </span>
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
            style={{
              padding: 0,
              borderBottom: "none",
              textAlign: "center",
            }}
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
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
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
                    defaultValue={data.fullName}
                    onChange={(event) =>
                      handleChangeParticipant(event, "fullname")
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                  />
                </Box>
                <Box width="calc(100% / 3)">
                  <Typography
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
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
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                        color: "#1F2937",
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
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
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
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                        color: "#1F2937",
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
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
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
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                        color: "#1F2937",
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
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
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
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                        color: "#1F2937",
                      },
                    }}
                    value={data.metaInformation.position}
                    onChange={(event) =>
                      handleChangeParticipant(event, "metaInformationPosition")
                    }
                    id="outlined-size-small"
                    size="small"
                  />
                </Box>
                <Box pt="5px" width="calc(100% / 3)">
                  <Typography
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
                  >
                    {t("0-common.purpose")}
                  </Typography>
                  <Box sx={{ minWidth: 120, paddingLeft: "20px" }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        value={data.purpose}
                        // onChange={(event) =>
                        //   handleChangeParticipant(event, "purpose")
                        // }
                      ></InputLabel>
                      <Select
                        sx={{
                          minHeight: "42px",
                          height: "42px",
                          width: "250px",
                          fontSize: "14px",
                          backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                          color: "#1F2937",
                          textAlign: "left",
                          paddingLeft: "2px",
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={data.purpose}
                        onChange={(event) =>
                          handleChangeParticipant(event, "purpose")
                        }
                      >
                        <MenuItem value={1}>
                          <Signer style={{ width: "16px", height: "16px" }} />
                          <span
                            style={{
                              paddingLeft: "12px",
                              fontSize: "14px",
                            }}
                          >
                            Signer
                          </span>
                        </MenuItem>
                        <MenuItem value={2}>
                          <Reviewer style={{ width: "16px", height: "16px" }} />
                          <span
                            style={{
                              paddingLeft: "12px",
                              fontSize: "14px",
                            }}
                          >
                            Reviewer
                          </span>
                        </MenuItem>
                        <MenuItem value={3}>
                          <Editor style={{ width: "16px", height: "16px" }} />
                          <span
                            style={{
                              paddingLeft: "12px",
                              fontSize: "14px",
                            }}
                          >
                            Editor
                          </span>
                        </MenuItem>
                        <MenuItem value={4}>
                          <MeetingHost
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span
                            style={{
                              paddingLeft: "12px",
                              fontSize: "14px",
                            }}
                          >
                            Meeting Host
                          </span>
                        </MenuItem>
                        <MenuItem value={5}>
                          <SendACopy
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span
                            style={{
                              paddingLeft: "12px",
                              fontSize: "14px",
                            }}
                          >
                            Send a Copy
                          </span>
                        </MenuItem>
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
                    fontSize={14}
                    color="#757575"
                    fontWeight={400}
                    mb="10px"
                    height={17}
                    textAlign="left"
                    paddingLeft={3}
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
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                        color: "#1F2937",
                      },
                    }}
                    value={data.metaInformation.structuralSubdivision}
                    onChange={(event) =>
                      handleChangeParticipant(
                        event,
                        "metaInformationStructuralSubdivision"
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
    );
  }

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
                background: open ? "#DBEAFE" : "#FFFFFF",
                borderRadius: "8px",
              }}
              ref={provided.innerRef}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{
                  width: "310px",
                  borderBottom: "none",
                  borderRadius: "10px 0px 0px 10px",
                  padding: "0px 0px 0px 16px",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {typeWorkflow === "serial" && (
                    <>
                      <BarsIcon />
                      <Typography>{index + 1}</Typography>
                    </>
                  )}
                  {typeWorkflow === "custom" && (
                    <>
                      <BarsIcon />
                      <TextField
                        style={{}}
                        sx={{
                          my: 0,
                          "& .MuiInputBase-root": {
                            minHeight: "36px",
                            height: "36px",
                            width: "38px",
                            fontSize: "14px",
                            backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "0px",
                            textAlign: "center",
                          },
                        }}
                        value={data.sequenceNumber}
                        onChange={(event) =>
                          handleChangeParticipant(event, "sequenceNumber")
                        }
                        id="outlined-size-small"
                        size="small"
                        inputProps={{
                          inputMode: "numeric", // chỉ cho phép nhập số
                          pattern: "[0-9]*", // chỉ cho phép các ký tự số
                        }}
                      />
                    </>
                  )}

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
              <TableCell
                align="left"
                style={{
                  borderBottom: "none",
                  padding: "0px 0px 0px 0px",
                  minWidth: "150px",
                }}
              >
                {row.firstName}
              </TableCell>
              <TableCell
                style={{
                  width: "250px",
                  borderBottom: "none",
                  padding: "0px 0px 0px 0px",
                }}
                align="left"
              >
                {row.email}
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                  borderRadius: "0px 10px 10px 0px",
                  padding: "0px 0px 0px 0px",
                }}
              >
                <IconButton
                  aria-label="expand row"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={() => setOpen(!open)}
                >
                  {open ? (
                    <span
                      // onClick={() => setOpen(!open)}
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
                    <span
                      style={{
                        backgroundColor: "#EFF6FF",
                        borderRadius: 999,
                        width: 30,
                        height: 30,
                      }}
                    >
                      <PencilSquareIcon
                        style={{
                          width: 14,
                          height: 14,
                          marginTop: 7,
                        }}
                      />
                    </span>
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
                style={{
                  padding: 0,
                  borderBottom: "none",
                }}
                colSpan={6}
              >
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Stack
                    direction="row"
                    sx={{ margin: 1, textAlign: "center" }}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    <Box width="calc(100% / 3)">
                      <Typography
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
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
                            backgroundColor: "#E7E7E7", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
                          },
                        }}
                        defaultValue={data.fullName}
                        onChange={(event) =>
                          handleChangeParticipant(event, "fullname")
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        id="outlined-read-only-input"
                        size="small"
                      />
                    </Box>
                    <Box width="calc(100% / 3)">
                      <Typography
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
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
                            backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
                          },
                        }}
                        id="custom-css-outlined-input"
                        size="small"
                        value={data.firstName}
                        onChange={(event) =>
                          handleChangeParticipant(event, "firstName")
                        }
                      />
                    </Box>
                    <Box width="calc(100% / 3)">
                      <Typography
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
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
                            backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
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
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
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
                            backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
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
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
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
                            backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
                          },
                        }}
                        value={data.metaInformation.position}
                        onChange={(event) =>
                          handleChangeParticipant(
                            event,
                            "metaInformationPosition"
                          )
                        }
                        id="outlined-size-small"
                        size="small"
                      />
                    </Box>
                    <Box pt="5px" width="calc(100% / 3)">
                      <Typography
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
                      >
                        {t("0-common.purpose")}
                      </Typography>
                      <Box sx={{ minWidth: 120, paddingLeft: "20px" }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                            value={data.purpose}
                            // onChange={(event) =>
                            //   handleChangeParticipant(event, "purpose")
                            // }
                          ></InputLabel>
                          <Select
                            sx={{
                              minHeight: "42px",
                              height: "42px",
                              width: "250px",
                              backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                              color: "#1F2937",
                              textAlign: "left",
                              paddingLeft: "2px",
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={data.purpose}
                            onChange={(event) =>
                              handleChangeParticipant(event, "purpose")
                            }
                          >
                            <MenuItem value={1}>
                              <Signer
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{
                                  paddingLeft: "12px",
                                  fontSize: "14px",
                                }}
                              >
                                Signer
                              </span>
                            </MenuItem>
                            <MenuItem value={2}>
                              <Reviewer
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{
                                  paddingLeft: "12px",
                                  fontSize: "14px",
                                }}
                              >
                                Reviewer
                              </span>
                            </MenuItem>
                            <MenuItem value={3}>
                              <Editor
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{
                                  paddingLeft: "12px",
                                  fontSize: "14px",
                                }}
                              >
                                Editor
                              </span>
                            </MenuItem>
                            <MenuItem value={4}>
                              <MeetingHost
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{
                                  paddingLeft: "12px",
                                  fontSize: "14px",
                                }}
                              >
                                Meeting Host
                              </span>
                            </MenuItem>
                            <MenuItem value={5}>
                              <SendACopy
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{
                                  paddingLeft: "12px",
                                  fontSize: "14px",
                                }}
                              >
                                Send a Copy
                              </span>
                            </MenuItem>
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
                        fontSize={14}
                        color="#757575"
                        fontWeight={400}
                        mb="10px"
                        height={17}
                        textAlign="left"
                        paddingLeft={3}
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
                            backgroundColor: "#FFFFFF", // Màu nền khi vô hiệu hóa
                            color: "#1F2937",
                          },
                        }}
                        value={data.metaInformation.structuralSubdivision}
                        onChange={(event) =>
                          handleChangeParticipant(
                            event,
                            "metaInformationStructuralSubdivision"
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
  // const [purpose, setPurpose] = useState("");

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
          // border: "2px solid #3B82F6",
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
        <CustomTab
          style={{
            borderBottom: "2px solid #3B82F6",
            borderTop: "2px solid #3B82F6",
            borderRight: "2px solid #3B82F6",
            borderLeft: "2px solid #3B82F6",
            borderRadius: "6px 0px 0px 6px",
            paddingTop: "1.5px",
          }}
          label="Serial"
        ></CustomTab>
        <CustomTab
          style={{
            borderBottom: "2px solid #3B82F6",
            borderTop: "2px solid #3B82F6",
            borderRight: "2px solid #3B82F6",
            paddingTop: "1.5px",
          }}
          label="Parallel"
        ></CustomTab>
        <CustomTab
          style={{
            borderBottom: "2px solid #3B82F6",
            borderTop: "2px solid #3B82F6",
            borderRight: "2px solid #3B82F6",
            paddingTop: "1.5px",
          }}
          label="Individual"
        ></CustomTab>
        <CustomTab
          style={{
            borderBottom: "2px solid #3B82F6",
            borderTop: "2px solid #3B82F6",
            borderRight: "2px solid #3B82F6",
            borderRadius: "0px 6px 6px 0px",
            paddingTop: "1.5px",
          }}
          label="Custom"
        ></CustomTab>
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <TableContainer
          component={Paper}
          sx={{
            background: "none",
            borderRadius: "none",
            boxShadow: "none",
          }}
        >
          <Table
            aria-label="collapsible table"
            sx={{
              "&.MuiTable-root": {
                borderSpacing: "0 10px",
                borderCollapse: "separate",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ paddingLeft: "55px" }}>
                  Participants
                </TableCell>
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
                          typeWorkflow="serial"
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
        <TableContainer
          component={Paper}
          sx={{
            background: "none",
            borderRadius: "none",
            boxShadow: "none",
          }}
        >
          <Table
            aria-label="collapsible table"
            sx={{
              "&.MuiTable-root": {
                borderSpacing: "0 10px",
                borderCollapse: "separate",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "#475569", fontSize: "16px" }}>
                  Participants
                </TableCell>
                <TableCell
                  style={{ color: "#475569", fontSize: "16px" }}
                  align="left"
                >
                  Name
                </TableCell>
                <TableCell
                  style={{ color: "#475569", fontSize: "16px" }}
                  align="left"
                >
                  Email
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            {/* {(provided) => ( */}
            <TableBody
            // ref={provided.innerRef}
            // {...provided.droppableProps}
            // component={"div"}
            >
              {tableData
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                .map((user, index) => (
                  ////////========== PARALLEL ==========/////////
                  <Row
                    key={user.id}
                    row={user}
                    index={index}
                    workFlow={workFlow}
                    setParticipant={setParticipant}
                    updateParticipant={updateParticipant}
                    participant={participant}
                    typeWorkflow="parallel"
                  />
                ))}
              {/* {provided.placeholder} */}
            </TableBody>
            {/* )} */}
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TableContainer
          component={Paper}
          sx={{
            background: "none",
            borderRadius: "none",
            boxShadow: "none",
          }}
        >
          <Table
            aria-label="collapsible table"
            sx={{
              "&.MuiTable-root": {
                borderSpacing: "0 10px",
                borderCollapse: "separate",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Participants</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody
            // ref={provided.innerRef}
            // {...provided.droppableProps}
            // component={"div"}
            >
              {tableData
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
                .map((user, index) => (
                  ////////========== INDIVIDUAL ==========/////////
                  <Row
                    key={user.id}
                    row={user}
                    index={index}
                    workFlow={workFlow}
                    setParticipant={setParticipant}
                    updateParticipant={updateParticipant}
                    participant={participant}
                    typeWorkflow="individual"
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <TableContainer
          component={Paper}
          sx={{
            background: "none",
            borderRadius: "none",
            boxShadow: "none",
          }}
        >
          <Table
            aria-label="collapsible table"
            sx={{
              "&.MuiTable-root": {
                borderSpacing: "0 10px",
                borderCollapse: "separate",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ paddingLeft: "85px" }}>
                  Participants
                </TableCell>
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
                        ////////========== CUSTOM ==========/////////
                        <Row
                          key={user.id}
                          row={user}
                          index={index}
                          workFlow={workFlow}
                          setParticipant={setParticipant}
                          updateParticipant={updateParticipant}
                          participant={participant}
                          typeWorkflow="custom"
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
    </div>
  );
};

ParticipantsTable.propTypes = {
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default ParticipantsTable;

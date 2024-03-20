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
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";

const DocumentsTable = ({
  data,
  workFlow,
  setParticipant,
  updateParticipant,
  participant,
}) => {
  // const [tableData, setTableData] = useState(data);
  // console.log("tableData: ");

  // const handleWorkFlow = (value) => {
  //   switch (value) {
  //     case "serial":
  //       return 0;
  //     case "parallel":
  //       return 1;
  //     case "individual":
  //       return 2;
  //     case "custom":
  //       return 3;
  //     default:
  //       return 0;
  //   }
  // };

  // const [tabValue, setTabValue] = useState(
  //   handleWorkFlow(workFlow.workflowProcessType)
  // );

  // useEffect(() => {
  //   setTableData(data);
  // }, [workFlow]);

  const { t } = useTranslation();
  // const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div>
      <Typography variant="h6" fontWeight="bold" pt={1}>
        Set signing deadline
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateTimePicker"]}>
          <DateTimePicker label="Basic date time picker" />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

DocumentsTable.propTypes = {
  data: PropTypes.array,
  handleClose: PropTypes.func,
};

export default DocumentsTable;

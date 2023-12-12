import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { ReactComponent as ParticipantIcon } from "@/assets/images/svg/participant.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OverView } from "./OverView";
import { Participant } from "./Participant";
import { Signatures } from "./Signatures";
import { Seals } from "./Seals";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ flexGrow: 1 }}
      {...other}
    >
      {value === index && (
        <Box>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

// eslint-disable-next-line react/prop-types
export const TabBar = ({ workFlow, signedInfo }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  // const participantsList = workFlow.participants.filter(
  //   (item) => item.signerId !== ""
  // );

  //1: signature, 3: seal
  const eSealList = signedInfo?.filter(
    (sig) => sig.ppl_file_attr_type_id === 1
  );

  const eSealList2 = signedInfo?.filter(
    (sig) => sig.ppl_file_attr_type_id === 3
  );

  // console.log("eSealList2: ", eSealList2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        flexDirection: "row-reverse",
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
        borderRadius: "5px",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderLeft: 1,
          borderColor: "divider",
          width: "130px",
          ".Mui-selected": {
            backgroundColor: "signingBackground.main",
            borderRadius: "10px",
          },
          ".MuiTab-root ": {
            textTransform: "none",
            // wordWrap: "break-word",
          },
          p: 1,
          textTransform: "capitalize",
        }}
        // TabIndicatorProps={{
        //   sx: {
        //     left: 0,
        //   },
        // }}
        TabIndicatorProps={{
          style: { display: "none" },
        }}
      >
        <Tab
          label={t("0-common.overview")}
          icon={
            <SvgIcon color="inherit">
              <OverviewIcon />
            </SvgIcon>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={t("0-common.participants")}
          icon={
            <SvgIcon color="inherit">
              <ParticipantIcon />
            </SvgIcon>
          }
          {...a11yProps(1)}
        />
        <Tab
          label={t("0-common.signatures")}
          icon={
            <SvgIcon color="inherit">
              <SignatureIcon />
            </SvgIcon>
          }
          {...a11yProps(2)}
        />
        <Tab
          label={t("0-common.seals")}
          icon={
            <SvgIcon color="inherit">
              <SealIcon />
            </SvgIcon>
          }
          {...a11yProps(3)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <OverView workFlow={workFlow} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Participant
          participantsList={workFlow.participants}
          signType="Signature"
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Signatures signedInfo={eSealList} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* <Participant
          participantsList={eSealList}
          eSealList2={eSealList2}
          signType="eSeal"
        /> */}
        <Seals signedInfo={eSealList2} />
        {/* <Signatures signedInfo={eSealList2} /> */}
      </TabPanel>
    </Box>
  );
};
TabBar.propTypes = {
  workFlow: PropTypes.object,
  signedInfo: PropTypes.array,
};
export default TabBar;

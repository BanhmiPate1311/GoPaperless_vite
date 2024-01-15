import { ReactComponent as OverviewIcon } from "@/assets/images/svg/overview.svg";
import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, Tab, Tabs } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Details from "./Details";
import Overview from "./Overview";
import Signatures from "./Signatures";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactComponent as Lock } from "@/assets/images/validation/lock_validate.svg";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "392px" }}
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

export const TabDocument = ({ validFile }) => {
  // console.log("validFile: ", validFile);
  const [sigList, setSigList] = useState([]);
  const [eSealList, setESealList] = useState([]);
  const { t } = useTranslation();

  // const sigList = fileDetail
  //   ?.map((sig) => {
  //     if (sig.ppl_file_attr_type_id === 1) {
  //       return sig.value;
  //     }
  //   })
  //   .filter((value) => value !== undefined);

  useEffect(() => {
    if (Object.keys(validFile).length > 0) {
      setSigList(validFile.signatures);
      setESealList(validFile.seals);
    }
  }, [validFile]);

  // const sigList = validFile.signatures;
  console.log("sigList: ", sigList);

  // const eSealList = fileDetail
  //   ?.map((sig) => {
  //     if (sig.ppl_file_attr_type_id === 3) {
  //       return sig.value;
  //     }
  //   })
  //   .filter((value) => value !== undefined);
  // const eSealList = validFile.seals;
  console.log("sigList: ", eSealList);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // useEffect(() => {
  //   const resizeHandler = () => {
  //     const viewerContainer = document.getElementById("cookieSetting");
  //     if (viewerContainer) {
  //       const windowHeight = window.innerHeight;
  //       const offsetTop = viewerContainer.offsetTop;
  //       const viewerHeight = windowHeight - offsetTop;
  //       viewerContainer.style.height = viewerHeight + "px";
  //     }
  //   };
  //   resizeHandler();
  //   window.addEventListener("resize", resizeHandler);
  //   return () => {
  //     window.removeEventListener("resize", resizeHandler);
  //   };
  // }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        backgroundColor: "#fff",
        height: "100%",
        borderRadius: "10px",
      }}
    >
      <Tabs
        orientation="vertical"
        // variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        // textColor="primary"
        sx={{
          borderLeft: 1,
          borderColor: "divider",
          width: "120px",
          minWidth: "120px",

          "& .MuiButtonBase-root.Mui-selected": {
            backgroundColor: "tabBackground.main",
            borderRadius: "10px",
            color: "signingtext1.main",
          },
          ".MuiTab-root ": {
            textTransform: "none",
            wordWrap: "break-word",
          },
          // color: "red",
          p: 1,
          textTransform: "capitalize",
          fontSize: "12px",
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
        <Tab
          label={t("0-common.details")}
          icon={
            <SvgIcon color="inherit">
              <DescriptionOutlinedIcon />
            </SvgIcon>
          }
          sx={{ fontSize: "12px" }}
          {...a11yProps(3)}
        />
        {/* <Tab
          icon={<InsertDriveFileOutlinedIcon />}
          label="Overview"
          sx={{ textTransform: "capitalize", fontFamily: "Montserrat" }}
          {...a11yProps(0)}
        />
        <Tab
          icon={<GroupOutlinedIcon />}
          label="Signatures"
          sx={{ textTransform: "capitalize", fontFamily: "Montserrat" }}
          {...a11yProps(1)}
        />
        <Tab
          icon={<DescriptionOutlinedIcon />}
          label="Details"
          sx={{ textTransform: "capitalize", fontFamily: "Montserrat" }}
          {...a11yProps(2)}
        /> */}
      </Tabs>

      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          justifyContent: "space-between",
        }}
      >
        <TabPanel value={value} index={0}>
          <Overview validFile={validFile.overview} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Signatures validFile={sigList} signType="Signature" />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Signatures validFile={eSealList} signType="Seal" />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Details
            validFile={validFile.details}
            notSign={sigList.length === 0 && eSealList.length === 0}
          />
        </TabPanel>
        <Box
          sx={{
            background: "rgb(232, 235, 240)",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              p: 2,
            }}
          >
            {/* <img src={Lock} alt="lock"></img> */}
            <Lock style={{ width: "100px" }} />
            <Typography variant="h6">
              {t("validation.val1")}
              <Link
                to="https://gopaperless.mobile-id.vn/compliance/signature-validation-service-practice-statement-and-policy"
                target="_blank"
              >
                {/* Privacy Policy */}
                {t("validation.val2")}
              </Link>{" "}
              {t("validation.val3")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
TabDocument.propTypes = {
  validFile: PropTypes.object,
};
export default TabDocument;

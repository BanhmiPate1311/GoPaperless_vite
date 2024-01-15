import { ReactComponent as SealIcon } from "@/assets/images/svg/seal.svg";
import { ReactComponent as ShowDetailIcon } from "@/assets/images/svg/showdetail_icon.svg";
import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import {
  convertTime,
  createValidSubTitle,
  createValidTitle,
} from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const ShowSignature = ({ sig, sign, signType, index }) => {
  // console.log("index: ", index);
  const { t } = useTranslation();

  const name = sig.certificate.subject.CN[0];
  const warnings = sig.warnings;
  const errors = sig.errors;

  const commonName = sig.certificate?.issuer?.CN?.[0]
    ? sig?.certificate?.issuer?.CN[0]
    : "";
  const organization = sig.certificate?.issuer?.O?.[0]
    ? ", " + sig.certificate?.issuer?.O[0]
    : "";
  const country = sig.certificate?.issuer?.C?.[0]
    ? ", " + sig.certificate?.issuer?.C[0]
    : "";

  const signTitle = signType + " is valid";
  const subTitle = "Electronic " + signType;

  const [isOpen, setIsOpen] = useState([false]);
  // console.log("isOpen: ", isOpen);
  const toggleDrawer = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };
  // const handleClose = () => {
  //   setIsOpen(false);
  // };

  const signature = {
    signing: [
      {
        title: t("validation.sigReason"),
        subtitle: sig.signing_reason ? sig.signing_reason : null,
      },
      {
        title: t("validation.sigTime"),
        subtitle: sig.signing_time ? convertTime(sig.signing_time) : null,
      },
      {
        title: t("validation.sigTimestamp"),
        subtitle: sig.timestamp_time ? sig.timestamp_time : null,
      },
      {
        title: t("validation.sigFormat"),
        subtitle: sig.format ? sig.format : null,
      },
      {
        title: t("validation.sigScope"),
        subtitle: sig.scope.name ? sig.scope.name : null,
      },
    ].filter((item) => item.subtitle !== null),
    certificated: [
      {
        title: t("validation.sigOwner"),
        subtitle: commonName ? commonName : null,
      },
      {
        title: t("validation.sigIssuer"),
        subtitle: commonName + organization + country,
      },
      {
        title: t("validation.sigPeriod"),
        subtitle:
          convertTime(sig.certificate.valid_from) +
          " - " +
          convertTime(sig.certificate.valid_to),
      },
      {
        title: t("validation.sigType"),
        subtitle: sig.type ? sig.type : null,
      },
    ].filter((item) => item.subtitle !== null),
  };

  const [expanded, setExpanded] = useState("warnings");

  const handleChangeShow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  useEffect(() => {
    const resizeHandler = () => {
      const viewerContainer = document.getElementById("cookieSetting");
      if (viewerContainer) {
        const windowHeight = window.innerHeight;
        const offsetTop = viewerContainer.offsetTop;
        const viewerHeight = windowHeight - offsetTop;
        viewerContainer.style.height = viewerHeight + "px";
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // event.stopPropagation() ngăn chặn sự kiện click này được truyền lên AccordionSummary và Accordion, giúp Switch được xử lý độc lập với AccordionSummary và Accordion.
  return (
    <div>
      <Box onClick={() => toggleDrawer(index)}>
        <Box
          sx={{
            display: "block",
            overflow: "hidden",
            padding: "5px",
            borderRadius: "12px",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              p: 1,
              "&:hover": {
                background: "rgb(232, 235, 240)",
                borderRadius: "10px",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* <img src="/logo_signing/icon_Chip_White.svg" alt="" /> */}
              <Stack
                direction="row"
                justifyContent="center"
                bgcolor="rgb(255, 240, 226)"
                borderRadius="50px"
              >
                {sign.icon}
              </Stack>
              <Box width="100%">
                <Typography variant="h5" fontWeight="bold">
                  {sig.certificate.subject.CN[0]}
                </Typography>
                <Box>
                  <Typography variant="h5">{sign.title}</Typography>
                  {/* {sign.name === "valid" && (
                    <Typography variant="h5">{sig.signing_time}</Typography>
                  )} */}
                  {sig.indication === "TOTAL_PASSED" && (
                    <Typography variant="h2">
                      {convertTime(sig.signing_time)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <IconButton>
              <ShowDetailIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Drawer
        open={isOpen[index]}
        onClose={() => toggleDrawer(index)}
        anchor="right"
        sx={{
          "& .MuiDrawer-paper": {
            // borderRadius: "10px",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          },
        }}
      >
        <Box style={{ width: "350px", wordWrap: "break-word" }}>
          {/* ----------------------------Privacy preference center----------------------------------*/}
          <Box
            className="header-cookie d-flex align-items-center"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
            }}
          >
            <Stack direction="row" alignItems={"center"} p={3} gap={1}>
              <Box width="25px" height="25px">
                {signType == "eseal" ? <SealIcon /> : <SignatureIcon />}
              </Box>
              <Typography
                variant="h5"
                fontSize="18px"
                fontWeight="550"
                textTransform="uppercase"
              >
                {name}
              </Typography>
            </Stack>
          </Box>

          <Box mb={3}>
            <Box sx={{ borderBottom: "1px solid #e9e9e9", p: 3 }}>
              <Box
                sx={{
                  display: "block",
                  overflow: "hidden",
                  borderRadius: "12px",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                    p: 1,
                    background: "rgb(232, 235, 240)",
                    borderRadius: "10px",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <Avatar sx={{ bgcolor: "#00CCFF", width: 32, height: 32 }}>
                      {sign.icon}
                    </Avatar>
                    {sign.name === "valid" ? (
                      <Box>
                        {/* <Title>Signature is valid</Title> */}
                        <Typography variant="h5" fontWeight={550}>
                          {createValidTitle(signTitle)}
                        </Typography>
                        <Box>
                          <Typography variant="h5">{sign.title}</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        {/* <Title>Signature is valid</Title> */}
                        <Typography variant="h5" fontWeight={550}>
                          {sign.title}
                        </Typography>
                        <Box>
                          <Typography variant="h5">
                            {createValidSubTitle(subTitle)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {warnings.length > 0 && (
              <Accordion
                expanded={expanded === "warnings"}
                onChange={handleChangeShow("warnings")}
                sx={{ boxShadow: "none", borderBottom: "1px solid #ccc" }}
                style={{ margin: 0 }}
                // className="content-signature"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    background: "rgb(232, 235, 240)",
                    boxShadow: "none",
                    minHeight: "unset !important",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "24px",
                  }}
                >
                  <Typography variant="h6" sx={{ width: "90%", flexShrink: 0 }}>
                    {signType === "Signature"
                      ? t("validation.sigWarnings")
                      : t("validation.sealWarnings")}
                  </Typography>
                </AccordionSummary>
                {warnings.map((val, i) => {
                  return (
                    <Box key={i}>
                      <AccordionDetails
                        sx={{
                          fontSize: "13px",
                          padding: "15px 24px",
                          width: "100%",
                          // borderBottom: "1px solid #ccc",
                        }}
                      >
                        {val.value}
                      </AccordionDetails>
                      <Divider
                        sx={{
                          width: "calc(100% - 24px)",
                          marginLeft: "auto",
                          height: "2px",
                          // bgcolor: "blueviolet",
                        }}
                      />
                    </Box>
                  );
                })}
              </Accordion>
            )}

            {errors.length > 0 && (
              <Accordion
                expanded={expanded === "errors"}
                onChange={handleChangeShow("errors")}
                sx={{ boxShadow: "none", borderBottom: "1px solid #ccc" }}
                style={{ margin: 0 }}
                // className="content-signature"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    background: "rgb(232, 235, 240)",
                    boxShadow: "none",
                    minHeight: "unset !important",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "24px",
                  }}
                >
                  <Typography variant="h6" sx={{ width: "90%", flexShrink: 0 }}>
                    {signType === "Signature"
                      ? t("validation.sigErrors")
                      : t("validation.sealErrors")}
                  </Typography>
                </AccordionSummary>
                {errors.map((val, i) => {
                  return (
                    <Box key={i}>
                      <AccordionDetails
                        sx={{
                          fontSize: "13px",
                          padding: "15px 24px",
                          width: "100%",
                          // borderBottom: "1px solid #ccc",
                        }}
                      >
                        {val.value}
                      </AccordionDetails>
                      <Divider
                        sx={{
                          width: "calc(100% - 24px)",
                          marginLeft: "auto",
                          height: "2px",
                          // bgcolor: "blueviolet",
                        }}
                      />
                    </Box>
                  );
                })}
              </Accordion>
            )}

            <Box className="content-signature" id="cookieSetting">
              {/* Khi nhấn vào tắt Switch hiển thị  button Allow all*/}
              {/* --------------------------------------------------------------*/}
              {signature.signing.map((step, index) => (
                <Box key={index}>
                  <Typography variant="h6" className="font-title">
                    {step.title}
                  </Typography>
                  <Typography variant="h5">{step.subtitle}</Typography>
                </Box>
              ))}
              {signature.certificated.map((step, index) => (
                <Box key={index}>
                  <Typography variant="h6" className="font-title">
                    {step.title}
                  </Typography>
                  <Typography variant="h5">{step.subtitle}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};
ShowSignature.propTypes = {
  sign: PropTypes.object,
  signType: PropTypes.string,
  sig: PropTypes.object,
  index: PropTypes.number,
};
export default ShowSignature;

import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
import { ReactComponent as WarningIcon2 } from "@/assets/images/svg/warning2_icon.svg";
import { ReactComponent as ErrorIcon } from "@/assets/images/svg/error_icon.svg";
import { convertTime } from "@/utils/commonFunction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SignatureDetail = ({ open, signDetail, sign, handleClose }) => {
  const { t } = useTranslation();
  console.log("signature: ", signDetail);
  const name = signDetail.signature.certificate.subject.common_name;
  const warnings = signDetail.warnings ? signDetail.warnings : [];
  const errors = signDetail.errors ? signDetail.errors : [];

  const commonName = signDetail.signature?.certificate?.issuer?.common_name
    ? signDetail.signature?.certificate?.issuer?.common_name
    : "";
  const organization = signDetail.signature?.certificate?.issuer?.organization
    ? ", " + signDetail.signature?.certificate?.issuer?.organization
    : "";
  const country = signDetail.signature?.certificate?.issuer?.country
    ? ", " + signDetail.signature?.certificate?.issuer?.country
    : "";

  //   const signTitle = signType + " is valid";
  // const subTitle = "Electronic " + signType;

  const [expanded, setExpanded] = useState("warnings");

  const handleChangeShow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  // convert "2023-24-01T15:22:37+07:00" from yyyy-dd-mmThh:mm:ssZ to dd/mm/yyyy hh:mm:ss 24 hour

  const signArray = {
    certificated: [
      {
        title: t("0-common.Signing Time"),
        subtitle: signDetail.signature.signing_time
          ? convertTime(signDetail.signature.signing_time)
          : null,
      },
      {
        title: t("0-common.Certificate issuer"),
        subtitle: commonName + organization + country,
      },
      {
        title: t("0-common.Certificate Owner"),
        subtitle: signDetail.signature.certificate.subject.common_name
          ? signDetail.signature.certificate.subject.common_name
          : null,
      },
      {
        title: t("0-common.Certificate validity period"),
        subtitle:
          convertTime(signDetail.signature.certificate.valid_from) +
          " - " +
          convertTime(signDetail.signature.certificate.valid_to),
      },
    ].filter((item) => item.subtitle !== null),
  };

  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          // borderRadius: "10px",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        },
      }}
    >
      <Box width="350px" mt="10px">
        <Box px="20px">
          <Stack
            direction="row"
            alignItems={"center"}
            height={60}
            sx={{
              position: "sticky",
              top: 10,
              zIndex: 1,
              p: 2,
              backgroundColor: "#fff",
            }}
            gap={1}
          >
            <SignatureIcon />
            <Typography variant="h3" sx={{ fontWeight: "700" }}>
              {name}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Stack
          direction="row"
          alignItems={"center"}
          // sx={{
          //   position: "sticky",
          //   top: 0,
          //   zIndex: 1,
          //   p: 2,
          //   backgroundColor: "#fff",
          // }}
          sx={{
            p: 2,
            height: "91px",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            flexGrow={1}
            bgcolor={"signingBackground.main"}
            p="12px 16px"
            borderRadius="10px"
          >
            {sign.icon}
            <Box>
              <Typography
                fontWeight="550"
                textTransform="uppercase"
                variant="h3"
              >
                {sign.name}
              </Typography>
              <Typography variant="h2">
                {t("validation.signSubTitle")}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        {/* <Divider sx={{ borderColor: "borderColor.main" }} /> */}
        {warnings.length > 0 && (
          <Accordion
            disableGutters
            expanded={expanded === "warnings"}
            onChange={handleChangeShow("warnings")}
            elevation={0}
            // sx={{
            //   boxShadow: "none",
            //   borderBottom: "1px solid #ccc",
            //   margin: 0,
            // }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                backgroundColor: "accordingBackGround.main",
                minHeight: "unset !important",
                "& .MuiAccordionSummary-content": {
                  // justifyContent: "space-between",
                  alignItems: "center",
                },
                height: "25px",
                px: "20px",
              }}
            >
              <WarningIcon2 />
              <Typography variant="h2" sx={{ pl: "20px" }}>
                {t("validation.sigWarnings")}
              </Typography>
            </AccordionSummary>
            {warnings.map((val, i) => {
              return (
                <Box key={i}>
                  <AccordionDetails
                    sx={{
                      fontSize: "14px",
                      padding: "11px 20px",
                      // px: "20px",
                      // width: "100%",
                      // borderBottom: "1px solid #ccc",
                    }}
                  >
                    {val.message}
                  </AccordionDetails>
                  {i !== warnings.length - 1 && (
                    <Divider
                      sx={{
                        width: "calc(100% - 20px)",
                        marginLeft: "auto",
                        height: "2px",
                        // bgcolor: "blueviolet",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Accordion>
        )}

        {errors.length > 0 && (
          <Accordion
            disableGutters
            expanded={expanded === "warnings"}
            onChange={handleChangeShow("warnings")}
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                backgroundColor: "accordingBackGround.main",
                minHeight: "unset !important",
                "& .MuiAccordionSummary-content": {
                  // justifyContent: "space-between",
                  alignItems: "center",
                },
                height: "25px",
                px: "20px",
              }}
            >
              <ErrorIcon />
              <Typography variant="h2" sx={{ pl: "20px" }}>
                {t("validation.sigErrors")}
              </Typography>
            </AccordionSummary>
            {errors.map((val, i) => {
              return (
                <Box key={i}>
                  <AccordionDetails
                    sx={{
                      fontSize: "14px",
                      padding: "11px 20px",
                      // width: "100%",
                      // py: 1,
                    }}
                  >
                    {val.message}
                  </AccordionDetails>
                  {i !== errors.length - 1 && (
                    <Divider
                      sx={{
                        width: "calc(100% - 20px)",
                        marginLeft: "auto",
                        height: "2px",
                        // bgcolor: "blueviolet",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Accordion>
        )}
        <Divider sx={{ borderColor: "borderColor.main" }} />
        <Box px="20px">
          {signArray.certificated.map((step, index) => (
            <Box key={index} py="10px">
              <Typography variant="h6" fontWeight={"bold"}>
                {step.title}
              </Typography>
              <Typography variant="h6" color="signingtext2.main">
                {step.subtitle}
              </Typography>
              {/* <Divider
                sx={{
                  // width: "calc(100% - 24px)",
                  my: 2,
                  height: "2px",
                  // bgcolor: "blueviolet",
                }}
              /> */}
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

SignatureDetail.propTypes = {
  open: PropTypes.bool,
  signDetail: PropTypes.object,
  handleClose: PropTypes.func,
  signType: PropTypes.string,
  sign: PropTypes.object,
};

export default SignatureDetail;

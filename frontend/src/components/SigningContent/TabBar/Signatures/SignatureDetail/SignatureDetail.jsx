import { ReactComponent as SignatureIcon } from "@/assets/images/svg/signature.svg";
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
  const name = signDetail.value.signature.certificate.subject.common_name;
  const warnings = signDetail.value.warnings ? signDetail.value.warnings : [];
  const errors = signDetail.value.errors ? signDetail.value.errors : [];

  const commonName = signDetail?.value?.signature?.certificate?.issuer
    ?.common_name
    ? signDetail?.value?.signature?.certificate?.issuer?.common_name
    : "";
  const organization = signDetail?.value?.signature?.certificate?.issuer
    ?.organization
    ? ", " + signDetail?.value?.signature?.certificate?.issuer?.organization
    : "";
  const country = signDetail?.value?.signature?.certificate?.issuer?.country
    ? ", " + signDetail?.value?.signature?.certificate?.issuer?.country
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
        subtitle: signDetail.value.signature.signing_time
          ? convertTime(signDetail.value.signature.signing_time)
          : null,
      },
      {
        title: t("0-common.Certificate issuer"),
        subtitle: commonName + organization + country,
      },
      {
        title: t("0-common.Certificate Owner"),
        subtitle: signDetail.value.signature.certificate.subject.common_name
          ? signDetail.value.signature.certificate.subject.common_name
          : null,
      },
      {
        title: t("0-common.Certificate validity period"),
        subtitle:
          convertTime(signDetail.value.signature.certificate.valid_from) +
          " - " +
          convertTime(signDetail.value.signature.certificate.valid_to),
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
      <Box width="350px">
        <Stack
          direction="row"
          alignItems={"center"}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            p: 2.5,
            backgroundColor: "#fff",
          }}
          spacing={1}
        >
          <SignatureIcon />
          <Typography variant="h6" sx={{ fontWeight: "700", fontSize: "16px" }}>
            {name}
          </Typography>
        </Stack>
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
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1} flexGrow={1}>
            {sign.icon}
            <Box>
              <Typography
                fontWeight="550"
                textTransform="uppercase"
                variant="h6"
              >
                {sign.name}
              </Typography>
              <Typography variant="h5" color={"signingtext2.main"}>
                {t("validation.signSubTitle")}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Divider />
        {warnings.length > 0 && (
          <Accordion
            disableGutters
            expanded={expanded === "warnings"}
            onChange={handleChangeShow("warnings")}
            sx={{
              boxShadow: "none",
              borderBottom: "1px solid #ccc",
              margin: 0,
            }}

            // className="content-signature"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                backgroundColor: "accordingBackGround.main",
                minHeight: "unset !important",
                "& .MuiAccordionSummary-content": {
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                height: "36px",
              }}
            >
              <Typography variant="h6" sx={{ width: "90%", flexShrink: 0 }}>
                {t("validation.sigWarnings")}
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
                      py: 1,
                      // borderBottom: "1px solid #ccc",
                    }}
                  >
                    {val.message}
                  </AccordionDetails>
                  {i !== warnings.length - 1 && (
                    <Divider
                      sx={{
                        width: "calc(100% - 24px)",
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
            expanded={expanded === "errors"}
            onChange={handleChangeShow("errors")}
            sx={{
              boxShadow: "none",
              borderBottom: "1px solid #ccc",
              margin: 0,
            }}

            // className="content-signature"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{
                backgroundColor: "accordingBackGround.main",
                minHeight: "unset !important",
                "& .MuiAccordionSummary-content": {
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                height: "36px",
              }}
            >
              <Typography variant="h6" sx={{ width: "90%", flexShrink: 0 }}>
                {t("validation.sigErrors")}
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
                      py: 1,
                    }}
                  >
                    {val.message}
                  </AccordionDetails>
                  {i !== errors.length - 1 && (
                    <Divider
                      sx={{
                        width: "calc(100% - 24px)",
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

        <Box p={2}>
          {signArray.certificated.map((step, index) => (
            <Box key={index}>
              <Typography variant="h6" fontWeight={"bold"}>
                {step.title}
              </Typography>
              <Typography variant="h5">{step.subtitle}</Typography>
              <Divider
                sx={{
                  // width: "calc(100% - 24px)",
                  my: 2,
                  height: "2px",
                  // bgcolor: "blueviolet",
                }}
              />
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

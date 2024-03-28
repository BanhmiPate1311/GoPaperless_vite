import { Cookie } from "@/components/cookie";
import { useCommonHook } from "@/hook";
import { apiService } from "@/services/api_service";
import { checkWorkflowStatus } from "@/utils/commonFunction";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ArragementDocument from "@/components/arrangement/ArrengementDocument";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import Button from "@mui/material/Button";
import { fpsService } from "@/services/fps_service";
import { useState } from "react";

export const Arrangement = () => {
  const { t } = useTranslation();
  const { signingToken } = useCommonHook();
  const [signerToken, setSignerToken] = useState("");

  const workFlow = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    // enabled: workFlowValid && workFlowValid.data === 1,
    select: (data) => {
      const newData = { ...data.data };
      const transformedParticipantsList = newData.participants.map(
        (participant) => {
          // Parse metaInformation and signingOptions
          const parsedAnnotation = JSON.parse(participant.annotation); // Parse annotation
          const parsedMetaInformation = JSON.parse(participant.metaInformation);
          const parsedSigningOptions = JSON.parse(participant.signingOptions);
          const parsedCertificate = JSON.parse(participant.certificate);

          // Return the participant with transformed data
          return {
            ...participant,
            annotation: parsedAnnotation,
            metaInformation: parsedMetaInformation,
            signingOptions: parsedSigningOptions?.signing_options,
            certificate: parsedCertificate,
          };
        }
      );

      // Return the data with transformed participantsList
      return {
        ...newData,
        participants: transformedParticipantsList,
        signerToken: signerToken,
        setSignerToken: setSignerToken,
      };
    },
  });
  const getFields = async () => {
    const response = await fpsService.getFields({
      documentId: workFlow.data.documentId,
    });
    if (!response) return;
    const newData = { ...response };
    const textField = response.textbox
      .filter(
        (item) =>
          item.type !== "TEXTFIELD" &&
          item.process_status !== "PROCESSED" &&
          item.value !== ""
      )
      .map((item) => {
        return {
          field_name: item.field_name,
          value: item.value,
        };
      });
    return {
      ...newData,
      textField,
      workFlowId: workFlow.workFlowId,
    };
  };
  let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);

  const handleShareToSign = async () => {
    const fields = await getFields();
    const checkFields = workFlow.data.participants
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map((participant) => {
        let data = false;

        // check signerType

        switch (participant.signerType) {
          case 1:
            if (fields.signature.length > 0) {
              data = false;
              // Check have Signature field for this signer

              fields.signature.map((item) => {
                if (item.field_name.slice(0, -17) === participant.signerId) {
                  data = true;
                  return;
                }
              });
              // If have Signature field for this signer
              if (!data) {
                alert("Don't have enough signature field for this signer");
              }
            } else {
              alert("Don't have enough signature field for this signer");
            }
            break;
          case 3:
            if (fields.initial.length > 0) {
              data = false;
              // Check have Signature field for this signer

              fields.initial.map((item) => {
                if (item.field_name.slice(0, -15) === participant.signerId) {
                  data = true;
                  return;
                }
              });
              // If have Signature field for this signer
              if (!data) {
                alert("Don't have enough Initial field for this Reviewer");
              }
            } else {
              alert("Don't have enough Initial field for this Reviewer");
            }
            break;
          default:
            data = true;
            break;
        }
        return data;
      });
    if (!checkFields.includes(false)) {
      // TODO: Share to sign
      const data = {
        workFlowId: workFlow.data.workFlowId,
        participant: {
          ...workFlow.data.participants[0],
          metaInformation: null,
        },
        signerName:
          workFlow.data.participants[0].lastName +
          " " +
          workFlow.data.participants[0].firstName,
        fileName: workFlow.data.fileName,
        signingToken: workFlow.data.signingToken,
        workFlowProcessType: workFlow.data.workflowProcessType,
        documentId: workFlow.data.documentId,
      };
      console.log(data);
      try {
        await apiService.shareToSign(data);
        alert("Share to sign success!!");
      } catch (error) {
        alert("Share to sign fail!!");
      }
    } else {
      alert("Don't have enough field for Participants");
    }
  };
  // console.log("checkWorkFlowStatusRef: ", checkWorkFlowStatus);

  // if (workFlowValid && workFlowValid.data === 0) {
  //   return <NotFound />;
  // } else {
  return (
    <Stack height="100%" overflow="auto">
      <Box>
        <AppBar
          position="static"
          sx={{
            height: (theme) => theme.GoPaperless.appBarHeight,
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              backgroundColor: "signingWFBackground.main",
              gap: 2,
              height: (theme) => theme.GoPaperless.appBarHeight,
              padding: "13px 0",
            }}
          >
            <Chip
              label="PDF"
              size="small"
              sx={{
                backgroundColor: "#4F4E4E",
                color: "white",
                fontWeight: "500",
              }}
            />
            <Typography
              color="signingtext1.main"
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, textTransform: "uppercase" }}
            >
              {/* {t("signing.document_information")} */}
              {workFlow?.data?.documentName}
            </Typography>
            {/* <VisibilityIcon sx={{ color: "signingtext1.main" }} /> */}
            <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                // href="#basic-chip"
                icon={<KeyboardDoubleArrowLeftIcon fontSize="small" />}
              />
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                // href="#basic-chip"
                icon={<KeyboardDoubleArrowRightIcon fontSize="small" />}
              />
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                // href="#basic-chip"
                icon={<PrintOutlinedIcon fontSize="small" />}
              />
              <Chip
                // label={t("signing.download_completed")}
                component="a"
                // color={checkWorkFlowStatus ? "primary" : undefined}
                // disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",

                  fontWeight: "500",
                  borderRadius: "25px",
                  backgroundColor: "transparent",
                  color: "signingWFBackground.main",

                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                    color: "#3B82F6",
                  },
                }}
                href={`${window.location.origin}/view/uiApi/signing/${signingToken}/download`}
                // href="#basic-chip"
                icon={<SaveAltIcon fontSize="small" />}
                clickable
              />
              <Button variant="contained" onClick={handleShareToSign}>
                Share Now
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Container
        maxWidth={false}
        sx={{
          maxWidth: (theme) => theme.GoPaperless.containerMaxWidth,
          height: (theme) => `calc(100% - ${theme.GoPaperless.appBarHeight})`,
        }}
      >
        {workFlow.data && <ArragementDocument workFlow={workFlow.data} />}
      </Container>
      <Cookie />
    </Stack>
  );
  // }
};

export default Arrangement;

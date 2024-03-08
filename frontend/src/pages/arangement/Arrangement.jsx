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

export const Arrangement = () => {
  const { t } = useTranslation();
  const { signingToken, signerToken } = useCommonHook();

  // const { data: workFlowValid } = useQuery({
  //   queryKey: ["checkWorkFlowValid"],
  //   queryFn: () => {
  //     const data = {
  //       signerToken,
  //       signingToken,
  //     };
  //     return apiService.checkWorkFlow(data);
  //   },
  // });

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
      };
    },
  });
  let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);
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
            <Chip
              // label={t("signing.download_completed")}
              component="a"
              // color={checkWorkFlowStatus ? "primary" : undefined}
              // disabled={!checkWorkFlowStatus}
              sx={{
                padding: "8px 16px",
                height: "36px",
                fontWeight: "500",
                borderRadius: "25px",
                backgroundColor: "transparent",
                color: "signingWFBackground.main",
                gap: "10px",
                "& span": {
                  padding: "0",
                },
                "& svg.MuiChip-icon": {
                  margin: "0",
                },
              }}
              // href="#basic-chip"
              href={`${window.location.origin}/view/uiApi/signing/${signingToken}/download`}
              icon={<SaveAltIcon fontSize="small" color="#000" />}
              clickable
            />
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

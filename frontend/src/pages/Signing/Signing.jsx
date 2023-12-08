import { SigningContent } from "@/components/SigningContent";
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
import { useParams, useSearchParams } from "react-router-dom";
import { NotFound } from "../NotFound";
import { useTranslation } from "react-i18next";

export const Signing = () => {
  const { t } = useTranslation();
  const { signing_token: signingToken } = useParams();
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  // const queryClient = useQueryClient();

  const { data: workFlowValid } = useQuery({
    queryKey: ["checkWorkFlowValid"],
    queryFn: () => {
      const data = {
        signerToken,
        signingToken,
      };
      return apiService.checkWorkFlow(data);
    },
  });
  const workFlow = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    enabled: workFlowValid && workFlowValid.data === 1,
    select: (data) => {
      const newData = { ...data.data };
      const transformedParticipantsList = newData.participants.map(
        (participant) => {
          // Parse metaInformation and signingOptions
          const parsedAnnotation = JSON.parse(participant.annotation); // Parse annotation
          const parsedMetaInformation = JSON.parse(participant.metaInformation);
          const parsedSigningOptions = JSON.parse(participant.signingOptions);

          // Return the participant with transformed data
          return {
            ...participant,
            annotation: parsedAnnotation,
            metaInformation: parsedMetaInformation,
            signingOptions: parsedSigningOptions?.signing_options,
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

  // queryClient.setQueryData(["workflow"], workFlow);
  // console.log("workFlow: ", workFlow?.data);

  let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);
  // console.log("checkWorkFlowStatusRef: ", checkWorkFlowStatus);

  if (workFlowValid && workFlowValid.data === 0) {
    return <NotFound />;
  } else {
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
              sx={{ backgroundColor: "signingWFBackground.main", gap: 1 }}
            >
              <Chip label="PDF" size="small" color="primary" />
              <Typography
                color="signingtext1.main"
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, textTransform: "uppercase" }}
              >
                {t("signing.document_information")}
              </Typography>
              {/* <VisibilityIcon sx={{ color: "signingtext1.main" }} /> */}
              <Chip
                label={t("signing.download_completed")}
                component="a"
                disabled={!checkWorkFlowStatus}
                // href="#basic-chip"
                href={`${window.location.origin}/view/uiApi/signing/${signingToken}/download`}
                icon={<SaveAltIcon fontSize="small" />}
                clickable
              />
            </Toolbar>
          </AppBar>
        </Box>

        <Container
          // maxWidth={(theme) => theme.GoPaperless.containerMaxWidth}
          maxWidth={false}
          // mt={(theme) => theme.GoPaperless.headerHeight}
          // height={(theme) =>
          //   `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeight})`
          // }
          sx={{
            maxWidth: (theme) => theme.GoPaperless.containerMaxWidth,
            height: (theme) => `calc(100% - ${theme.GoPaperless.appBarHeight})`,
          }}
        >
          {workFlow.data && <SigningContent workFlow={workFlow.data} />}
        </Container>
      </Stack>
    );
  }
};

export default Signing;

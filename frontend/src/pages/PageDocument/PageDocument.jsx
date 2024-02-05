// import "@/assets/style/documents.css";
import { SigningContent } from "@/components/SigningContent";
import { Cookie } from "@/components/cookie";
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { NotFound } from "../NotFound";

export const PageDocument = () => {
  const { t } = useTranslation();
  const [signingToken, setSigningToken] = useState();
  const [checkEnable, setCheckEnable] = useState(0);

  const { qr } = useParams();
  console.log("param: ", qr);

  // const { signingToken, signerToken } = useCommonHook();
  console.log("signingToken: ", signingToken);

  const getView = async () => {
    try {
      const response = await apiService.getView({ qr });
      setSigningToken(response.data);
      console.log("response: ", response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (qr) {
      getView();
    }
  }, []);

  useEffect(() => {
    if (signingToken && signingToken !== "") {
      setCheckEnable(1);
    }
  }, [signingToken]);

  console.log("checkEnable: ", checkEnable);

  const workFlow = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    enabled: checkEnable === 1,
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
        // signerToken: signerToken,
      };
    },
  });

  let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);

  if (signingToken === "") {
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
                {workFlow?.data?.documentName}
              </Typography>
              <Chip
                label={t("signing.download_completed")}
                component="a"
                color={checkWorkFlowStatus ? "primary" : undefined}
                disabled={!checkWorkFlowStatus}
                sx={{
                  padding: "8px 16px",
                  height: "36px",
                  fontWeight: "500",
                  borderRadius: "25px",
                  color: "signingWFBackground.main",
                  gap: "10px",
                  "& span": {
                    padding: "0",
                  },
                  "& svg.MuiChip-icon": {
                    margin: "0",
                  },
                }}
                href={`${window.location.origin}/view/uiApi/signing/${signingToken}/download`}
                icon={
                  <SaveAltIcon fontSize="small" color="borderColor.light" />
                }
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
          {workFlow.data && (
            <SigningContent
              workFlow={workFlow.data}
              page="document"
              qrSigning={signingToken}
            />
          )}
        </Container>
        <Cookie />
      </Stack>
    );
  }
};

export default PageDocument;

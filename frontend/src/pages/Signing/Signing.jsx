import { SigningContent } from "@/components/SigningContent";
import { ApproveModal } from "@/components/approve_modal";
import { Cookie } from "@/components/cookie";
import { useCommonHook } from "@/hook";
import { apiService } from "@/services/api_service";
import { fpsService } from "@/services/fps_service";
import { checkWorkflowStatus, getSigner } from "@/utils/commonFunction";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotFound } from "../NotFound";

export const Signing = () => {
  const { t } = useTranslation();

  const { signingToken, signerToken } = useCommonHook();
  const [permit, setPermit] = useState(false);

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClickOpenApprove = () => {
    setOpen(true);
  };

  const handleCloseApprove = () => {
    setOpen(false);
  };
  // const queryClient = useQueryClient();

  useEffect(() => {
    if (signerToken) {
      checkPerMission();
    }
  }, [signerToken]);

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

  const checkPerMission = async () => {
    const response = await apiService.checkPerMission({ signerToken });
    // console.log("response: ", response);
    setPermit(response.data);
    // return response.data;
  };
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

  let signer = getSigner(workFlow?.data);

  const { data: field } = useQuery({
    queryKey: ["getField"],
    queryFn: () =>
      fpsService.getFields({ documentId: workFlow?.data?.documentId }),
    enabled: !!workFlow?.data?.documentId,
    select: (data) => {
      // console.log("data: ", data);
      const newData = { ...data };
      const textField = data.textbox
        .filter(
          (item) =>
            item.type !== "TEXTFIELD" &&
            item.process_status !== "PROCESSED" &&
            item.value !== "" &&
            item.field_name.includes(signer.signerId)
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
        workFlowId: workFlow.data.workFlowId,
      };
    },
  });

  // const field = useMutation({
  //   mutationFn: async ({ documentId }) => {
  //     const response = await fpsService.getFields({ documentId });
  //     // console.log("response: ", response);
  //     return response;
  //   },
  // });

  // console.log("workFlow: ", workFlow?.data);
  // console.log("workFlowtet: ", workFlow?.data?.documentId);
  // console.log("field: ", field);

  let checkWorkFlowStatus = checkWorkflowStatus(workFlow?.data);
  // console.log("checkWorkFlowStatusRef: ", checkWorkFlowStatus);

  // console.log("signer: ", signer);

  // useEffect(() => {
  //   if (workFlow?.data?.participants) {
  //     signer = getSigner(workFlow?.data);
  //   }
  // }, [workFlow?.data]);
  // console.log("signer: ", signer);

  const checkInit = field?.initial.findIndex(
    (item) =>
      item.process_status === "UN_PROCESSED" &&
      item.field_name.includes(signer.signerId)
  );
  // console.log("checkInit: ", checkInit);

  const checkTextBox = field?.textbox.findIndex(
    (item) =>
      item.field_name.includes(signer.signerId) &&
      item.value === "" &&
      item.required === true
  );
  // console.log("checkTextBox: ", checkTextBox);

  const qrypto =
    field?.qrypto.length > 0 &&
    field?.qrypto[0].process_status === "UN_PROCESSED"
      ? field?.qrypto[0].field_name
      : null;
  useEffect(() => {
    if (checkWorkFlowStatus && qrypto) {
      fpsService.fillQrypto(qrypto, { documentId: workFlow?.data?.documentId });
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
    }
  }, [qrypto, checkWorkFlowStatus, workFlow?.data?.documentId]);

  const checkApprove = (signerType, signerStatus) => {
    if (signerStatus !== 1) return "none";
    switch (signerType) {
      case 2:
        if (checkInit === -1 && checkTextBox === -1) {
          return "block";
        } else {
          return "none";
        }
      case 3:
        if (
          field?.initial.findIndex((item) =>
            item.field_name.includes(signer.signerId)
          ) !== -1 &&
          checkInit === -1 &&
          checkTextBox === -1
        ) {
          return "block";
        } else {
          return "none";
        }
      default:
        return "none";
    }
  };

  if ((workFlowValid && workFlowValid.data === 0) || !permit) {
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
                {/* {t("signing.document_information")} */}
                {workFlow?.data?.documentName}
              </Typography>
              {/* <VisibilityIcon sx={{ color: "signingtext1.main" }} /> */}
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
                  // backgroundColor: "borderColor.light",
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
                icon={
                  <SaveAltIcon fontSize="small" color="borderColor.light" />
                }
                clickable
              />
              <Button
                variant="contained"
                onClick={handleClickOpenApprove}
                sx={{
                  display: checkApprove(
                    signer?.signerType,
                    signer?.signerStatus
                  ),
                }}
              >
                {signer?.signerType === 2
                  ? t("0-common.approve")
                  : t("0-common.submit")}
              </Button>
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
          {workFlow.data && field && (
            <SigningContent
              workFlow={workFlow.data}
              field={field}
              signer={signer}
            />
          )}
        </Container>
        <ApproveModal
          open={open}
          onClose={handleCloseApprove}
          workFlow={workFlow.data}
          signer={signer}
          textField={field?.textField}
        />
        <Cookie />
      </Stack>
    );
  }
};

export default Signing;

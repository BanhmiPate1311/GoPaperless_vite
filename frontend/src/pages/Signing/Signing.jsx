import { SigningContent } from "@/components/SigningContent";
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { NotFound } from "../NotFound";

export const Signing = () => {
  const { signing_token: signingToken } = useParams();
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");

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

  const { data: workFlow } = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    enabled: workFlowValid && workFlowValid.data === 1,
    select: (data) => {
      const newData = { ...data.data };
      const transformedParticipantsList = newData.participantsList.map(
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
            signingOptions: parsedSigningOptions.signing_options,
          };
        }
      );

      // Return the data with transformed participantsList
      return {
        ...newData,
        participantsList: transformedParticipantsList,
      };
    },
  });
  console.log("workFlow: ", workFlow);
  if (workFlowValid && workFlowValid.data === 0) {
    return <NotFound />;
  } else {
    return (
      <Box
        // mt={(theme) => theme.GoPaperless.headerHeight}
        // height={(theme) =>
        //   `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeight})`
        // }
        height="100%"
      >
        {workFlow && <SigningContent workFlow={workFlow} />}
      </Box>
    );
  }
};

export default Signing;

import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";

export const Signing = () => {
  const { signing_token: signingToken } = useParams();
  console.log("signingToken: ", signingToken);
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  console.log("signerToken: ", signerToken);

  const { data: workFlow } = useQuery({
    queryKey: ["getWorkFlow"],
    queryFn: () => apiService.getSigningWorkFlow(signingToken),
    // select: (data) => ({
    //   visibleHeaderFooter: data.data.visibleHeaderFooter,
    //   enterpriseId: data.data.enterpriseId,
    // }),
  });
  console.log("getWorkFlow: ", workFlow?.data);
  return (
    <Box
      // mt={(theme) => theme.GoPaperless.headerHeight}
      height={(theme) =>
        `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeight})`
      }
    >
      Signing
    </Box>
  );
};

export default Signing;

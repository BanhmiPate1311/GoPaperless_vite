// import React from 'react'
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import Stack from "@mui/material/Stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { PdfViewer } from "../PdfViewer";
import { Participants } from "../Partcipants";

export const SigningContent = () => {
  // console.log("workFlow: ", workFlow);
  // eslint-disable-next-line no-unused-vars

  const queryClient = useQueryClient();

  const workFlow = queryClient.getQueryData(["workflow"]);

  // eslint-disable-next-line no-unused-vars
  const { data: signedInfo } = useQuery({
    queryKey: ["getSignedInfo"],
    queryFn: () => apiService.getSignedInfo(workFlow),
    select: (data) => {
      const newData = [...data.data];
      const transformer = newData.map((item) => {
        const parsedValue = JSON.parse(item.value);
        return {
          ...item,
          value: parsedValue,
        };
      });
      return transformer;
    },
  });
  // console.log("getSignedInfo: ", signedInfo);
  return (
    <Container
      disableGutters
      maxWidth="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        height: { lg: "100%" }, // ở màn hình lg sẽ cao bằng 100% chiều cao thẻ div cha
        pt: 2,
        gap: 4,
      }}
    >
      {/* width={{ xs: "100%", lg: "70%" }} */}
      <Box
        width={{ xs: "100%", lg: "60%" }}
        overflow="auto"
        height={{ xs: "500px", lg: "100%" }} // ở màn hình lg sẽ cao bằng 100% chiều cao thẻ div cha, ở màn hình sx sẽ cao 500px
      >
        <PdfViewer />
      </Box>
      <Box
        width={{ xs: "100%", lg: "40%" }}
        // height={{ xs: "100%", lg: "100%" }}
      >
        <Participants />
      </Box>
    </Container>
  );
};

SigningContent.propTypes = {
  workFlow: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    fileId: PropTypes.string,
  }),
};

export default SigningContent;

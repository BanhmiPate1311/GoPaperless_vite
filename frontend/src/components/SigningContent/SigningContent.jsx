// import React from 'react'
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { PdfViewer } from "../PdfViewer";

export const SigningContent = ({ workFlow }) => {
  // console.log("workFlow: ", workFlow);
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
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        height: "100%",
        pt: 2,
        gap: 4,
      }}
    >
      {/* width={{ xs: "100%", lg: "70%" }} */}
      <Box width={{ xs: "100%", lg: "70%" }} overflow="auto">
        <PdfViewer workFlow={workFlow} />
      </Box>
      <Box width={{ xs: "100%", lg: "30%" }}>SigningContent2</Box>
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

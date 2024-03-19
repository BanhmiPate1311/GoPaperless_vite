import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { PdfViewer } from "./PdfViewer";
import { PdfViewerDocument } from "./PdfViewer";
import { TabBar } from "./TabBar";
import { useEffect, useState } from "react";
import { Next } from "../next";

export const SigningContent = ({
  workFlow,
  page,
  qrSigning,
  field,
  signer,
}) => {
  // console.log("workFlow: ", workFlow);
  // console.log("page: ", page);
  // console.log("workFlow: ", workFlow);
  // eslint-disable-next-line no-unused-vars

  // const queryClient = useQueryClient();

  // const workFlow = queryClient.getQueryData(["workflow"]);

  // eslint-disable-next-line no-unused-vars
  const { data: signedInfo } = useQuery({
    queryKey: ["getSignedInfo"],
    queryFn: () => apiService.getSignedInfo(workFlow),
    enabled: Object.keys(workFlow).length > 0,
  });
  // console.log("getSignedInfo: ", signedInfo);

  const [newFields, setNewFields] = useState(
    Object.entries(field)
      .filter(([, value]) => Array.isArray(value)) // Loại bỏ các phần tử không phải là mảng
      .flatMap(([, value]) => value)
      .filter(
        (item) =>
          item.process_status === "UN_PROCESSED" &&
          item.field_name.includes(signer.signerId)
      )
  );

  useEffect(() => {
    setNewFields(
      Object.entries(field)
        .filter(([, value]) => Array.isArray(value)) // Loại bỏ các phần tử không phải là mảng
        .flatMap(([, value]) => value)
        .filter(
          (item) =>
            item.process_status === "UN_PROCESSED" &&
            item.field_name.includes(signer.signerId)
        )
    );
  }, [field]);

  const [value, setValue] = useState(0);

  const handleChange = () => {
    // console.log("object");
    setValue(value === newFields.length - 1 ? 0 : value + 1);
  };

  // console.log("newFields: ", newFields);

  //code thêm
  function checkPDFView(page) {
    if (page === "document") {
      return <PdfViewerDocument workFlow={workFlow} />;
    } else {
      return (
        <PdfViewer
          workFlow={workFlow}
          field={field}
          fieldSelect={newFields[value]}
        />
      );
    }
  }
  // code thêm

  return (
    <Container
      disableGutters
      maxWidth="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        height: { lg: "100%" },
        pt: 2,
        gap: 4,
      }}
    >
      <Box
        width={{ xs: "100%", lg: "72%" }}
        height={{ xs: "500px", lg: "100%" }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          height={"25px"}
          bgcolor="signingWFBackground.main"
          pl={2}
        >
          {workFlow.fileName}
        </Typography>
        <Box overflow="auto" height={{ xs: "500px", lg: "calc(100% - 25px)" }}>
          {/* <PdfViewer workFlow={workFlow} /> code a Cường */}
          {/* code thêm */}
          {checkPDFView(page)}
          {/* code thêm */}
        </Box>
      </Box>
      <Box
        width={{ xs: "100%", lg: "28%" }}
        // height={{ xs: "100%", lg: "100%" }}
      >
        <TabBar
          workFlow={workFlow}
          signedInfo={signedInfo}
          qrSigning={qrSigning}
        />
      </Box>
      {/* <Next newFields={newFields} handleChange={handleChange} value={value} /> */}
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
    fileName: PropTypes.string,
  }),
  page: PropTypes.string,
  qrSigning: PropTypes.string,
  field: PropTypes.object,
  signer: PropTypes.object,
};

export default SigningContent;

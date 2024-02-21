/* eslint-disable react/prop-types */
import "@/assets/style/pdfViewer.css";
import { Box } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export const PDFViewer = ({ base64, renderPage, pageLayout }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Box
      height="100%"
      width="100%"
      className="review_pdf"
      onContextMenu={(event) => {
        console.log("event: ", event);
        event.preventDefault();
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${base64}`}
          plugins={[defaultLayoutPluginInstance]}
          renderPage={renderPage}
          pageLayout={pageLayout}
        />
      </Worker>
    </Box>
  );
};

export default PDFViewer;

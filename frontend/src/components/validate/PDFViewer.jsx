/* eslint-disable react/prop-types */
import "@/assets/style/pdfViewer.css";
import { Box } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export const PDFViewer = ({ base64 }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Box className="pdfviewer" id="pdfViewerContainer">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${base64}`}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </Box>
  );
};

export default PDFViewer;

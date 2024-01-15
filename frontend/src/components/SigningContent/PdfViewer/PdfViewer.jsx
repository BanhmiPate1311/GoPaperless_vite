/* eslint-disable react/prop-types */
import "@/assets/style/cursor.css";
import { useCommonHook } from "@/hook";
import { UseAddSig, UseAddTextField } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import {
  checkIsPosition,
  checkSignerStatus,
  getSigner,
} from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Document } from ".";
import { ContextMenu } from "../../ContextMenu";

export const PdfViewer = ({ workFlow }) => {
  console.log("workFlow: ", workFlow);
  const queryClient = useQueryClient();

  const [contextMenu, setContextMenu] = useState(null);

  const signerId = getSigner(workFlow).signerId;

  const signer = getSigner(workFlow);
  const { signerToken } = useCommonHook();

  const [signInfo, setSignInFo] = useState(null);
  // console.log("signInfo: ", signInfo);
  // const [increment, setIncrement] = useState(0);
  // console.log("increment: ", increment);

  const isSetPosRef = useRef(checkIsPosition(workFlow));
  const isSetPos = isSetPosRef.current;

  useEffect(() => {
    isSetPosRef.current = checkIsPosition(workFlow);
  }, [workFlow]);

  // eslint-disable-next-line no-unused-vars
  const { data: field } = useQuery({
    queryKey: ["getField"],
    queryFn: () => fpsService.getFields({ documentId: workFlow.documentId }),
    // select: (data) => {
    //   console.log("data: ", data);
    //   const newData = { ...data };
    //   return {
    //     ...newData,
    //     workFlowId: workFlow.workFlowId,
    //   };
    // },
  });

  console.log("getField: ", field);

  const addSignature = UseAddSig();
  const addTextBox = UseAddTextField();

  const handleContextMenu = (page) => (event) => {
    // console.log("event: ", event);
    // console.log("page: ", page);
    if (
      isSetPos ||
      checkSignerStatus(signer, signerToken) === 2 ||
      (event.target.className !== "rpv-core__text-layer" &&
        event.target.className !== "rpv-core__text-layer-text")
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // Xác định vị trí x dựa trên vị trí của chuột

    const y = event.clientY - rect.top;

    const data = {
      x: (x * 100) / rect.width,
      y: (y * 100) / rect.height,
      width: 22,
      height: 5,
      page: page.pageIndex + 1,
    };

    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
    setSignInFo(data);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const signatureField = (value) => {
    const newSignature = {
      type: value,
      field_name:
        signerId + "_" + value + "_" + Number(field.signature.length + 1),
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: Number(field.signature.length + 1),
      visible_enabled: true,
      workFlowId: workFlow.workFlowId,
    };
    addSignature.mutate(
      {
        body: newSignature,
        field: newSignature.type.toLowerCase(),
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const textField = (value) => {
    // console.log("value: ", value);
    const newTextField = {
      type: "TEXTBOX",
      field_name:
        signerId + "_" + value + "_" + Number(field.textbox.length + 1),
      page: signInfo.page,
      value: signer.lastName + signer.firstName,
      read_only: false,
      multiline: false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: Number(field.textbox.length + 1),
    };
    addTextBox.mutate(
      {
        body: newTextField,
        field: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const handleClickMenu = (value) => () => {
    console.log("data: ", value);
    handleClose();
    switch (value) {
      case "SIGNATURE":
        signatureField(value);
        break;
      case "NAME":
        textField(value);
        break;
    }

    // if (
    //   signatures &&
    //   signatures.findIndex((item) => item.field_name === signerId) !== -1
    // ) {
    //   // handleClose();
    //   return alert("Signature Duplicated");
    // }
  };

  const renderPage = (props) => {
    // console.log("props: ", props);

    return (
      <div
        // className="cuong2"
        className={`cuong-page-${props.pageIndex}`}
        // onContextMenu={(e) => handleContextMenu(e, props.pageIndex + 1)}
        // ref={menuRef}
        onContextMenu={handleContextMenu(props)}
        // style={{ cursor: "context-menu" }}
        style={{
          width: "100%",
          height: "100%",
        }}
        // id="pdf-view"
      >
        <ContextMenu
          contextMenu={contextMenu}
          handleClose={handleClose}
          handleClickMenu={handleClickMenu}
        />

        <Document
          props={props}
          workFlow={workFlow}
          signatures={field.signature}
        />
      </div>
    );
  };

  const pageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
    // buildPageStyles: ({ numPages, pageIndex }) => ({
    //   zIndex: numPages - pageIndex,
    // }),
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Box height="100%">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${workFlow.pdfBase64}`}
          plugins={[defaultLayoutPluginInstance]}
          renderPage={renderPage}
          pageLayout={pageLayout}
        />
      </Worker>
    </Box>
  );
};
PdfViewer.propTypes = {
  workFlow: PropTypes.shape({
    pdfBase64: PropTypes.string,
  }),
};

export default PdfViewer;

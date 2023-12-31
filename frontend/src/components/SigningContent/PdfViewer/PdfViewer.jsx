/* eslint-disable react/prop-types */
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Document } from ".";
import "@/assets/style/cursor.css";
import { ContextMenu } from "../../ContextMenu";
import { useCommonHook } from "@/hook";

export const PdfViewer = ({ workFlow }) => {
  // console.log("workFlow: ", workFlow);
  const queryClient = useQueryClient();

  const [contextMenu, setContextMenu] = useState(null);

  const signerId = getSigner(workFlow).signerId;

  const signer = getSigner(workFlow);
  const { signerToken } = useCommonHook();

  const [signInfo, setSignInFo] = useState(null);
  // console.log("signInfo: ", signInfo);
  // const [increment, setIncrement] = useState(0);
  // console.log("increment: ", increment);

  let isSetPos = checkIsPosition(workFlow);
  useEffect(() => {
    isSetPos = checkIsPosition(workFlow);
  }, [workFlow]);

  // eslint-disable-next-line no-unused-vars
  const { data: signatures } = useQuery({
    queryKey: ["getField"],
    queryFn: () => fpsService.getFields({ documentId: workFlow.documentId }),
    select: (data) => {
      const newData = { ...data.data };
      const newSignatures = Object.values(newData)
        .flat()
        .map((item) => {
          const { verification, ...repairedSignature } = item;
          return {
            verification,
            ...repairedSignature,
            workFlowId: workFlow.workFlowId,
          };
        });
      // setIncrement(newSignatures.length + 1); // Set the state when data is available
      return newSignatures;
    },
  });

  // console.log("getField: ", signatures);

  // const { data: signatures } = useQuery({
  //   queryKey: ["verifySignatures"],
  //   queryFn: () =>
  //     fpsService.getVerification({ documentId: workFlow.documentId }),
  //   select: (data) => {
  //     // console.log("data: ", data);
  //     const newData = [...data.data];
  //     let fieldResult = [...getField];
  //     if (newData.length === 0) return fieldResult;
  //     newData.forEach((signatureVeriInfo) => {
  //       let signatureIndex = fieldResult.findIndex(
  //         (signature) => signature.field_name === signatureVeriInfo.field_name
  //       );

  //       if (signatureIndex === -1) return;
  //       fieldResult[signatureIndex] = {
  //         ...fieldResult[signatureIndex],
  //         ...signatureVeriInfo,
  //         signed: true,
  //       };
  //       // queryClient.setQueryData(["getField"], []);
  //     });
  //     return fieldResult;
  //   },
  //   retry: false,
  // });
  // console.log("signatures: ", signatures);

  // queryClient.setQueryData(["signatures"], signatures);

  const addSignature = useMutation({
    mutationFn: ({ body, field }) => {
      // console.log("body: ", body);
      return fpsService.addSignature(
        { documentId: workFlow.documentId },
        body,
        field
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
      // queryClient.setQueryData(["getField"], (prev) => {
      //   return {
      //     ...prev,
      //     data: {
      //       ...prev.data,
      //       signature: [...prev.data.signature, variables.body],
      //     },
      //   };
      // });
    },
  });

  // const pdfRange = {
  //   [index]: [],
  // };

  // const cursors = {
  //   [index]: [],
  // };
  // const abc = useRef(0);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   for (let i = 0; i < cursors[index].length; i++) {
  //     const mouseMove = (e) => {
  //       if (
  //         e.target instanceof SVGElement ||
  //         e.target.className.includes("MuiListItemText-primary") ||
  //         e.target.className.includes("MuiListItemButton-root")
  //       ) {
  //         cursors[index][i].style.display = "none";
  //       } else {
  //         pdfRange[index][i].style.cursor = "none";
  //         setMousePosition({
  //           x: e.clientX,
  //           y: e.clientY,
  //         });
  //         cursors[index][i].style.display = "block";
  //       }
  //     };

  //     const mouseOut = () => {
  //       cursors[index][i].style.display = "none";
  //     };

  //     console.log("pdfRange: ", pdfRange);
  //     pdfRange[index][i].addEventListener("mousemove", mouseMove);

  //     pdfRange[index][i].addEventListener("mouseleave", mouseOut);

  //     return () => {
  //       // window.removeEventListener("mousedown", handleGlobalClickAndMouseDown);
  //       pdfRange[index][i].removeEventListener("mousemove", mouseMove);
  //       pdfRange[index][i].removeEventListener("mouseleave", mouseOut);
  //     };
  //   }
  // }, [cursors]);MuiDialog-container MuiBox-root css-i9gxme

  const handleContextMenu = (page) => (event) => {
    console.log("event: ", event);
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

  const handleClickMenu = (value) => () => {
    // console.log("data: ", value);
    handleClose();
    // console.log("signInfo: ", signInfo);

    // if (
    //   signatures &&
    //   signatures.findIndex((item) => item.field_name === signerId) !== -1
    // ) {
    //   // handleClose();
    //   return alert("Signature Duplicated");
    // }

    const newSignature = {
      type: value,
      // field_name: String(item).toUpperCase() + uuidv4(),
      field_name: signerId + "_" + Number(signatures.length + 1),
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: Number(signatures.length + 1),
      visible_enabled: true,
      workFlowId: workFlow.workFlowId,
      // signerToken: workFlow.signerToken,
    };
    // console.log("newSignature: ", newSignature);
    addSignature.mutate({
      body: newSignature,
      field: newSignature.type.toLowerCase(),
    });
    // setIncrement(increment + 1);
  };

  const renderPage = (props) => {
    // console.log("props: ", props);

    return (
      <DndProvider backend={HTML5Backend}>
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

          <Document props={props} workFlow={workFlow} signatures={signatures} />
          {/* <Tooltip
            // open={!isSetPos}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [50, 0],
                  },
                },
              ],
            }}
            title="Right Click"
            followCursor
          >
            <div style={{ width: "100%", height: "100%" }}>
              <Document props={props} />
            </div>
          </Tooltip> */}
        </div>
      </DndProvider>
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

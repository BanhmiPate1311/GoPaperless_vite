/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import mouse from "@/assets/images/svg/mouse-right2.svg";
import { UseUpdateSig } from "@/hook/use-fpsService";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import { forwardRef, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "react-resizable";
import { TextSignForm } from "../modal2/TextSignForm";
import { PDFViewer } from "../validate";
import DrawSignForm from "./DrawSignForm";
import UploadSignForm from "./UploadSignForm";

export const ReviewSign = forwardRef(
  (
    {
      open,
      handleOpenResize,
      dataSigning,
      headerFooter,
      formattedDatetime,
      onDisableSubmit,
      watch,
      control,
      value,
      signatureData,
      pdfPage,
      isControlled,
      isSetPos,
      index,
      signerId,
      maxPosibleResizeWidth,
      maxPosibleResizeHeight,
      workFlow,
      setImgBase64,
      setIsControlled,
      dragPosition,
      handleDrag,
      newPos,
      handleSubmitClick,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const putSignature = UseUpdateSig();
    const queryClient = useQueryClient();
    const textElement = useRef(null);
    const [location, setLocation] = useState(dragPosition);
    const [dimension, setDimension] = useState({
      x: signatureData.dimension.x,
      y: signatureData.dimension.y,
      width: -1,
      height: -1,
    });
    useEffect(() => {
      setDimension({
        x: signatureData.dimension.x,
        y: signatureData.dimension.y,
        width: -1,
        height: -1,
      });
    }, [open]);
    console.log("dimension: ", dimension);
    function handleSign() {
      putSignature.mutate({
        body: {
          field_name: signatureData.field_name,
          page: pdfPage.currentPage,
          dimension: dimension,
          visible_enabled: true,
        },
        field: signatureData.type.toLowerCase(),
        documentId: workFlow.documentId,
      });
    }
    const renderPage = (props) => {
      return (
        <div
          id={`pdf-view1-${props.pageIndex}`}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            cursor: `url(${mouse}), auto`,
            overflow: "hidden",
          }}
        >
          {props.canvasLayer.children}
          {signatureData.page !== null &&
            signatureData.page === props.pageIndex + 1 && (
              <Draggable
                handle={`#sigDrag1-${index}`}
                // bounds="parent"
                onDrag={() => handleDrag("block")}
                position={location}
                cancel=".topBar"
                onStart={(e, data) => {
                  setLocation({ x: data.x, y: data.y });
                  newPos.current.x = data.x;
                  newPos.current.y = data.y;
                  setIsControlled(false);
                }}
                onStop={(e, data) => {
                  // console.log("data: ", data);
                  // console.log("e: ", e);

                  setIsControlled(true);
                  handleDrag("none");
                  const draggableComponent = document.querySelector(
                    `.choioi-${index}`
                  );
                  const targetComponents = document.querySelectorAll(".sig1");
                  const containerComponent = document.getElementById(
                    `pdf-view1-${pdfPage.currentPage - 1}`
                  );

                  const containerRect =
                    containerComponent.getBoundingClientRect();

                  const draggableRect =
                    draggableComponent.getBoundingClientRect();
                  console.log(
                    draggableRect.right > containerRect.right ||
                      draggableRect.left < containerRect.left ||
                      draggableRect.bottom > containerRect.bottom ||
                      draggableRect.top < containerRect.top
                  );
                  if (
                    draggableRect.right > containerRect.right ||
                    draggableRect.left < containerRect.left ||
                    draggableRect.bottom > containerRect.bottom ||
                    draggableRect.top < containerRect.top
                  ) {
                    return;
                  }
                  let isOverTarget = false;

                  targetComponents.forEach((targetComponent) => {
                    if (isOverTarget) return;

                    const targetRect = targetComponent.getBoundingClientRect();
                    if (draggableComponent === targetComponent) return;

                    if (
                      draggableRect.left < targetRect.right &&
                      draggableRect.right > targetRect.left &&
                      draggableRect.top < targetRect.bottom &&
                      draggableRect.bottom > targetRect.top
                    ) {
                      isOverTarget = true;
                      console.log(
                        "Draggable component is over the target component"
                      );
                    }
                  });

                  if (isOverTarget) {
                    return;
                  } else {
                    if (
                      dragPosition?.x === data.x &&
                      dragPosition?.y === data.y
                    ) {
                      return;
                    }
                    setLocation({ x: data.x, y: data.y });
                    const rectComp = containerComponent.getBoundingClientRect();

                    const rectItem = draggableComponent.getBoundingClientRect();

                    const x =
                      (Math.abs(rectItem.left - rectComp.left) * 100) /
                      rectComp.width;

                    const y =
                      (Math.abs(rectItem.top - rectComp.top) * 100) /
                      rectComp.height;
                    setDimension({ ...dimension, x: x, y: y });
                    // putSignature.mutate(
                    //   {
                    //     body: {
                    //       field_name: signatureData.field_name,
                    //       page: pdfPage.currentPage,
                    //       dimension: {
                    //         x: x,
                    //         y: y,
                    //         width: -1,
                    //         height: -1,
                    //       },
                    //       visible_enabled: true,
                    //     },
                    //     field: signatureData.type.toLowerCase(),
                    //     documentId: workFlow.documentId,
                    //   }
                    // {
                    //   onSuccess: () => {
                    //     queryClient.invalidateQueries({
                    //       queryKey: ["getField"],
                    //     });
                    //   },
                    // }
                    // );
                  }
                }}
                disabled={
                  isSetPos ||
                  signerId +
                    "_" +
                    signatureData.type +
                    "_" +
                    signatureData.suffix !==
                    signatureData.field_name
                }
              >
                <ResizableBox
                  width={
                    signatureData.dimension?.width
                      ? signatureData.dimension?.width * (pdfPage.width / 100)
                      : Infinity
                  }
                  height={
                    signatureData.dimension?.height
                      ? signatureData.dimension?.height * (pdfPage.height / 100)
                      : 150
                  }
                  style={{
                    position: "absolute",
                    // borderRadius: "6px",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                    opacity: signatureData.verification === undefined ? 1 : 0,
                    transition: isControlled ? `transform 0.3s` : `none`,
                  }}
                  minConstraints={[
                    isSetPos ||
                    signerId +
                      "_" +
                      signatureData.type +
                      "_" +
                      signatureData.suffix !==
                      signatureData.field_name
                      ? signatureData.dimension?.width * (pdfPage.width / 100)
                      : pdfPage
                      ? (pdfPage.width * 20) / 100
                      : 200,
                    isSetPos ||
                    signerId +
                      "_" +
                      signatureData.type +
                      "_" +
                      signatureData.suffix !==
                      signatureData.field_name
                      ? signatureData.dimension?.height * (pdfPage.height / 100)
                      : pdfPage
                      ? (pdfPage.height * 5) / 100
                      : 50,
                  ]}
                  maxConstraints={[
                    isSetPos ||
                    signerId +
                      "_" +
                      signatureData.type +
                      "_" +
                      signatureData.suffix !==
                      signatureData.field_name
                      ? signatureData.dimension?.width * (pdfPage.width / 100)
                      : pdfPage
                      ? maxPosibleResizeWidth
                      : 200,
                    isSetPos ||
                    signerId +
                      "_" +
                      signatureData.type +
                      "_" +
                      signatureData.suffix !==
                      signatureData.field_name
                      ? signatureData.dimension?.height * (pdfPage.height / 100)
                      : pdfPage
                      ? maxPosibleResizeHeight
                      : 200,
                  ]}
                  onResize={(e, { size }) => {}}
                  onResizeStop={(e, { size }) => {
                    // console.log("e: ", e);
                    if (
                      isSetPos ||
                      signerId +
                        "_" +
                        signatureData.type +
                        "_" +
                        signatureData.suffix !==
                        signatureData.field_name
                    )
                      return;
                    setDimension({
                      ...dimension,
                      width: (size.width / pdfPage.width) * 100,
                      height: (size.height / pdfPage.height) * 100,
                    });

                    // putSignature.mutate(
                    //   {
                    //     body: {
                    //       field_name: signatureData.field_name,
                    //       page: pdfPage.currentPage,
                    //       dimension: {
                    //         x: signatureData.dimension.x,
                    //         y: signatureData.dimension.y,
                    //         width: (size.width / pdfPage.width) * 100,
                    //         height: (size.height / pdfPage.height) * 100,
                    //       },
                    //       visible_enabled: true,
                    //     },
                    //     field: signatureData.type.toLowerCase(),
                    //     documentId: workFlow.documentId,
                    //   }
                    //   // {
                    //   //   onSuccess: () => {
                    //   //     queryClient.invalidateQueries({
                    //   //       queryKey: ["getField"],
                    //   //     });
                    //   //   },
                    //   // }
                    // );
                  }}
                  className={`sig1 choioi-${index}`}
                >
                  <Box
                    id={`sigDrag1-${index}`}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {value == 0 && (
                      <TextSignForm
                        ref={textElement}
                        dataSigning={dataSigning}
                        headerFooter={headerFooter}
                        formattedDatetime={formattedDatetime}
                        onDisableSubmit={onDisableSubmit}
                        watch={watch}
                        control={control}
                        showInput={true}
                      />
                    )}
                    {value == 1 && (
                      <DrawSignForm
                        ref={textElement}
                        dataSigning={dataSigning}
                        headerFooter={headerFooter}
                        formattedDatetime={formattedDatetime}
                        onDisableSubmit={onDisableSubmit}
                        watch={watch}
                        control={control}
                        showInput={true}
                      />
                    )}

                    {value == 2 && (
                      <UploadSignForm
                        ref={textElement}
                        dataSigning={dataSigning}
                        headerFooter={headerFooter}
                        formattedDatetime={formattedDatetime}
                        onDisableSubmit={onDisableSubmit}
                        watch={watch}
                        control={control}
                        showInput={true}
                      />
                    )}
                  </Box>
                </ResizableBox>
              </Draggable>
            )}
          {props.annotationLayer.children}
          <div style={{ userSelect: "none" }}>{props.textLayer.children}</div>
        </div>
      );
    };

    useEffect(() => {
      console.log(11);
      html2canvas(textElement?.current, { backgroundColor: null }).then(
        (canvas) => {
          const data64 = canvas.toDataURL();
          setImgBase64(data64);
          console.log(12);
        }
      );
    }, [signatureData]);
    const pageLayout = {
      transformSize: ({ size }) => ({
        height: size.height + 30,
        width: size.width + 30,
      }),
    };
    return (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "70%",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          component="div"
          id="scroll-dialog-title"
          sx={{
            backgroundColor: "dialogBackground.main",
            p: "10px 20px",
            height: "51px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              display: "inline-block",
              color: "signingtextBlue.main",
              borderBottom: "4px solid",
              borderColor: "signingtextBlue.main",
              borderRadius: "5px",
              paddingBottom: "5px",
            }}
          >
            {/* {title} */}
            {t("0-common.preview")}
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            overflow: "scroll",
          }}
        >
          <Box
            sx={{
              width: "100%",
              position: "relative",
            }}
          >
            <PDFViewer
              base64={workFlow.pdfBase64}
              renderPage={renderPage}
              pageLayout={pageLayout}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{ borderRadius: "10px", borderColor: "borderColor.main" }}
            onClick={() => {
              setLocation(dragPosition);

              handleOpenResize(false);
              setImgBase64(null);
            }}
          >
            {t("0-common.cancel")}
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "10px",
              borderColor: "borderColor.main",
              marginLeft: "20px !important",
            }}
            type="button"
            onClick={() => {
              handleSign();
              handleOpenResize(false);
              setTimeout(() => {
                handleSubmitClick();
              }, 1000);
            }}
          >
            {t("0-common.continue")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

ReviewSign.displayName = "ReviewSign";

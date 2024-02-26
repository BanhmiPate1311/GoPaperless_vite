/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { checkIsPosition, getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { DrawSignForm, TextSignForm, UploadSignForm } from ".";

export const PreviewDocument = ({
  props,
  signatureData,
  index,
  setPosition,
  setDimension,
  workFlow,
  value,
  control,
  watch,
  textElement,
  dataSigning,
  headerFooter,
  formattedDatetime,
  onDisableSubmit,
}) => {
  const pdfPage = useMemo(
    () => ({
      currentPage: props.pageIndex + 1,
      height: props.height,
      width: props.width,
      zoom: props.scale,
      actualHeight: props.height / props.scale,
      actualWidth: props.width / props.scale,
      rotate: props.rotation,
    }),
    [props.pageIndex, props.height, props.width, props.scale, props.rotation]
  );
  console.log("signatureData");
  const [dragPosition, setDragPosition] = useState({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(true);
  const [isSetPos, setIsSetPos] = useState(false);
  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);
  const signerId = signer.signerId;

  const newPos = useRef({
    x: (signatureData.dimension?.x * pdfPage.width) / 100,
    y: (signatureData.dimension?.y * pdfPage.height) / 100,
  });

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - signatureData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - signatureData.dimension?.y)) / 100;

  useEffect(() => {
    setIsSetPos(checkIsPosition(workFlow));
  }, [workFlow]);
  useEffect(() => {
    setDragPosition({
      x: (signatureData.dimension?.x * pdfPage.width) / 100,
      y: (signatureData.dimension?.y * pdfPage.height) / 100,
    });
  }, [signatureData, pdfPage]);
  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`rauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };
  return (
    <div
      id={`pdf-view1-${props.pageIndex}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        // cursor: `url(${mouse}), auto`,
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
            position={dragPosition}
            cancel=".topBar"
            onStart={(e, data) => {
              // setLocation({ x: data.x, y: data.y });
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

              const containerRect = containerComponent.getBoundingClientRect();

              const draggableRect = draggableComponent.getBoundingClientRect();
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
                if (dragPosition?.x === data.x && dragPosition?.y === data.y) {
                  return;
                }
                setDragPosition({ x: data.x, y: data.y });
                const rectComp = containerComponent.getBoundingClientRect();

                const rectItem = draggableComponent.getBoundingClientRect();

                const x =
                  (Math.abs(rectItem.left - rectComp.left) * 100) /
                  rectComp.width;

                const y =
                  (Math.abs(rectItem.top - rectComp.top) * 100) /
                  rectComp.height;
                setPosition({ x: x, y: y });
                // setDimension({ ...dimension, x: x, y: y });
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

PreviewDocument.propTypes = {
  props: PropTypes.object,
};

export default PreviewDocument;

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { fpsService } from "@/services/fps_service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import Signature from "./Signature";
// import Signature from "./Signature";
export const Document = ({ props, signatures, workFlow }) => {
  // console.log("signatures: ", signatures);
  // console.log("props: ", props);

  const queryClient = useQueryClient();

  const dataTet = queryClient.getQueryData(["hoyhoy"]);
  console.log("dataTet: ", dataTet);
  const pdfPage = {
    currentPage: props.pageIndex + 1,
    height: props.height,
    width: props.width,
    zoom: props.scale,
    actualHeight: props.height / props.scale,
    actualWidth: props.width / props.scale,
  };

  const putSignature = useMutation({
    mutationFn: ({ body, field }) => {
      return fpsService.putSignature(
        { documentId: workFlow.documentId },
        body,
        field
      );
    },
    // onSuccess: () => {
    //   // queryClient.invalidateQueries({ queryKey: ["getField"] });
    //   // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
    // },
  });

  const handleValidateSignature = (
    {
      updatedSignature = {
        field_name: null,
        dimension: {
          x: null,
          y: null,
          width: null,
          height: null,
        },
        page: null,
      },
    },
    updatedArraySignatures = signatures
  ) => {
    const updatedSignatureWidth = updatedSignature.dimension.width;
    const updatedSignatureHeight = updatedSignature.dimension.height;
    const updatedSignatureLeft = updatedSignature.dimension.x;
    const updatedSignatureTop = updatedSignature.dimension.y;

    for (let i = 0; i < updatedArraySignatures.length; i++) {
      if (updatedSignature.page !== updatedArraySignatures[i].page) continue;
      if (updatedSignature.field_name === updatedArraySignatures[i].field_name)
        continue;

      const signature = updatedArraySignatures[i];
      const signatureWidth = signature.dimension.width;
      const signatureHeight = signature.dimension.height;
      const signatureLeft = signature.dimension.x;
      const signatureTop = signature.dimension.y;

      if (
        updatedSignatureLeft < signatureLeft + signatureWidth &&
        updatedSignatureTop < signatureTop + signatureHeight &&
        updatedSignatureLeft + updatedSignatureWidth > signatureLeft &&
        updatedSignatureTop + updatedSignatureHeight > signatureTop
      ) {
        return false;
      }
    }
    return true;
  };

  const dropSigRef = useRef(null);

  const [, dropSig] = useDrop({
    accept: "Signature",
    drop: async (item, monitor) => {
      try {
        const offset = monitor.getSourceClientOffset();
        // console.log("pdfPage: ", pdfPage);
        if (offset && dropSigRef.current) {
          const dropTargetXy = dropSigRef.current.getBoundingClientRect();
          const widthDoc = pdfPage.width;
          const heightDoc = pdfPage.height;
          const widthItem = item.dimension.width * (pdfPage.width / 100);
          const heightItem = item.dimension.height * (pdfPage.height / 100);

          let left = offset.x - dropTargetXy.left;
          let top = offset.y - dropTargetXy.top;

          if (left + widthItem > widthDoc) {
            const diff = left + widthItem - widthDoc;
            // sometimes the widthDoc rendered by html is not equal to the widthDoc in state
            left = left - diff < 0 ? 0 : left - diff;
          } else if (left < 0) {
            const diff = left;
            left = 0;
          }

          if (top + heightItem > heightDoc) {
            const diff = top + heightItem - heightDoc;
            // sometimes the heightDoc rendered by html is not equal to the heightDoc in state
            top = top - diff < 0 ? 0 : top - diff;
          } else if (top < 0) {
            top = 0;
          }

          if (
            !handleValidateSignature({
              updatedSignature: {
                field_name: item.field_name,
                dimension: {
                  x: (left / widthDoc) * 100,
                  y: (top / heightDoc) * 100,
                  width: item.dimension.width,
                  height: item.dimension.height,
                },
                page: pdfPage.currentPage,
              },
              signatures,
            })
          )
            return;

          let body = {};
          switch (item.type) {
            case "SIGNATURE": {
              body = {
                field_name: item.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: (left / widthDoc) * 100,
                  y: (top / heightDoc) * 100,
                  width: item.dimension.width,
                  height: item.dimension.height,
                },
                visible_enabled: true,
              };
              break;
            }
            case "TEXT": {
              body = {
                field_name: item.field_name,
                page: pdfPage.currentPage,
                type: "TEXT_FIELD",
                format_type: item.format_type,
                value: item.value,
                read_only: item.read_only,
                multiline: item.multiline,
                color: item.color,
                align: item.align,
                dimension: {
                  x: (left / widthDoc) * 100,
                  y: (top / heightDoc) * 100,
                  width: item.dimension.width,
                  height: item.dimension.height,
                },
                visible_enabled: true,
              };
              break;
            }
            default:
              throw new Error("Invalid item.type");
          }

          putSignature.mutate({
            body,
            field: item.type.toLowerCase(),
          });
          // await fpsService.putSignature(pdfInfo, body, {
          //   field: item.type.toLowerCase(),
          // });

          handleDragSignature({
            ...item,
            field_name: item.field_name,
            dimension: {
              x: (left / widthDoc) * 100,
              y: (top / heightDoc) * 100,
              width: item.dimension.width,
              height: item.dimension.height,
            },
            page: pdfPage.currentPage,
          });
        }
      } catch (error) {
        // message.error("Failed to add signature");
        console.log(error);
      }
    },
  });

  const handleDragSignature = (value) => {
    console.log("value: ", value);
    const { field_name } = value;
    // setSignatures((prev) => {
    //   const index = prev.findIndex((item) => item.field_name === field_name);
    //   if (index !== -1) {
    //     return prev.map((item, i) => (i === index ? data : item));
    //   } else {
    //     return [...prev, data];
    //   }
    // });
    queryClient.setQueryData(["getField"], (prev) => {
      // console.log("prev: ", prev);
      const index = prev.data.signature.findIndex(
        (item) => item.field_name === field_name
      );
      if (index !== -1) {
        return {
          ...prev,
          data: {
            ...prev.data,
            signature: prev.data.signature.map((item, i) => {
              return i === index ? value : item;
            }),
          },
        };
      } else {
        return {
          ...prev,
          data: {
            ...prev.data,
            signature: [...prev.data.signature, value],
          },
        };
      }
    });
  };

  return (
    <div
      ref={dropSig(dropSigRef)}
      className="kakaka"
      style={{ width: "100%", height: "100%" }}
    >
      {props.canvasLayer.children}

      {signatures.map((signatureData, index) => {
        return (
          <Signature
            key={index}
            index={index}
            pdfPage={pdfPage}
            handleValidateSignature={handleValidateSignature}
            workFlow={workFlow}
            signatureData={signatureData}
          />
        );
      })}

      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "rgba(0, 0, 0, 0.2)",
            fontSize: `${8 * props.scale}rem`,
            fontWeight: "bold",
            textTransform: "uppercase",
            transform: "rotate(-45deg)",
            userSelect: "none",
          }}
        >
          Draft
        </div>
      </div>

      {props.annotationLayer.children}
      {props.textLayer.children}
    </div>
  );
};

export default Document;

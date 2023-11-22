/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { fpsService } from "@/services/fps_service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import Signature from "./Signature";
import { AdsClick } from "@mui/icons-material";
import { checkIsPosition } from "@/utils/commonFunction";
// import Signature from "./Signature";
export const Document = ({ props, workFlow, signatures }) => {
  // console.log("signatures: ", signatures);

  const queryClient = useQueryClient();

  // const workFlow = queryClient.getQueryData(["workflow"]);

  // const signatures = queryClient.getQueryData(["signatures"]);

  let isSetPos = checkIsPosition(workFlow);

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pdfRange = [];
  const cursor = [];
  useEffect(() => {
    // nghe sự kiện bên trong file pdf
    pdfRange[props.pageIndex] = document.getElementById(
      `pdf-view-${props.pageIndex}`
    );
    cursor[props.pageIndex] = document.querySelector(
      `.cursor-${props.pageIndex}`
    );

    const mouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left; // Xác định vị trí x dựa trên vị trí của chuột

      const y = e.clientY - rect.top;
      if (
        e.target instanceof SVGElement ||
        e.target.className.includes("MuiListItemText-primary") ||
        e.target.className.includes("MuiListItemButton-root")
      ) {
        cursor[props.pageIndex].style.display = "none";
      } else {
        pdfRange[props.pageIndex].style.cursor = "none";
        setMousePosition({
          x: x,
          y: y,
        });
        cursor[props.pageIndex].style.display = "block";
      }
    };

    const mouseOut = () => {
      cursor[props.pageIndex].style.display = "none";
    };

    pdfRange[props.pageIndex].addEventListener("mousemove", mouseMove);

    pdfRange[props.pageIndex].addEventListener("mouseleave", mouseOut);

    // // Trình nghe sự kiện click và mousedown toàn bộ trang
    // const handleGlobalClickAndMouseDown = (e) => {
    //   // console.log("e: ", e);
    //   // if (
    //   //   (menuRef.current.contains(e.target) &&
    //   //     e.target.className?.includes("pdf-page")) ||
    //   //   !menuRef.current.contains(e.target)
    //   // ) {
    //   //   handleCloseContextMenu();
    //   // }
    //   handleCloseContextMenu();
    // };

    return () => {
      // window.removeEventListener("mousedown", handleGlobalClickAndMouseDown);
      pdfRange[props.pageIndex].removeEventListener("mousemove", mouseMove);
      pdfRange[props.pageIndex].removeEventListener("mouseleave", mouseOut);
    };
  }, [props.scale, cursor, pdfRange]);

  return (
    <div
      ref={dropSig(dropSigRef)}
      className="kakaka"
      style={{ width: "100%", height: "100%", position: "relative" }}
      id={`pdf-view-${props.pageIndex}`}
    >
      <div
        className={`cursor cursor-${props.pageIndex}`}
        style={{
          top: mousePosition.y,
          left: mousePosition.x,
          pointerEvents: "none",
          translate: "-10px -10px",
          position: "absolute",
        }}
      >
        <AdsClick id="mouse-icon" />
        {!isSetPos && <div style={{ marginLeft: "20px" }}>Right Click</div>}
      </div>
      {props.canvasLayer.children}

      {signatures?.map((signatureData, index) => {
        return (
          <Signature
            key={index}
            index={index}
            pdfPage={pdfPage}
            handleValidateSignature={handleValidateSignature}
            signatureData={signatureData}
            workFlow={workFlow}
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

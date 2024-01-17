/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import mouse from "@/assets/images/svg/mouse-right2.svg";
import { checkIsPosition } from "@/utils/commonFunction";
import { useQueryClient } from "@tanstack/react-query";
import Signature from "./Signature";
import { TextBox } from ".";
// import Signature from "./Signature";
export const Document = ({ props, workFlow, signatures, textbox }) => {
  // console.log("signatures: ", signatures);

  const queryClient = useQueryClient();

  // const workFlow = queryClient.getQueryData(["workflow"]);

  // const signatures = queryClient.getQueryData(["signatures"]);

  let isSetPos = checkIsPosition(workFlow);
  // console.log("isSetPos: ", isSetPos);

  const pdfPage = {
    currentPage: props.pageIndex + 1,
    height: props.height,
    width: props.width,
    zoom: props.scale,
    actualHeight: props.height / props.scale,
    actualWidth: props.width / props.scale,
  };

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

  const handleDragSignature = (value) => {
    // console.log("value: ", value);
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
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const pdfRange = [];
  // const cursor = [];
  // useEffect(() => {
  //   // nghe sự kiện bên trong file pdf
  //   pdfRange[props.pageIndex] = document.getElementById(
  //     `pdf-view-${props.pageIndex}`
  //   );
  //   cursor[props.pageIndex] = document.querySelector(
  //     `.cursor-${props.pageIndex}`
  //   );

  //   const mouseMove = (e) => {
  //     if (isSetPos) return;
  //     const rect = e.currentTarget.getBoundingClientRect();
  //     const x = e.clientX - rect.left; // Xác định vị trí x dựa trên vị trí của chuột

  //     const y = e.clientY - rect.top;
  //     if (
  //       e.target instanceof SVGElement ||
  //       e.target.className.includes("MuiListItemText-primary") ||
  //       e.target.className.includes("MuiListItemButton-root")
  //     ) {
  //       cursor[props.pageIndex].style.display = "none";
  //     } else {
  //       pdfRange[props.pageIndex].style.cursor = "none";
  //       setMousePosition({
  //         x: x,
  //         y: y,
  //       });
  //       cursor[props.pageIndex].style.display = "block";
  //     }
  //   };

  //   const mouseOut = () => {
  //     cursor[props.pageIndex].style.display = "none";
  //   };

  //   pdfRange[props.pageIndex].addEventListener("mousemove", mouseMove);

  //   pdfRange[props.pageIndex].addEventListener("mouseleave", mouseOut);

  //   // // Trình nghe sự kiện click và mousedown toàn bộ trang
  //   // const handleGlobalClickAndMouseDown = (e) => {
  //   //   // console.log("e: ", e);
  //   //   // if (
  //   //   //   (menuRef.current.contains(e.target) &&
  //   //   //     e.target.className?.includes("pdf-page")) ||
  //   //   //   !menuRef.current.contains(e.target)
  //   //   // ) {
  //   //   //   handleCloseContextMenu();
  //   //   // }
  //   //   handleCloseContextMenu();
  //   // };

  //   return () => {
  //     // window.removeEventListener("mousedown", handleGlobalClickAndMouseDown);
  //     pdfRange[props.pageIndex].removeEventListener("mousemove", mouseMove);
  //     pdfRange[props.pageIndex].removeEventListener("mouseleave", mouseOut);
  //   };
  // }, [props.scale, cursor, pdfRange]);

  return (
    <div
      // ref={dropSig(dropSigRef)}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        // cursor: isSetPos ? "auto" : `url(${mouse}), auto`,
        cursor: `url(${mouse}), auto`,
        overflow: "hidden",
      }}
      id={`pdf-view-${props.pageIndex}`}
    >
      {props.canvasLayer.children}

      {signatures?.map((signatureData, index) => {
        // console.log("signatureData: ", signatureData.page);
        // console.log("pageIndex: ", props.pageIndex + 1);
        if (signatureData.page !== props.pageIndex + 1) return null;
        return (
          <Signature
            key={index}
            index={index}
            pdfPage={pdfPage}
            signatureData={signatureData}
            workFlow={workFlow}
          />
        );
      })}

      {textbox?.map((textData, index) => {
        if (textData.page !== props.pageIndex + 1) return null;
        return (
          <TextBox
            key={index}
            index={index}
            pdfPage={pdfPage}
            textData={textData}
            workFlow={workFlow}
          />
        );
      })}

      {props.annotationLayer.children}
      <div style={{ userSelect: "none" }}>{props.textLayer.children}</div>
    </div>
  );
};

export default Document;

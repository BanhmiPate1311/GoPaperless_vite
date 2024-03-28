/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import mouse from "@/assets/images/svg/mouse-right2.svg";
import { checkIsPosition } from "@/utils/commonFunction";
import { useQueryClient } from "@tanstack/react-query";
import { Initial, QrCode, Qrypto, TextBox } from ".";
import AddText from "./AddText";
import Signature from "./Signature";
// import Signature from "./Signature";
export const Document = ({
  props,
  workFlow,
  signatures,
  textbox,
  initial,
  qr,
  qrypto,
  textField,
  addText,
  openResize,
  setOpenResize,
}) => {
  // console.log("qrypto: ", qrypto);
  // console.log("signatures: ", signatures);

  const queryClient = useQueryClient();
  let isSetPos;
  if (signatures) {
    isSetPos = checkIsPosition(workFlow);
  } else {
    isSetPos = true;
  }

  const pdfPage = {
    currentPage: props.pageIndex + 1,
    height: props.height,
    width: props.width,
    zoom: props.scale,
    actualHeight: props.height / props.scale,
    actualWidth: props.width / props.scale,
    rotate: props.rotation,
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
    const { field_name } = value;
    queryClient.setQueryData(["getField"], (prev) => {
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
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: `url(${mouse}), auto`,
        overflow: "hidden",
      }}
      id={`pdf-view-${props.pageIndex}`}
    >
      {props.canvasLayer.children}
      {signatures?.map((signatureData, index) => {
        if (signatureData.page !== props.pageIndex + 1) return null;
        return (
          <Signature
            key={index}
            index={index}
            pdfPage={pdfPage}
            signatureData={signatureData}
            workFlow={workFlow}
            textField={textField}
            textbox={textbox}
            initial={initial}
            props={props}
            openResize={openResize}
            setOpenResize={setOpenResize}
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
      {addText?.map((addTextData, index) => {
        if (addTextData.page !== props.pageIndex + 1) return null;
        return (
          <AddText
            key={index}
            index={index}
            pdfPage={pdfPage}
            addTextData={addTextData}
            workFlow={workFlow}
          />
        );
      })}
      {initial?.map((initData, index) => {
        if (initData.page !== props.pageIndex + 1) return null;
        return (
          <Initial
            key={index}
            index={index}
            pdfPage={pdfPage}
            initData={initData}
            workFlow={workFlow}
            totalPages={props.doc._pdfInfo.numPages}
            initList={initial.map((item) => {
              return { ...item, documentName: workFlow.documentName };
            })}
          />
        );
      })}
      {qr?.map((qrData, index) => {
        if (qrData.page !== props.pageIndex + 1) return null;
        return (
          <QrCode
            key={index}
            index={index}
            pdfPage={pdfPage}
            qrData={qrData}
            workFlow={workFlow}
          />
        );
      })}
      {qrypto?.map((qryptoData, index) => {
        if (qryptoData.page !== props.pageIndex + 1) return null;
        return (
          <Qrypto
            key={index}
            index={index}
            pdfPage={pdfPage}
            qryptoData={qryptoData}
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

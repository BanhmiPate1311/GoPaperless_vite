/* eslint-disable no-unused-vars */
import { fpsService } from "@/services/fps_service";
import { checkIsPosition } from "@/utils/commonFunction";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "../../assets/style/react-resizable.css";

/* eslint-disable react/prop-types */
export const Signature = ({ index, pdfPage, signatureData, workFlow }) => {
  // console.log("signatureData: ", signatureData);
  const [isShowModalSignImage, setShowModalSignImage] = useState(false);
  // console.log("pdfPage: ", pdfPage);
  const queryClient = useQueryClient();
  const dragRef = useRef();

  // const workFlow = queryClient.getQueryData(["workflow"]);

  const signer = workFlow?.participants?.find(
    (item) => item.signerToken === workFlow.signerToken
  );
  const signerId = signer.signerId;
  const [isSetPos, setIsSetPos] = useState(false);
  // console.log("isSetPos: ", isSetPos);

  // console.log("signer: ", signer);
  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - signatureData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - signatureData.dimension?.y)) / 100;

  const putSignature = useMutation({
    mutationFn: ({ body, field }) => {
      return fpsService.putSignature(
        { documentId: workFlow.documentId },
        body,
        field
      );
    },
    onSuccess: (data, variable) => {
      variable.body.type = signatureData.type;
      // queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
      queryClient.setQueryData(["getField"], (prev) => {
        console.log("prev: ", prev);
        const index = prev.data.signature.findIndex(
          (item) => item.field_name === variable.body.field_name
        );
        console.log("index: ", index);
        if (index !== -1) {
          return {
            ...prev,
            data: {
              ...prev.data,
              signature: prev.data.signature.map((item, i) => {
                return i === index ? variable.body : item;
              }),
            },
          };
        } else {
          return {
            ...prev,
            data: {
              ...prev.data,
              signature: [...prev.data.signature, variable.body],
            },
          };
        }
      });
    },
  });

  useEffect(() => {
    // const metaInf1 = signer.metaInformation;
    setIsSetPos(checkIsPosition(workFlow));
  }, [workFlow]);

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        signatureData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
    },
  });

  const handleRemoveSignature = async () => {
    if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
    // setSignature(null);
  };

  const [{ isDragged }, drag] = useDrag({
    type: "Signature",
    item: {
      ...signatureData,
      index,
      dimension: {
        width: signatureData.dimension?.width,
        height: signatureData.dimension?.height,
      },
    },
    canDrag: signerId === signatureData.field_name && !isSetPos,
    end: (item, monitor) => {},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      isDragged: monitor.getItem(),
    }),
  });

  const TopBar = ({ signatureData }) => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          display: "flex",
        }}
      >
        <EditIcon
          style={{
            fontSize: "14px",
            zIndex: 10,
            color: "#6B7280",
            cursor: "pointer",
            opacity: 1,
          }}
          onMouseDown={() => setShowModalSignImage(true)}
        />
        <DeleteOutlineIcon
          onMouseDown={handleRemoveSignature}
          style={{
            fontSize: "14px",
            zIndex: 10,
            color: "#EF4444",
            cursor: "pointer",
            opacity: 1,
          }}
        />
      </div>
    );
  };

  if (signatureData.page !== null && signatureData.page !== pdfPage.currentPage)
    return null;

  return (
    <>
      {["SIGNATURE", "INITIAL"].includes(signatureData.type) && (
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
            top: signatureData.dimension?.y + "%",
            left: signatureData.dimension?.x + "%",
            zIndex: 100,
          }}
          // minConstraints={[
          //   signatureData.dimension?.width * (pdfPage.width / 100),
          //   signatureData.dimension?.height * (pdfPage.height / 100),
          // ]}
          // maxConstraints={[
          //   signatureData.dimension?.width * (pdfPage.width / 100),
          //   signatureData.dimension?.height * (pdfPage.height / 100),
          // ]}
          minConstraints={[
            isSetPos || signerId !== signatureData.field_name
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? (pdfPage.width * 20) / 100
              : 200,
            isSetPos || signerId !== signatureData.field_name
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? (pdfPage.height * 5) / 100
              : 50,
          ]}
          maxConstraints={[
            isSetPos || signerId !== signatureData.field_name
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            isSetPos || signerId !== signatureData.field_name
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          onResize={(e, { size }) => {
            // setSignature({
            //   ...signatureData,
            //   dimension: {
            //     ...signatureData.dimension,
            //     width: (size.width / pdfPage.width) * 100,
            //     height: (size.height / pdfPage.height) * 100,
            //   },
            // });
          }}
          onResizeStop={(e, { size }) => {
            // fpsService.putSignature(
            //   pdfInfo,
            //   {
            //     field_name: signatureData.field_name,
            //     page: pdfPage.currentPage,
            //     dimension: {
            //       x: signatureData.dimension.x,
            //       y: signatureData.dimension.y,
            //       width: (size.width / pdfPage.width) * 100,
            //       height: (size.height / pdfPage.height) * 100,
            //     },
            //     visible_enabled: true,
            //   },
            //   { field: signatureData.type.toLowerCase() }
            // );
            if (isSetPos || signerId !== signatureData.field_name) return;
            putSignature.mutate({
              body: {
                field_name: signatureData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: signatureData.dimension.x,
                  y: signatureData.dimension.y,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              field: signatureData.type.toLowerCase(),
            });
          }}
          className="mx-auto choioi"
        >
          <div
            // onDoubleClick={() => setShowModalSetting(true)}
            ref={drag(dragRef)}
            id="drag"
            // className={`flex shadow-2xl border text-white hover:cursor-move mx-auto z-10 relative bg-opacity-80 hover:bg-opacity-50`}
            style={{
              background:
                signatureData.signed || signerId !== signatureData.field_name
                  ? "#4574da"
                  : "#51d35a",
              height: "100%",
              position: "relative",
              // zIndex: 100,
            }}
          >
            <div>
              <TopBar signatureData={signatureData} />
              <p
                className="text-center"
                style={{
                  overflowWrap: "break-word",
                  fontSize: "10px",
                  marginTop: 0,
                }}
              >
                {signatureData.field_name}
              </p>
            </div>
          </div>
        </ResizableBox>
      )}
      {/* <ModalSingingImage
        isShowModalSignImage={isShowModalSignImage}
        setShowModalSignImage={setShowModalSignImage}
      /> */}
    </>
  );
};

export default Signature;

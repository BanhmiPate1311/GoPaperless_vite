/* eslint-disable no-unused-vars */
import { fpsService } from "@/services/fps_service";
import { checkIsPosition } from "@/utils/commonFunction";
import Close from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "../../assets/style/react-resizable.css";

/* eslint-disable react/prop-types */
export const Signature = ({ index, pdfPage, signatureData }) => {
  // console.log("signatureData: ", signatureData);
  // console.log("pdfPage: ", pdfPage);
  const queryClient = useQueryClient();
  const dragRef = useRef();

  const workFlow = queryClient.getQueryData(["workflow"]);

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

  const [showTopBar, setShowTopBar] = useState(false);

  const TopBar = ({ signatureData }) => {
    if (!showTopBar) return null;
    return (
      <div className={`z-10 flex`}>
        {signatureData.signed && (
          //   <CheckCircleFilled
          //     className="p-0.5 text-[16px] z-10 text-green-500 hover:cursor-pointer hover:opacity-80 rounded-full bg-white"
          //     onMouseDown={() => setShowModalVefication(true)}
          //   />
          <Close />
        )}
        {/* <CloseCircleFilled
          onMouseDown={handleRemoveSignature}
          className="p-0.5 text-[16px] z-10 text-red-500 hover:cursor-pointer hover:opacity-80 rounded-full bg-white"
        /> */}
        <div
          onClick={handleRemoveSignature}
          style={{
            background: "red",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            textAlign: "center",
          }}
        >
          {/* <Close
            style={{
              background: "red",
              color: "white",
              borderRadius: "50%",
            }}
          /> */}
          X
        </div>
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
            onMouseEnter={() => setShowTopBar(true)}
            onMouseLeave={() => setShowTopBar(false)}
            // className={`flex shadow-2xl border text-white hover:cursor-move mx-auto z-10 relative bg-opacity-80 hover:bg-opacity-50`}
            style={{
              background:
                signatureData.signed || signerId !== signatureData.field_name
                  ? "#4574da"
                  : "#51d35a",
              height: "100%",
              // zIndex: 100,
            }}
          >
            <div>
              <div
                style={{
                  position: "absolute",
                  top: signatureData.dimension?.y >= 5 && "0",
                  bottom: signatureData.dimension?.y < 5 && "0",
                  transform:
                    signatureData.dimension?.y < 5
                      ? "translateY(50%)"
                      : "translateY(-50%)",
                  left: signatureData.dimension?.x > 95 && "0",
                  right: signatureData.dimension?.x <= 95 && "0",
                }}
              >
                <TopBar signatureData={signatureData} />
              </div>
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
    </>
  );
};

export default Signature;

/* eslint-disable no-unused-vars */
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const QrCode = ({ index, pdfPage, qrData, workFlow }) => {
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  const [dragPosition, setDragPosition] = useState({
    x: (qrData.dimension?.x * pdfPage.width) / 100,
    y: (qrData.dimension?.y * pdfPage.height) / 100,
  });

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - qrData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - qrData.dimension?.y)) / 100;

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        qrData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
    },
  });

  const handleRemoveSignature = async () => {
    // setIsControlled(false);
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
    // setSignature(null);
  };

  const TopBar = () => {
    // console.log("signatureData: ", signatureData);
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          // display:
          // signerId + "_" + signatureData.type + "_" + signatureData.suffix ===
          // signatureData.field_name
          //   ? "flex"
          //   : "none",
          display: "flex",
          backgroundColor: "#D9DFE4",
          gap: "5px",
        }}
        className="topBar"
      >
        <SvgIcon
          component={SettingIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          //   onClick={() => handleOpenModalSetting(index)}
        />
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    // Sử dụng getElementsByClassName để lấy HTMLCollection
    const elements = document.getElementsByClassName(`qrrauria-${index}`);

    // Lặp qua các phần tử trong HTMLCollection và đặt thuộc tính style.display
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };
  return (
    <Draggable
      handle={`#qrDrag-${index}`}
      // bounds="parent"
      onDrag={() => handleDrag("block")}
      position={dragPosition}
      cancel=".topBar"
      onStart={(e, data) => {
        setDragPosition({ x: data.x, y: data.y });
        setIsControlled(false);
      }}
      onStop={(e, data) => {
        e.preventDefault();
        // console.log("data: ", data);
        // console.log("e: ", e);
        setIsControlled(true);
        handleDrag("none");
        const draggableComponent = document.querySelector(`.qrbox-${index}`);
        const targetComponents = document.querySelectorAll(".sig");
        const containerComponent = document.getElementById(
          `pdf-view-${pdfPage.currentPage - 1}`
        );

        // Lấy kích thước của containerComponent
        const containerRect = containerComponent.getBoundingClientRect();

        // Lấy kích thước của draggableComponent
        const draggableRect = draggableComponent.getBoundingClientRect();

        // Kiểm tra xem draggableComponent có ra khỏi phạm vi của containerComponent không
        if (
          draggableRect.right > containerRect.right ||
          draggableRect.left < containerRect.left ||
          draggableRect.bottom > containerRect.bottom ||
          draggableRect.top < containerRect.top
        ) {
          // console.log(
          //   "draggableComponent đã ra khỏi phạm vi của containerComponent"
          // );
          return;
        } else {
          // console.log(
          //   "draggableComponent nằm trong phạm vi của containerComponent"
          // );
        }
        let isOverTarget = false; // Biến để kiểm soát việc thoát khỏi vòng lặp

        targetComponents.forEach((targetComponent) => {
          if (isOverTarget) return; // Nếu đã thoát khỏi vòng lặp, không kiểm tra phần tử tiếp theo

          const targetRect = targetComponent.getBoundingClientRect();

          if (draggableComponent === targetComponent) return;

          // Kiểm tra xem component có đè lên target không
          if (
            draggableRect.left < targetRect.right &&
            draggableRect.right > targetRect.left &&
            draggableRect.top < targetRect.bottom &&
            draggableRect.bottom > targetRect.top
          ) {
            isOverTarget = true;
            console.log("Draggable component is over the target component");
          }
        });

        // console.log("isOverTarget: ", isOverTarget);
        if (
          (dragPosition?.x === data.x && dragPosition?.y === data.y) ||
          isOverTarget
        ) {
          return;
        }
        setDragPosition({ x: data.x, y: data.y });
        const rectComp = containerComponent.getBoundingClientRect();
        // console.log("rectComp: ", rectComp);

        const rectItem = draggableComponent.getBoundingClientRect();
        // console.log("rectItem: ", rectItem);

        const x =
          (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width; // Xác định vị trí x dựa trên vị trí của chuột

        const y =
          (Math.abs(rectItem.top - rectComp.top) * 100) / rectComp.height;

        putSignature.mutate(
          {
            body: {
              field_name: qrData.field_name,
              page: pdfPage.currentPage,
              dimension: {
                x: x,
                y: y,
                width: -1,
                height: -1,
              },
              visible_enabled: true,
            },
            field: "initial",
            documentId: workFlow.documentId,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["getField"] });
            },
          }
        );
      }}
      disabled={
        signerId + "_" + qrData.type + "_" + qrData.suffix !== qrData.field_name
      }
    >
      <ResizableBox
        width={
          qrData.dimension?.width
            ? qrData.dimension?.width * (pdfPage.width / 100)
            : Infinity
        }
        height={
          qrData.dimension?.height
            ? qrData.dimension?.height * (pdfPage.height / 100)
            : 150
        }
        style={{
          position: "absolute",
          // top: qrData.dimension?.y + "%",
          // left: qrData.dimension?.x + "%",
          zIndex: 100,
          // opacity: qrData.verification === undefined ? 1 : 0,
          transition: isControlled ? `transform 0.3s` : `none`,
        }}
        minConstraints={[
          signerId + "_" + qrData.type + "_" + qrData.suffix !==
          qrData.field_name
            ? qrData.dimension?.width * (pdfPage.width / 100)
            : pdfPage
            ? 120
            : 200,

          signerId + "_" + qrData.type + "_" + qrData.suffix !==
          qrData.field_name
            ? qrData.dimension?.height * (pdfPage.height / 100)
            : pdfPage
            ? 120
            : 50,
        ]}
        maxConstraints={[
          signerId + "_" + qrData.type + "_" + qrData.suffix !==
          qrData.field_name
            ? qrData.dimension?.width * (pdfPage.width / 100)
            : pdfPage
            ? maxPosibleResizeWidth
            : 200,

          signerId + "_" + qrData.type + "_" + qrData.suffix !==
          qrData.field_name
            ? qrData.dimension?.height * (pdfPage.height / 100)
            : pdfPage
            ? maxPosibleResizeHeight
            : 200,
        ]}
        onResize={(e, { size }) => {
          // setShowTopbar(false);
          // setSignature({
          //   ...signatureData,
          //   dimension: {
          //     ...signatureData.dimension,
          //     width: (size.width / pdfPage.width) * 100,
          //     height: (size.height / pdfPage.height) * 100,
          //   },
          // });
        }}
        // onClick={(e) => {
        //   console.log("e: ", e);
        //   return;
        // }}
        onResizeStop={(e, { size }) => {
          // console.log("e: ", e);
          if (
            signerId + "_" + qrData.type + "_" + qrData.suffix !==
            qrData.field_name
          )
            return;
          putSignature.mutate(
            {
              body: {
                field_name: qrData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              field: "text",
              documentId: workFlow.documentId,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getField"] });
              },
            }
          );
        }}
        className={`sig qrbox-${index}`}
      >
        <Box
          id={`qrDrag-${index}`}
          sx={{
            height: "100%",
            position: "relative",
            // padding: "10px",
            // zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            border: "2px solid",
            borderColor: "#e1e1e1",
          }}
          onMouseMove={(e) => {
            setShowTopbar(true);
          }}
          onMouseLeave={(e) => {
            setShowTopbar(false);
          }}
          // onClick={(e) => {
          //   console.log("e: ", e);
          // }}
          // onDoubleClick={(e) => {
          //   // if (isControlled) return;
          //   if (signatureData.verification) {
          //     console.log("show signature verification");
          //     toggleSigDetail(index);
          //   } else if (
          //     signerId +
          //       "_" +
          //       signatureData.type +
          //       "_" +
          //       signatureData.suffix !==
          //     signatureData.field_name
          //   ) {
          //     return;
          //   } else if (
          //     e.target.id === "drag" ||
          //     e.target.parentElement?.id === "drag" ||
          //     e.target.id === "click-duoc"
          //   ) {
          //     // Your existing logic for opening the signing form...
          //     handleOpenSigningForm(index);
          //   }
          // }}
        >
          {showTopbar && <TopBar qrData={qrData} />}
          <span
            className={`qrrauria-${index} topline`}
            style={{ display: "none" }}
          ></span>
          <span
            className={`qrrauria-${index} rightline`}
            style={{ display: "none" }}
          ></span>
          <span
            className={`qrrauria-${index} botline`}
            style={{ display: "none" }}
          ></span>
          <span
            className={`qrrauria-${index} leftline`}
            style={{ display: "none" }}
          ></span>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundImage: `url(data:image/png;base64,${qrData.image_qr})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            alt="The house from the offer."
          />
        </Box>
      </ResizableBox>
    </Draggable>
  );
};

QrCode.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  qrData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default QrCode;

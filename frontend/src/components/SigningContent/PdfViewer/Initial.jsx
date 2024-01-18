/* eslint-disable no-unused-vars */
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ReactComponent as SignIcon } from "@/assets/images/svg/sign_icon.svg";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const Initial = ({ index, pdfPage, initData, workFlow }) => {
  const queryClient = useQueryClient();

  const [dragPosition, setDragPosition] = useState(null);
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  const newPos = useRef({ x: null, y: null });

  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - initData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - initData.dimension?.y)) / 100;

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        initData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (initData.dimension?.x * pdfPage.width) / 100,
      y: (initData.dimension?.y * pdfPage.height) / 100,
    });
  }, [initData]);

  const handleRemoveSignature = async () => {
    console.log("remove");
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
    // setSignature(null);
  };

  const TopBar = ({ initData }) => {
    // console.log("signatureData: ", signatureData);
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display:
            signerId + "_" + initData.type + "_" + initData.suffix ===
            initData.field_name
              ? "flex"
              : "none",
          // width: "100%",
          backgroundColor: "#D9DFE4",
        }}
        className="topBar"
      >
        <SvgIcon
          component={SignIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          //   onClick={() => handleOpenSigningForm(index)}
        />
        <SvgIcon
          component={SettingIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
            mx: "5px",
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
            // display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    // Sử dụng getElementsByClassName để lấy HTMLCollection
    const elements = document.getElementsByClassName(`initRauria-${index}`);

    // Lặp qua các phần tử trong HTMLCollection và đặt thuộc tính style.display
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };
  return (
    <>
      <Draggable
        handle={`#initDrag-${index}`}
        // bounds="parent"
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e, data) => {
          setDragPosition({ x: data.x, y: data.y });
          newPos.current.x = data.x;
          newPos.current.y = data.y;
          setIsControlled(false);
        }}
        onStop={(e, data) => {
          // console.log("data: ", data);
          // console.log("e: ", e);

          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(`.init-${index}`);
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
          let isOverTarget = false;

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

          if (isOverTarget) {
            // Đặt lại vị trí về ban đầu nếu đè lên một phần tử khác
            return;
          } else {
            if (dragPosition?.x === data.x && dragPosition?.y === data.y) {
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
            //   },
            //   {
            //     onSuccess: () => {
            //       queryClient.invalidateQueries({ queryKey: ["getField"] });
            //     },
            //   }
            // );
          }
        }}
        disabled={
          signerId + "_" + initData.type + "_" + initData.suffix !==
          initData.field_name
        }
      >
        <ResizableBox
          width={
            initData.dimension?.width
              ? initData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            initData.dimension?.height
              ? initData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            // top: initData.dimension?.y + "%",
            // left: initData.dimension?.x + "%",
            zIndex: 100,
            opacity: initData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          // minConstraints={[
          //   initData.dimension?.width * (pdfPage.width / 100),
          //   initData.dimension?.height * (pdfPage.height / 100),
          // ]}
          // maxConstraints={[
          //   initData.dimension?.width * (pdfPage.width / 100),
          //   initData.dimension?.height * (pdfPage.height / 100),
          // ]}
          minConstraints={[
            signerId + "_" + initData.type + "_" + initData.suffix !==
            initData.field_name
              ? initData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? (pdfPage.width * 20) / 100
              : 200,

            signerId + "_" + initData.type + "_" + initData.suffix !==
            initData.field_name
              ? initData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? (pdfPage.height * 5) / 100
              : 50,
          ]}
          maxConstraints={[
            signerId + "_" + initData.type + "_" + initData.suffix !==
            initData.field_name
              ? initData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            signerId + "_" + initData.type + "_" + initData.suffix !==
            initData.field_name
              ? initData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          onResize={(e, { size }) => {
            // setShowTopbar(false);
            // setSignature({
            //   ...initData,
            //   dimension: {
            //     ...initData.dimension,
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
              signerId + "_" + initData.type + "_" + initData.suffix !==
              initData.field_name
            )
              return;
            // putSignature.mutate(
            //   {
            //     body: {
            //       field_name: initData.field_name,
            //       page: pdfPage.currentPage,
            //       dimension: {
            //         x: -1,
            //         y: -1,
            //         width: (size.width / pdfPage.width) * 100,
            //         height: (size.height / pdfPage.height) * 100,
            //       },
            //       visible_enabled: true,
            //     },
            //     field: initData.type.toLowerCase(),
            //     documentId: workFlow.documentId,
            //   },
            //   {
            //     onSuccess: () => {
            //       queryClient.invalidateQueries({ queryKey: ["getField"] });
            //     },
            //   }
            // );
          }}
          className={`sig init-${index}`}
        >
          <Box
            id={`initDrag-${index}`}
            sx={{
              backgroundColor:
                initData.verification ||
                signerId + "_" + initData.type + "_" + initData.suffix !==
                  initData.field_name
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              height: "100%",
              position: "relative",
              padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                initData.verification ||
                signerId + "_" + initData.type + "_" + initData.suffix !==
                  initData.field_name
                  ? "black"
                  : "#EAB308",
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
            onClick={(e) => {
              if (
                signerId + "_" + initData.type + "_" + initData.suffix !==
                  initData.field_name ||
                (newPos.current.x !== dragPosition.x &&
                  newPos.current.y !== dragPosition.y)
              ) {
                return;
              } else if (
                e.target.id === `sigDrag-${index}` ||
                e.target.parentElement?.id === "drag" ||
                e.target.id === "click-duoc"
              ) {
                // Your existing logic for opening the signing form...
                // handleOpenSigningForm(index);
              }
            }}
          >
            <div>
              {showTopbar && <TopBar initData={initData} />}
              <span
                className={`initRauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`initRauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`initRauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`initRauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              init
            </div>
          </Box>
        </ResizableBox>
      </Draggable>
    </>
  );
};

Initial.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  initData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default Initial;

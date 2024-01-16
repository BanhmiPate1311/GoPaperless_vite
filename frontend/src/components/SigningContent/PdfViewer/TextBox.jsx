import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ReactComponent as SignIcon } from "@/assets/images/svg/sign_icon.svg";
import SvgIcon from "@mui/material/SvgIcon";
import PropTypes from "prop-types";
import { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import Box from "@mui/material/Box";

export const TextBox = ({ index, pdfPage, textData, workFlow }) => {
  console.log("textData: ", textData);
  const [isControlled, setIsControlled] = useState(true);
  const [showTopbar, setShowTopbar] = useState(false);
  const [dragPosition, setDragPosition] = useState(null);

  const TopBar = ({ textData }) => {
    // console.log("signatureData: ", signatureData);
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,

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
          }}
          //   onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const onDragStart = (event) => {
    // event.dataTransfer.setData("text", "dragging");
    handleDrag("block");
    // console.log("onDragStart: ", event);
  };

  const onDragEnd = (event) => {
    // console.log("onDragEnd: ", event);
    setIsControlled(true);
    handleDrag("none");
    const draggableComponent = document.querySelector(`.textbox-${index}`);
    const targetComponents = document.querySelectorAll(".sig");
    const containerComponent = document.getElementById(
      `pdf-view-${pdfPage.currentPage - 1}`
    );
  };

  const handleDrag = (type) => {
    // Sử dụng getElementsByClassName để lấy HTMLCollection
    const elements = document.getElementsByClassName(`textrauria-${index}`);

    // Lặp qua các phần tử trong HTMLCollection và đặt thuộc tính style.display
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  return (
    <>
      <Draggable
        handle="#drag"
        // bounds="parent"
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e) => {
          // console.log("drag");
          setIsControlled(false);
        }}
        onStop={(e, data) => {
          // console.log("data: ", data);
          // console.log("e: ", e);
          setIsControlled(true);
          handleDrag("none");
          const draggableComponent = document.querySelector(
            `.textbox-${index}`
          );
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
            // console.log("draggableRect: ", draggableRect);
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
            //         // width: signatureData.dimension?.width,
            //         // height: signatureData.dimension?.height,
            //       },
            //       visible_enabled: true,
            //     },
            //     field: signatureData.type.toLowerCase(),
            //     documentId: workFlow.documentId,
            //   }
            // );
          }
        }}
        // disabled={
        //   isSetPos ||
        //   signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
        //     signatureData.field_name
        // }
      >
        <ResizableBox
          width={
            textData.dimension?.width
              ? textData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            textData.dimension?.height
              ? textData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            top: textData.dimension?.y + "%",
            left: textData.dimension?.x + "%",
            zIndex: 100,
            // opacity: textData.verification === undefined ? 1 : 0,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          //   minConstraints={[
          //     isSetPos ||
          //     signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
          //       signatureData.field_name
          //       ? signatureData.dimension?.width * (pdfPage.width / 100)
          //       : pdfPage
          //       ? (pdfPage.width * 20) / 100
          //       : 200,
          //     isSetPos ||
          //     signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
          //       signatureData.field_name
          //       ? signatureData.dimension?.height * (pdfPage.height / 100)
          //       : pdfPage
          //       ? (pdfPage.height * 5) / 100
          //       : 50,
          //   ]}
          //   maxConstraints={[
          //     isSetPos ||
          //     signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
          //       signatureData.field_name
          //       ? signatureData.dimension?.width * (pdfPage.width / 100)
          //       : pdfPage
          //       ? maxPosibleResizeWidth
          //       : 200,
          //     isSetPos ||
          //     signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
          //       signatureData.field_name
          //       ? signatureData.dimension?.height * (pdfPage.height / 100)
          //       : pdfPage
          //       ? maxPosibleResizeHeight
          //       : 200,
          //   ]}
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
            console.log("e: ", e);
            // if (
            //   isSetPos ||
            //   signerId +
            //     "_" +
            //     signatureData.type +
            //     "_" +
            //     signatureData.suffix !==
            //     signatureData.field_name
            // )
            //   return;
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
            // );
          }}
          className={`sig textbox-${index}`}
        >
          <Box
            id="drag"
            sx={{
              backgroundColor: "rgba(254, 240, 138, 0.7)",
              height: "100%",
              position: "relative",
              padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor: "#EAB308",
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
            <div>
              {showTopbar && <TopBar textData={textData} />}
              <span
                className={`textrauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`textrauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`textrauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`textrauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              <Box
                id="click-duoc"
                variant="h5"
                width={"100%"}
                borderBottom="2px dotted"
                borderColor="#EAB308"
                textAlign={"center"}
                height="45px"
              >
                cuongcuong
              </Box>
            </div>
          </Box>
        </ResizableBox>
      </Draggable>
    </>
  );
};

TextBox.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  textData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default TextBox;

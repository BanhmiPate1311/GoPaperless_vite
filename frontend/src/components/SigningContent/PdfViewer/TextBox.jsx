/* eslint-disable no-unused-vars */
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { debounce, getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const TextBox = ({ index, pdfPage, textData, workFlow }) => {
  // console.log("index: ", index);
  // console.log("textData: ", textData.value);
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const [isControlled, setIsControlled] = useState(false);
  // console.log("isControlled: ", isControlled);
  const [showTopbar, setShowTopbar] = useState(false);
  const [dragPosition, setDragPosition] = useState({
    x: (textData.dimension?.x * pdfPage.width) / 100,
    y: (textData.dimension?.y * pdfPage.height) / 100,
  });
  // console.log("dragPosition: ", dragPosition);

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - textData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - textData.dimension?.y)) / 100;

  useEffect(() => {
    setDragPosition({
      x: (textData.dimension?.x * pdfPage.width) / 100,
      y: (textData.dimension?.y * pdfPage.height) / 100,
    });
  }, [textData]);

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        textData.field_name
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
    const elements = document.getElementsByClassName(`textrauria-${index}`);

    // Lặp qua các phần tử trong HTMLCollection và đặt thuộc tính style.display
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  const handlePlaceHolder = (type) => {
    switch (type) {
      case "NAME":
        return "Name";
      case "EMAIL":
        return "Email";
      case "JOB_TITLE":
        return "Job Title";
      case "COMPANY":
        return "Company";
    }
  };

  // const handleDefaultValue = (type) => {
  //   const signerText = workFlow?.participants?.find(
  //     (item) =>
  //       item.signerId + "_" + textData.type + "_" + textData.suffix ===
  //       textData.field_name
  //   );
  //   switch (type) {
  //     case "NAME":
  //       return signerText.lastName + " " + signerText.firstName;
  //     case "EMAIL":
  //       return signerText.email;
  //     case "JOB_TITLE":
  //       return signerText.metaInformation?.position || "";
  //     case "COMPANY":
  //       return signerText.metaInformation?.company || "";
  //   }
  // };

  const handleTextChange = debounce((e) =>
    putSignature.mutate({
      body: {
        field_name: textData.field_name,
        page: pdfPage.currentPage,
        dimension: {
          x: -1,
          y: -1,
          width: -1,
          height: -1,
        },
        visible_enabled: true,
        value: e.target.value,
      },
      field: "text",
      documentId: workFlow.documentId,
    })
  );

  return (
    <>
      <Draggable
        handle={`#textDrag-${index}`}
        // bounds="parent"
        onDrag={() => handleDrag("block")}
        position={dragPosition}
        cancel=".topBar"
        onStart={(e, data) => {
          setDragPosition({ x: data.x, y: data.y });
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
                field_name: textData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: x,
                  y: y,
                  width: -1,
                  height: -1,
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
        disabled={
          signerId + "_" + textData.type + "_" + textData.suffix !==
          textData.field_name
        }
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
            // top: textData.dimension?.y + "%",
            // left: textData.dimension?.x + "%",
            zIndex: 100,
            // opacity: textData.verification === undefined ? 1 : 0,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            signerId + "_" + textData.type + "_" + textData.suffix !==
            textData.field_name
              ? textData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? (pdfPage.width * 20) / 100
              : 200,

            signerId + "_" + textData.type + "_" + textData.suffix !==
            textData.field_name
              ? textData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? (pdfPage.height * 5) / 100
              : 50,
          ]}
          maxConstraints={[
            signerId + "_" + textData.type + "_" + textData.suffix !==
            textData.field_name
              ? textData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            signerId + "_" + textData.type + "_" + textData.suffix !==
            textData.field_name
              ? textData.dimension?.height * (pdfPage.height / 100)
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
              signerId + "_" + textData.type + "_" + textData.suffix !==
              textData.field_name
            )
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: textData.field_name,
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
          className={`sig textbox-${index}`}
        >
          <Box
            id={`textDrag-${index}`}
            sx={{
              backgroundColor:
                textData.verification ||
                signerId + "_" + textData.type + "_" + textData.suffix !==
                  textData.field_name
                  ? "rgba(217, 223, 228, 0.7)"
                  : "rgba(254, 240, 138, 0.7)",
              height: "100%",
              position: "relative",
              // padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              border: "2px dashed",
              borderColor:
                textData.verification ||
                signerId + "_" + textData.type + "_" + textData.suffix !==
                  textData.field_name
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
            {/* <Box
                id="click-duoc"
                variant="h5"
                width={"100%"}
                borderBottom="2px dotted"
                borderColor="#EAB308"
                textAlign={"center"}
                height="45px"
              >
                cuongcuong
              </Box> */}
            <TextField
              fullWidth
              size="small"
              margin="normal"
              // name={name}
              // value={code}
              value={textData.value}
              autoComplete="off"
              placeholder={handlePlaceHolder(textData.type)}
              sx={{
                my: 0,
                "& .MuiInputBase-root": {
                  // minHeight: "45px",
                  // height: textData.height,
                },
                "& fieldset": { border: "none" },
                // backgroundColor: "rgba(254, 240, 138, 0.7)",
              }}
              onChange={handleTextChange}
            />
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

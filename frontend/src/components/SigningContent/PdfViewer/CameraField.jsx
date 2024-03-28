import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const CameraField = ({ index, pdfPage, cameraData, workFlow }) => {
  const queryClient = useQueryClient();

  const [dragPosition, setDragPosition] = useState({
    x: (cameraData.dimension?.x * pdfPage.width) / 100,
    y: (cameraData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - cameraData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - cameraData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        cameraData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (cameraData.dimension?.x * pdfPage.width) / 100,
      y: (cameraData.dimension?.y * pdfPage.height) / 100,
    });
  }, [cameraData, pdfPage]);

  const handleRemoveSignature = async () => {
    // console.log("remove");
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
  };

  const TopBar = ({ cameraData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          // display:
          //   signerId + "_" + cameraData.type + "_" + cameraData.suffix ===
          //   cameraData.field_name
          //     ? "flex"
          //     : "none",
          // width: "100%",
          backgroundColor: "#D9DFE4",
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
            mx: "5px",
          }}
          // onClick={() => handleOpenModalSetting(index)}
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
    const elements = document.getElementsByClassName(`cameraRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (cameraData.page !== null && cameraData.page !== pdfPage.currentPage) ||
    cameraData.process_status === "PROCESSED"
  )
    return null;

  return (
    <>
      <Draggable
        handle={`#cameraDrag-${index}`}
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
          const draggableComponent = document.querySelector(`.camera-${index}`);
          const targetComponents = document.querySelectorAll(".sig");
          const containerComponent = document.getElementById(
            `pdf-view-${pdfPage.currentPage - 1}`
          );

          const containerRect = containerComponent.getBoundingClientRect();

          const draggableRect = draggableComponent.getBoundingClientRect();

          if (
            draggableRect.right > containerRect.right ||
            draggableRect.left < containerRect.left ||
            draggableRect.bottom > containerRect.bottom ||
            draggableRect.top < containerRect.top
          ) {
            return;
          }
          let isOverTarget = false;

          targetComponents.forEach((targetComponent) => {
            if (isOverTarget) return;

            const targetRect = targetComponent.getBoundingClientRect();

            if (draggableComponent === targetComponent) return;

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
            return;
          } else {
            if (dragPosition?.x === data.x && dragPosition?.y === data.y) {
              return;
            }
            setDragPosition({ x: data.x, y: data.y });
            const rectComp = containerComponent.getBoundingClientRect();

            const rectItem = draggableComponent.getBoundingClientRect();

            const x =
              (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width;

            const y =
              (Math.abs(rectItem.top - rectComp.top) * 100) / rectComp.height;

            putSignature.mutate(
              {
                body: {
                  field_name: cameraData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: x,
                    y: y,
                    width: -1,
                    height: -1,
                  },
                  visible_enabled: true,
                },
                field: "image",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }
        }}
        disabled={
          signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
            cameraData.field_name || cameraData.process_status === "PROCESSED"
        }
      >
        <ResizableBox
          width={
            cameraData.dimension?.width
              ? cameraData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            cameraData.dimension?.height
              ? cameraData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: cameraData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            cameraData.process_status === "PROCESSED" ||
            (cameraData.remark && cameraData.remark[0] !== signerId)
              ? cameraData.dimension?.width * (pdfPage.width / 100)
              : 0,
            cameraData.process_status === "PROCESSED" ||
            (cameraData.remark && cameraData.remark[0] !== signerId)
              ? cameraData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            cameraData.process_status === "PROCESSED" ||
            signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
              cameraData.field_name
              ? cameraData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            cameraData.process_status === "PROCESSED" ||
            signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
              cameraData.field_name
              ? cameraData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
              cameraData.field_name
            )
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: cameraData.field_name,
                  page: pdfPage.currentPage,
                  dimension: {
                    x: -1,
                    y: -1,
                    width: (size.width / pdfPage.width) * 100,
                    height: (size.height / pdfPage.height) * 100,
                  },
                  visible_enabled: true,
                },
                field: "image",
                documentId: workFlow.documentId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["getField"] });
                },
              }
            );
          }}
          className={`sig camera-${index}`}
        >
          <Box
            id={`cameraDrag-${index}`}
            sx={{
              backgroundColor:
                cameraData.verification ||
                signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
                  cameraData.field_name
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
                cameraData.verification ||
                signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
                  cameraData.field_name
                  ? "black"
                  : "#EAB308",
            }}
            onMouseMove={() => {
              setShowTopbar(true);
            }}
            onMouseLeave={() => {
              setShowTopbar(false);
            }}
            onMouseDown={() => {
              setTimeout(() => {
                setShowTopbar(false);
              }, 500);
            }}
            // onClick={(e) => {
            //   if (
            //     signerId + "_" + cameraData.type + "_" + cameraData.suffix !==
            //       cameraData.field_name ||
            //     (newPos.current.x !== dragPosition.x &&
            //       newPos.current.y !== dragPosition.y)
            //   ) {
            //     return;
            //   } else if (
            //     e.target.id === `sealDrag-${index}` ||
            //     e.target.parentElement?.id === `sealDrag-${index}` ||
            //     e.target.id === "click-duoc"
            //   ) {
            //     handleOpenSigningForm(index);
            //   }
            // }}
          >
            <div>
              {showTopbar && <TopBar cameraData={cameraData} />}
              <span
                className={`cameraRauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`cameraRauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`cameraRauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`cameraRauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              Camera
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      {/* {isOpenModalSetting[index] && (
    <SealSettingField
      open={isOpenModalSetting[index]}
      onClose={() => handleCloseModalSetting(index)}
      signer={signer}
      cameraData={cameraData}
      totalPages={totalPages}
      workFlow={workFlow}
      sealList={sealList}
    />
  )} */}
    </>
  );
};

CameraField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  cameraData: PropTypes.object,
  workFlow: PropTypes.object,
};

export default CameraField;

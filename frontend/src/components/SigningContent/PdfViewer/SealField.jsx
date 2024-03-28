import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ReactComponent as SignIcon } from "@/assets/images/svg/sign_icon.svg";
import { SealSettingField, SealSigningField } from "@/components/modalField";
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

export const SealField = ({
  index,
  pdfPage,
  sealData,
  workFlow,
  totalPages,
  sealList,
}) => {
  const queryClient = useQueryClient();

  const [dragPosition, setDragPosition] = useState({
    x: (sealData.dimension?.x * pdfPage.width) / 100,
    y: (sealData.dimension?.y * pdfPage.height) / 100,
  });
  const [isControlled, setIsControlled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);
  const [isOpenSigningForm, setOpenSigningForm] = useState([false]);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);

  const newPos = useRef({ x: null, y: null });
  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const maxPosibleResizeWidth =
    (pdfPage.width * (100 - sealData.dimension?.x)) / 100;
  const maxPosibleResizeHeight =
    (pdfPage.height * (100 - sealData.dimension?.y)) / 100;

  const putSignature = UseUpdateSig();

  const removeSignature = useMutation({
    mutationFn: () => {
      return fpsService.removeSignature(
        { documentId: workFlow.documentId },
        sealData.field_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getField"] });
    },
  });

  useEffect(() => {
    setDragPosition({
      x: (sealData.dimension?.x * pdfPage.width) / 100,
      y: (sealData.dimension?.y * pdfPage.height) / 100,
    });
  }, [sealData]);

  const handleOpenSigningForm = (index) => {
    const newValue = [...isOpenSigningForm];
    newValue[index] = true;
    setOpenSigningForm(newValue);
  };

  const handleCloseSigningForm = (index) => {
    const newValue = [...isOpenSigningForm];
    newValue[index] = false;
    setOpenSigningForm(newValue);
  };

  const handleOpenModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = true;
    setIsOpenModalSetting(newValue);
  };

  const handleCloseModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = false;
    setIsOpenModalSetting(newValue);
  };

  const handleRemoveSignature = async () => {
    // console.log("remove");
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
  };

  const TopBar = ({ sealData }) => {
    return (
      <div
        style={{
          position: "absolute",
          padding: "5px",
          top: -25,
          right: -2,
          zIndex: 10,
          display:
            signerId + "_" + sealData.type + "_" + sealData.suffix ===
            sealData.field_name
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
          onClick={() => handleOpenSigningForm(index)}
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
          onClick={() => handleOpenModalSetting(index)}
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
    const elements = document.getElementsByClassName(`sealRauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    (sealData.page !== null && sealData.page !== pdfPage.currentPage) ||
    sealData.process_status === "PROCESSED"
  )
    return null;

  return (
    <>
      <Draggable
        handle={`#sealDrag-${index}`}
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
          const draggableComponent = document.querySelector(`.seal-${index}`);
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
                  field_name: sealData.field_name,
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
          signerId + "_" + sealData.type + "_" + sealData.suffix !==
          sealData.field_name
        }
      >
        <ResizableBox
          width={
            sealData.dimension?.width
              ? sealData.dimension?.width * (pdfPage.width / 100)
              : Infinity
          }
          height={
            sealData.dimension?.height
              ? sealData.dimension?.height * (pdfPage.height / 100)
              : 150
          }
          style={{
            position: "absolute",
            zIndex: 100,
            opacity: sealData.verification === undefined ? 1 : 0.1,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            sealData.process_status === "PROCESSED" ||
            (sealData.remark && sealData.remark[0] !== signerId)
              ? sealData.dimension?.width * (pdfPage.width / 100)
              : 0,

            sealData.process_status === "PROCESSED" ||
            (sealData.remark && sealData.remark[0] !== signerId)
              ? sealData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            sealData.process_status === "PROCESSED" ||
            signerId + "_" + sealData.type + "_" + sealData.suffix !==
              sealData.field_name
              ? sealData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            sealData.process_status === "PROCESSED" ||
            signerId + "_" + sealData.type + "_" + sealData.suffix !==
              sealData.field_name
              ? sealData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          // eslint-disable-next-line no-unused-vars
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId + "_" + sealData.type + "_" + sealData.suffix !==
              sealData.field_name
            )
              return;
            putSignature.mutate(
              {
                body: {
                  field_name: sealData.field_name,
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
          className={`sig seal-${index}`}
        >
          <Box
            id={`sealDrag-${index}`}
            sx={{
              backgroundColor:
                sealData.verification ||
                signerId + "_" + sealData.type + "_" + sealData.suffix !==
                  sealData.field_name
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
                sealData.verification ||
                signerId + "_" + sealData.type + "_" + sealData.suffix !==
                  sealData.field_name
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
            onClick={(e) => {
              if (
                signerId + "_" + sealData.type + "_" + sealData.suffix !==
                  sealData.field_name ||
                (newPos.current.x !== dragPosition.x &&
                  newPos.current.y !== dragPosition.y)
              ) {
                return;
              } else if (
                e.target.id === `sealDrag-${index}` ||
                e.target.parentElement?.id === `sealDrag-${index}` ||
                e.target.id === "click-duoc"
              ) {
                handleOpenSigningForm(index);
              }
            }}
          >
            <div>
              {showTopbar && <TopBar sealData={sealData} />}
              <span
                className={`sealRauria-${index} topline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`sealRauria-${index} rightline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`sealRauria-${index} botline`}
                style={{ display: "none" }}
              ></span>
              <span
                className={`sealRauria-${index} leftline`}
                style={{ display: "none" }}
              ></span>
              Seal
            </div>
          </Box>
        </ResizableBox>
      </Draggable>

      {isOpenSigningForm[index] && (
        <SealSigningField
          open={isOpenSigningForm[index]}
          onClose={() => handleCloseSigningForm(index)}
          signer={signer}
          sealData={sealData}
          workFlow={workFlow}
        />
      )}
      {isOpenModalSetting[index] && (
        <SealSettingField
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          sealData={sealData}
          totalPages={totalPages}
          workFlow={workFlow}
          sealList={sealList}
        />
      )}
    </>
  );
};

SealField.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  sealData: PropTypes.object,
  workFlow: PropTypes.object,
  totalPages: PropTypes.number,
  sealList: PropTypes.array,
};

export default SealField;

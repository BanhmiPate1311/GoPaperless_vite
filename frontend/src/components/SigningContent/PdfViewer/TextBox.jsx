/* eslint-disable no-unused-vars */
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { TextBoxSettingField } from "@/components/modalField";
import { UseUpdateSig } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { capitalLize, getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

export const TextBox = ({ index, pdfPage, textData, workFlow }) => {
  // console.log("workFlow: ", workFlow);
  // console.log("index: ", index);
  // console.log("textData: ", textData);
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();

  const signer = getSigner(workFlow);
  const signerId = signer.signerId;

  const [textValue, setTextValue] = useState(textData.value);
  const [isControlled, setIsControlled] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState([false]);
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

  useEffect(() => {
    setTextValue(textData.value);
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
    },
  });

  const handleRemoveSignature = async () => {
    // setIsControlled(false);
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
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
          display:
            signerId + "_" + textData.type + "_" + textData.suffix !==
              textData.field_name || textData.process_status === "PROCESSED"
              ? "none"
              : "flex",
          zIndex: 10,
          // display: "flex",
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
          }}
          onClick={() => handleRemoveSignature(index)}
        />
      </div>
    );
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`textrauria-${index}`);

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
      case "JOBTITLE":
        return "Job Title";
      case "COMPANY":
        return "Company";
    }
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

  const valueRef = useRef(null);

  const handleChange = (e) => {
    setTextValue(e.target.value);
    if (valueRef.current) clearTimeout(valueRef.current);
    valueRef.current = setTimeout(() => {
      putSignature.mutate(
        {
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
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getField"] });
          },
        }
      );
    }, 1000);
  };

  if (textData.page !== null && textData.page !== pdfPage.currentPage)
    return null;

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
            (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width;

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
            textData.field_name || textData.process_status === "PROCESSED"
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
            zIndex: 100,
            transition: isControlled ? `transform 0.3s` : `none`,
          }}
          minConstraints={[
            signerId + "_" + textData.type + "_" + textData.suffix !==
              textData.field_name || textData.process_status === "PROCESSED"
              ? textData.dimension?.width * (pdfPage.width / 100)
              : 0,
            signerId + "_" + textData.type + "_" + textData.suffix !==
              textData.field_name || textData.process_status === "PROCESSED"
              ? textData.dimension?.height * (pdfPage.height / 100)
              : 0,
          ]}
          maxConstraints={[
            signerId + "_" + textData.type + "_" + textData.suffix !==
              textData.field_name || textData.process_status === "PROCESSED"
              ? textData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,

            signerId + "_" + textData.type + "_" + textData.suffix !==
              textData.field_name || textData.process_status === "PROCESSED"
              ? textData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? maxPosibleResizeHeight
              : 200,
          ]}
          onResize={(e, { size }) => {}}
          onResizeStop={(e, { size }) => {
            // console.log("e: ", e);
            if (
              signerId + "_" + textData.type + "_" + textData.suffix !==
                textData.field_name ||
              textData.process_status === "PROCESSED"
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
                  ? "rgba(217, 223, 228, 1)"
                  : "rgba(254, 240, 138, 1)",
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
            onMouseDown={(e) => {
              setTimeout(() => {
                setShowTopbar(false);
              }, 500);
            }}
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

            <TextField
              fullWidth
              size="small"
              margin="normal"
              // name={name}
              // value={code}
              value={textValue}
              autoComplete="off"
              // autoFocus={true}
              placeholder={capitalLize(textData.place_holder)}
              sx={{
                my: 0,
                "& .MuiInputBase-root": {
                  // minHeight: "45px",
                  // height: textData.height,
                },
                "& fieldset": { border: "none" },
                // backgroundColor: "rgba(254, 240, 138, 0.7)",
                fontWeight: "bold",
              }}
              onChange={handleChange}
              inputProps={{
                sx: { fontWeight: 600, padding: 0 }, // Sử dụng style để đặt fontWeight và padding
              }}
              InputProps={{
                readOnly: textData.process_status === "PROCESSED",
              }}
            />
            {textData.required && (
              <span
                style={{
                  position: "absolute",
                  right: "2px",
                  top: "-2px",
                  color: "#EAB308",
                }}
              >
                *
              </span>
            )}
          </Box>
        </ResizableBox>
      </Draggable>
      {isOpenModalSetting[index] && (
        <TextBoxSettingField
          open={isOpenModalSetting[index]}
          type={textData.type}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          textData={textData}
          participants={workFlow.participants}
          workFlow={workFlow}
        />
      )}
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

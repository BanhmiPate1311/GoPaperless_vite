/* eslint-disable no-unused-vars */
import { ReactComponent as GiunIcon } from "@/assets/images/svg/congiun.svg";
import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as SettingIcon } from "@/assets/images/svg/setting_icon.svg";
import { ReactComponent as SignIcon } from "@/assets/images/svg/sign_icon.svg";
import "@/assets/style/react-resizable.css";
import { ModalSigning } from "@/components/modal2";
import { ModalEidSign, ModalSmartid, ModalUsb } from "@/components/modal3";
import { ModalEid } from "@/components/modal_eid";
import { SignatureSetting } from "@/components/modal_setting";
import { fpsService } from "@/services/fps_service";
import { checkIsPosition, getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ResizableBox } from "react-resizable";
import { SigDetail } from ".";
import { SigningForm2 } from "../../modal1";

/* eslint-disable react/prop-types */
export const Signature = ({ index, pdfPage, signatureData, workFlow }) => {
  // console.log("workFlow: ", workFlow);
  // console.log("page: ", page);
  // console.log("index: ", index);
  // console.log("signatureData: ", signatureData);
  const [isOpenModalSetting, setOpenModalSetting] = useState([false]);

  const [isOpenSigningForm, setOpenSigningForm] = useState([false]);
  const [isShowModalSignImage, setShowModalSignImage] = useState([false]);
  const [isShowModalSmartid, setShowModalSmartid] = useState([false]);
  const [isShowModalUsb, setShowModalUsb] = useState([false]);
  const [isShowEidModal, setShowEidModal] = useState([false]);
  const [isShowEidModalSign, setShowEidModalSign] = useState([false]);

  const [showTopbar, setShowTopbar] = useState(false);
  const [isShowSigDetail, setIsShowSigDetail] = useState([false]);

  const queryClient = useQueryClient();
  const dragRef = useRef();
  const [dataSigning, setDataSigning] = useState({});

  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);
  const signerId = signer.signerId;
  const [isSetPos, setIsSetPos] = useState(false);
  // console.log("isSetPos: ", isSetPos);

  const [sigDetail, setSigDetail] = useState([]);
  // console.log("sigDetail: ", sigDetail);

  useEffect(() => {
    const sigInfor = queryClient.getQueryData(["getSignedInfo"]);
    const newSig1 = sigInfor
      .filter((item) => item.value.field_name === signatureData.field_name)
      .map((item) => {
        return { isSigned: true, ...item.value };
      });

    const newSig2 = workFlow.participants
      .filter(
        (item) =>
          item.certificate &&
          item.certificate.field_name === signatureData.field_name
      )
      .map((item) => {
        return { isSigned: false, ...item.certificate };
      });

    setSigDetail(...newSig1, ...newSig2);
  }, [signatureData]);

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
      // console.log("variable: ", variable);
      variable.body.type = signatureData.type;
      queryClient.invalidateQueries({ queryKey: ["getField"] });
      // queryClient.invalidateQueries({ queryKey: ["verifySignatures"] });
      // queryClient.setQueryData(["getField"], (prev) => {
      //   console.log("prev: ", prev);
      //   const index = prev.data.signature.findIndex(
      //     (item) => item.field_name === variable.body.field_name
      //   );
      //   console.log("index: ", index);
      //   if (index !== -1) {
      //     return {
      //       ...prev,
      //       data: {
      //         ...prev.data,
      //         signature: prev.data.signature.map((item, i) => {
      //           return i === index ? variable.body : item;
      //         }),
      //       },
      //     };
      //   } else {
      //     return {
      //       ...prev,
      //       data: {
      //         ...prev.data,
      //         signature: [...prev.data.signature, variable.body],
      //       },
      //     };
      //   }
      // });
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

  const toggleSigDetail = (index) => {
    const newIsOpen = [...isShowSigDetail];
    newIsOpen[index] = !newIsOpen[index];
    setIsShowSigDetail(newIsOpen);
  };

  const handleOpenModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = true;
    setOpenModalSetting(newValue);
  };

  const handleCloseModalSetting = (index) => {
    const newValue = [...isOpenModalSetting];
    newValue[index] = false;
    setOpenModalSetting(newValue);
  };

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

  const handleShowModalSignImage = (index) => {
    const newValue = [...isShowModalSignImage];
    newValue[index] = true;
    setShowModalSignImage(newValue);
  };

  const handleCloseModalSignImage = (index) => {
    const newValue = [...isShowModalSignImage];
    newValue[index] = false;
    setShowModalSignImage(newValue);
  };

  const handleShowModalSmartid = (index) => {
    const newValue = [...isShowModalSmartid];
    newValue[index] = true;
    setShowModalSmartid(newValue);
  };

  const handleCloseModalSmartid = (index) => {
    // console.log("yeye");
    const newValue = [...isShowModalSmartid];
    newValue[index] = false;
    setShowModalSmartid(newValue);
  };

  const handleShowModalUsb = (index) => {
    const newValue = [...isShowModalUsb];
    newValue[index] = true;
    setShowModalUsb(newValue);
  };

  const handleCloseModalUsb = (index) => {
    const newValue = [...isShowModalUsb];
    newValue[index] = false;
    setShowModalUsb(newValue);
  };

  const handleShowEidModal = (index) => {
    const newValue = [...isShowEidModal];
    newValue[index] = true;
    setShowEidModal(newValue);
  };

  const handleCloseEidModal = (index) => {
    const newValue = [...isShowEidModal];
    newValue[index] = false;
    setShowEidModal(newValue);
  };

  const handleShowEidModalSign = (index) => {
    const newValue = [...isShowEidModalSign];
    newValue[index] = true;
    setShowEidModalSign(newValue);
  };

  const handleCloseEidModalSign = (index) => {
    const newValue = [...isShowEidModalSign];
    newValue[index] = false;
    setShowEidModalSign(newValue);
  };

  const handleShowmodal = (index) => {
    switch (dataSigning.provider) {
      case "SMART_ID_SIGNING":
        handleShowModalSmartid(index);
        break;
      case "USB_TOKEN_SIGNING":
        handleShowModalUsb(index);
        break;
      case "ELECTRONIC_ID":
        handleShowEidModalSign(index);
        break;
    }
  };

  const handleRemoveSignature = async () => {
    console.log("remove");
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature.mutate();
    // setSignature(null);
  };

  const [{ isDragged }, drag] = useDrag({
    type: "Signature",
    // item: {
    //   ...signatureData,
    //   index,
    //   dimension: {
    //     width: signatureData.dimension?.width,
    //     height: signatureData.dimension?.height,
    //   },
    // },
    item: () => {
      // Your drag item properties...
      setShowTopbar(false);
      return {
        ...signatureData,
        index,
        dimension: {
          width: signatureData.dimension?.width,
          height: signatureData.dimension?.height,
        },
      };
    },
    canDrag:
      signerId + "_" + signatureData.type + "_" + signatureData.suffix ===
        signatureData.field_name &&
      !isSetPos &&
      signatureData.verification === undefined,

    end: (item, monitor) => {
      setShowTopbar(true);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      isDragged: monitor.getItem(),
    }),
  });

  const TopBar = ({ signatureData }) => {
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
            signerId + "_" + signatureData.type + "_" + signatureData.suffix ===
            signatureData.field_name
              ? "flex"
              : "none",
          // width: "100%",
          backgroundColor: "#D9DFE4",
        }}
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
            display: isSetPos ? "none" : "block",
          }}
          onClick={() => handleRemoveSignature(index)}
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
            opacity: signatureData.verification === undefined ? 1 : 0,
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
            isSetPos ||
            signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? (pdfPage.width * 20) / 100
              : 200,
            isSetPos ||
            signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.height * (pdfPage.height / 100)
              : pdfPage
              ? (pdfPage.height * 5) / 100
              : 50,
          ]}
          maxConstraints={[
            isSetPos ||
            signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
              signatureData.field_name
              ? signatureData.dimension?.width * (pdfPage.width / 100)
              : pdfPage
              ? maxPosibleResizeWidth
              : 200,
            isSetPos ||
            signerId + "_" + signatureData.type + "_" + signatureData.suffix !==
              signatureData.field_name
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
            if (
              isSetPos ||
              signerId +
                "_" +
                signatureData.type +
                "_" +
                signatureData.suffix !==
                signatureData.field_name
            )
              return;
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
          <Box
            ref={drag(dragRef)}
            id="drag"
            sx={{
              backgroundColor:
                signatureData.verification ||
                signerId +
                  "_" +
                  signatureData.type +
                  "_" +
                  signatureData.suffix !==
                  signatureData.field_name
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
                signatureData.verification ||
                signerId +
                  "_" +
                  signatureData.type +
                  "_" +
                  signatureData.suffix !==
                  signatureData.field_name
                  ? "black"
                  : "#EAB308",
            }}
            onMouseMove={(e) => {
              setShowTopbar(true);
            }}
            onMouseLeave={(e) => {
              setShowTopbar(false);
            }}
            onClick={(e) => {
              if (signatureData.verification) {
                console.log("show signature verification");
                toggleSigDetail(index);
              } else if (
                signerId +
                  "_" +
                  signatureData.type +
                  "_" +
                  signatureData.suffix !==
                signatureData.field_name
              ) {
                return;
              } else if (
                e.target.id === "drag" ||
                e.target.parentElement?.id === "drag" ||
                e.target.id === "click-duoc"
              ) {
                // Your existing logic for opening the signing form...
                handleOpenSigningForm(index);
              }
            }}
          >
            {showTopbar && <TopBar signatureData={signatureData} />}
            <Box
              id="click-duoc"
              variant="h5"
              width={"100%"}
              borderBottom="2px dotted"
              borderColor="#EAB308"
              textAlign={"center"}
              height="45px"
            >
              Signature
              <br />
              <SvgIcon
                component={GiunIcon}
                inheritViewBox
                sx={{
                  width: "15px",
                  height: "15px",
                  color: "#545454",
                  // cursor: "pointer",
                }}
                // onClick={() => handleOpenSigningForm(index)}
              />
            </Box>
          </Box>
        </ResizableBox>
      )}

      {/* {isOpenSigningForm[index] && (
        <SigningForm
          open={isOpenSigningForm[index]}
          onClose={() => handleCloseSigningForm(index)}
          // index={signatureData.page - 1}
          workFlow={workFlow}
          handleShowModalSignImage={() => handleShowModalSignImage(index)}
          handleShowEidModal={() => handleShowEidModal(index)}
          setDataSigning={setDataSigning}
        />
      )} */}
      {isOpenModalSetting[index] && (
        <SignatureSetting
          open={isOpenModalSetting[index]}
          onClose={() => handleCloseModalSetting(index)}
          signer={signer}
          setDataSigning={setDataSigning}
          signatureData={signatureData}
        />
      )}

      {isOpenSigningForm[index] && (
        <SigningForm2
          open={isOpenSigningForm[index]}
          onClose={() => handleCloseSigningForm(index)}
          // index={signatureData.page - 1}
          workFlow={workFlow}
          handleShowModalSignImage={() => handleShowModalSignImage(index)}
          handleShowEidModal={() => handleShowEidModal(index)}
          setDataSigning={setDataSigning}
          signatureData={signatureData}
        />
      )}

      {isShowEidModal[index] && (
        <ModalEid
          open={isShowEidModal[index]}
          onClose={() => handleCloseEidModal(index)}
          workFlow={dataSigning}
          setDataSigning={setDataSigning}
          handleShowModalSignImage={() => handleShowModalSignImage(index)}
        />
      )}

      {isShowModalSignImage[index] && (
        <ModalSigning
          open={isShowModalSignImage[index]}
          onClose={() => handleCloseModalSignImage(index)}
          signer={signer}
          dataSigning={dataSigning}
          setDataSigning={setDataSigning}
          handleShowmodal={() => handleShowmodal(index)}
        />
      )}
      {isShowModalSmartid[index] && (
        <ModalSmartid
          open={isShowModalSmartid[index]}
          onClose={() => handleCloseModalSmartid(index)}
          dataSigning={dataSigning}
        />
      )}
      {isShowModalUsb[index] && (
        <ModalUsb
          open={isShowModalUsb[index]}
          onClose={() => handleCloseModalUsb(index)}
          dataSigning={dataSigning}
          setDataSigning={setDataSigning}
        />
      )}

      {isShowEidModalSign[index] && (
        <ModalEidSign
          open={isShowEidModalSign[index]}
          onClose={() => handleCloseEidModalSign(index)}
          dataSigning={dataSigning}
          setDataSigning={setDataSigning}
          signatureData={signatureData}
        />
      )}

      {isShowSigDetail[index] && (
        <SigDetail
          open={isShowSigDetail[index]}
          signDetail={sigDetail}
          handleClose={() => toggleSigDetail(index)}
        />
      )}
    </>
  );
};

export default Signature;

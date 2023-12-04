/* eslint-disable no-unused-vars */
import { fpsService } from "@/services/fps_service";
import { checkIsPosition, getSigner } from "@/utils/commonFunction";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "../../assets/style/react-resizable.css";
import { ModalSigningImage2 } from "../ModalSigning";
import { ModalSmartid } from "../ModalSigning/ModalSmartid";
import SigningForm from "./SigningForm";
import ModalSingingImage from "./ModalSingingImage";
import { ModalUsb } from "../ModalSigning/ModalUsb";
import { EidModal } from "../EidModal";

/* eslint-disable react/prop-types */
export const Signature = ({ index, pdfPage, signatureData, workFlow }) => {
  // console.log("page: ", page);
  // console.log("index: ", index);
  // console.log("signatureData: ", signatureData);
  const [isOpenSigningForm, setOpenSigningForm] = useState([false]);
  const [isShowModalSignImage, setShowModalSignImage] = useState([false]);
  const [isShowModalSmartid, setShowModalSmartid] = useState([false]);
  const [isShowModalUsb, setShowModalUsb] = useState([false]);
  const [isShowEidModal, setShowEidModal] = useState([false]);

  // const [isOpenSigningForm, setOpenSigningForm] = useState(false);
  // const [isShowModalSignImage, setShowModalSignImage] = useState(false);

  // console.log("isShowModalSignImage: ", isShowModalSignImage);

  // console.log("pdfPage: ", pdfPage);
  const queryClient = useQueryClient();
  const dragRef = useRef();
  const [dataSigning, setDataSigning] = useState({});
  // console.log("dataSigning: ", dataSigning);

  // const workFlow = queryClient.getQueryData(["workflow"]);

  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);
  const signerId = signer.signerId;
  const [isSetPos, setIsSetPos] = useState(false);
  // console.log("isSetPos: ", isSetPos);

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
    console.log("yeye");
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

  const handleShowmodal = (index) => {
    switch (dataSigning.provider) {
      case "SMART_ID_SIGNING":
        handleShowModalSmartid(index);
        break;
      case "USB_TOKEN_SIGNING":
        handleShowModalUsb(index);
        break;
    }
  };

  // const handleOpenSigningForm = () => {
  //   setOpenSigningForm(true);
  // };

  // const handleCloseSigningForm = () => {
  //   setOpenSigningForm(false);
  // };

  // const handleShowModalSignImage = () => {
  //   setShowModalSignImage(true);
  // };

  // const handleCloseModalSignImage = () => {
  //   setShowModalSignImage(false);
  // };

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
    // console.log("signatureData: ", signatureData);
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          display: signerId === signatureData.field_name ? "flex" : "none",
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
          onMouseDown={() => handleOpenSigningForm(index)}
        />
        <DeleteOutlineIcon
          onMouseDown={() => handleRemoveSignature(index)}
          style={{
            fontSize: "14px",
            zIndex: 10,
            color: "#EF4444",
            cursor: "pointer",
            opacity: 1,
            display: isSetPos ? "none" : "block",
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
          <Box
            // onDoubleClick={() => setShowModalSetting(true)}
            ref={drag(dragRef)}
            id="drag"
            sx={{
              backgroundColor:
                signatureData.signed || signerId !== signatureData.field_name
                  ? "accordingBackGround.main"
                  : "signerBackGround.main",
              height: "100%",
              position: "relative",
              padding: "10px",
              // zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <TopBar signatureData={signatureData} />
              <Typography variant="h5">Signature</Typography>
            </Box>
          </Box>
        </ResizableBox>
      )}
      {/* {isOpenSigningForm[signatureData.page - 1] && (
        <SigningForm
          open={isOpenSigningForm[signatureData.page - 1]}
          onClose={() => handleCloseSigningForm(signatureData.page - 1)}
          // index={signatureData.page - 1}
          workFlow={workFlow}
          handleShowModalSignImage={() =>
            handleShowModalSignImage(signatureData.page - 1)
          }
        />
      )}
      {isShowModalSignImage[signatureData.page - 1] && (
        <ModalSingingImage
          isShowModalSignImage={isShowModalSignImage[signatureData.page - 1]}
          handleCloseModalSignImage={() =>
            handleCloseModalSignImage(signatureData.page - 1)
          }
          index={signatureData.page - 1}
        />
      )} */}

      {isOpenSigningForm[index] && (
        <SigningForm
          open={isOpenSigningForm[index]}
          onClose={() => handleCloseSigningForm(index)}
          // index={signatureData.page - 1}
          workFlow={workFlow}
          handleShowModalSignImage={() => handleShowModalSignImage(index)}
          handleShowEidModal={() => handleShowEidModal(index)}
          setDataSigning={setDataSigning}
        />
      )}

      {isShowModalSignImage[index] && (
        <ModalSigningImage2
          open={isShowModalSignImage[index]}
          onClose={() => handleCloseModalSignImage(index)}
          signer={signer}
          dataSigning={dataSigning}
          setDataSigning={setDataSigning}
          handleShowmodal={() => handleShowmodal(index)}
        />
        // <ModalSingingImage
        //   isShowModalSignImage={isShowModalSignImage[index]}
        //   handleCloseModalSignImage={() => handleCloseModalSignImage(index)}
        //   index={signatureData.page - 1}
        // />
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
      {isShowEidModal[index] && (
        <EidModal
          open={isShowEidModal[index]}
          onClose={() => handleCloseEidModal(index)}
        />
      )}
    </>
  );
};

export default Signature;

/* eslint-disable react/prop-types */
import "@/assets/style/cursor.css";
import { useCommonHook } from "@/hook";
import { UseAddSig, UseAddTextField } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import {
  checkIsPosition,
  checkSignerStatus,
  getSigner,
} from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Document } from ".";
import { ContextMenu } from "../../ContextMenu";
import { useTranslation } from "react-i18next";

export const PdfViewer = ({ workFlow }) => {
  // console.log("workFlow: ", workFlow);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [contextMenu, setContextMenu] = useState(null);

  const signerId = getSigner(workFlow).signerId;

  const signer = getSigner(workFlow);
  // console.log("signer: ", signer);
  const { signingToken, signerToken } = useCommonHook();

  const [signInfo, setSignInFo] = useState(null);
  console.log("signInfo: ", signInfo);

  const isSetPosRef = useRef(checkIsPosition(workFlow));
  // const isSetPos = isSetPosRef.current;

  useEffect(() => {
    isSetPosRef.current = checkIsPosition(workFlow);
  }, [workFlow]);

  // eslint-disable-next-line no-unused-vars
  const { data: field } = useQuery({
    queryKey: ["getField"],
    queryFn: () => fpsService.getFields({ documentId: workFlow.documentId }),
    select: (data) => {
      // console.log("data: ", data);
      const newData = { ...data };
      const textField = data.textbox
        .filter(
          (item) =>
            item.type !== "TEXTFIELD" &&
            item.process_status !== "PROCESSED" &&
            item.value !== ""
        )
        .map((item) => {
          return {
            field_name: item.field_name,
            value: item.value,
          };
        });
      return {
        ...newData,
        textField,
        workFlowId: workFlow.workFlowId,
      };
    },
  });

  // console.log("getField: ", field);

  const addSignature = UseAddSig();
  const addTextBox = UseAddTextField();
  // const updateQr = UseUpdateQr();

  const handleContextMenu = (page) => (event) => {
    // console.log("page: ", page);
    if (
      checkSignerStatus(signer, signerToken) === 2 ||
      (event.target.className !== "rpv-core__text-layer" &&
        event.target.className !== "rpv-core__text-layer-text")
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const data = {
      x: (x * 100) / rect.width,
      y: (y * 100) / rect.height,
      width: 22,
      height: 5,
      page: page.pageIndex + 1,
      // totalPage: page.doc._pdfInfo.numPages,
    };

    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
    setSignInFo(data);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const signatureField = (value) => {
    const newSignature = {
      type: value,
      field_name:
        signerId + "_" + value + "_" + Number(field.signature.length + 1),
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: Number(field.signature.length + 1),
      visible_enabled: true,
      workFlowId: workFlow.workFlowId,
    };
    addSignature.mutate(
      {
        body: newSignature,
        field: newSignature.type.toLowerCase(),
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const handleValue = (value) => {
    switch (value) {
      case "NAME":
        return signer.lastName + " " + signer.firstName;
      case "EMAIL":
        return signer.email;
      case "JOBTITLE":
        return signer.metaInformation?.position || "";
      case "COMPANY":
        return signer.metaInformation?.company || "";
      default:
        return "";
    }
  };

  const textField = (value) => {
    // console.log("value: ", value);
    const newTextField = {
      type: value,
      field_name:
        signerId + "_" + value + "_" + Number(field.textbox.length + 1),
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 15,
        height: 2,
      },
      place_holder: value,
      suffix: Number(field.textbox.length + 1),
    };
    addTextBox.mutate(
      {
        body: newTextField,
        field: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const addTextField = (value) => {
    console.log("value: ", value);
    const newTextField = {
      type: "TEXTFIELD",
      field_name:
        signerId + "_" + "TEXTFIELD" + "_" + Number(field.textbox.length + 1),
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: true,
      format_type: "ALPHANUMERIC",
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: Number(field.textbox.length + 1),
    };
    addTextBox.mutate(
      {
        body: newTextField,
        field: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const initial = (value) => {
    const newInitField = {
      field_name:
        signerId + "_" + value + "_" + Number(field.initial.length + 1),
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 6,
        height: 4,
      },
      suffix: Number(field.initial.length + 1),
    };
    addTextBox.mutate(
      {
        body: newInitField,
        field: "initial",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const qrCode = (value) => {
    // console.log("qr: ", field?.qr);
    if (field?.qr?.length > 0) {
      alert(t("signing.qr_warning"));
      return;
    }
    const qrToken = uuidv4();
    const newInitField = {
      field_name: signerId + "_" + value + "_" + Number(field.qr.length + 1),
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 13,
      },
      suffix: Number(field.qr.length + 1),
      qr_token: qrToken,
      value: `${window.location.origin}/view/documents/${qrToken}`,
      signing_token: signingToken,
    };
    addTextBox.mutate(
      {
        body: newInitField,
        field: "qrcode",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getField"] });
        },
      }
    );
  };

  const handleClickMenu = (value) => () => {
    // console.log("data: ", value);
    handleClose();
    switch (value) {
      case "SIGNATURE":
        signatureField(value);
        break;
      case "NAME":
      case "EMAIL":
      case "JOBTITLE":
      case "COMPANY":
        textField(value);
        break;
      case "AddText":
        addTextField(value);
        break;
      case "INITIAL":
        initial(value);
        break;
      case "QR":
        qrCode(value);
        break;
    }
  };

  const renderPage = (props) => {
    return (
      <div
        className={`cuong-page-${props.pageIndex}`}
        onContextMenu={handleContextMenu(props)}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ContextMenu
          contextMenu={contextMenu}
          handleClose={handleClose}
          handleClickMenu={handleClickMenu}
        />

        <Document
          props={props}
          workFlow={workFlow}
          signatures={field?.signature}
          textbox={field?.textbox?.filter((item) => item.type !== "TEXTFIELD")}
          initial={field?.initial}
          qr={field?.qr}
          textField={field?.textField}
          addText={field?.textbox?.filter((item) => item.type === "TEXTFIELD")}
        />
      </div>
    );
  };

  const pageLayout = {
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Box height="100%">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${workFlow.pdfBase64}`}
          plugins={[defaultLayoutPluginInstance]}
          renderPage={renderPage}
          pageLayout={pageLayout}
        />
      </Worker>
    </Box>
  );
};
PdfViewer.propTypes = {
  workFlow: PropTypes.shape({
    pdfBase64: PropTypes.string,
  }),
};

export default PdfViewer;

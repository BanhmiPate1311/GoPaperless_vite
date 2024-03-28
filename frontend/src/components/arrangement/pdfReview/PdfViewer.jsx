/* eslint-disable react/prop-types */
import "@/assets/style/cursor.css";
import { useCommonHook } from "@/hook";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import { generateFieldName } from "@/utils/getField";
import Box from "@mui/material/Box";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Document } from ".";
import { ContextMenu } from "../../ContextMenu";
import { Document } from ".";

export const PdfViewer = ({ workFlow, tabBar }) => {
  const { t } = useTranslation();
  // const queryClient = useQueryClient();

  const [contextMenu, setContextMenu] = useState(null);
  const [openResize, setOpenResize] = useState(false);
  const signerId = getSigner(workFlow)?.signerId;
  const [field, setField] = useState(null);

  const signer = getSigner(workFlow);
  console.log("signer: ", signer);
  const { signingToken } = useCommonHook();

  const [signInfo, setSignInFo] = useState(null);

  const location = useSearchParams();
  const participantsType = workFlow.participants.filter(
    (item) => item.signerToken === workFlow.signerToken
  );
  console.log("participantsType: ", participantsType);
  // eslint-disable-next-line no-unused-vars
  const getFields = async () => {
    const response = await fpsService.getFields({
      documentId: workFlow.documentId,
    });
    if (!response) return;
    const newData = { ...response };
    const textField = response.textbox
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
    setField({
      ...newData,
      textField,
      workFlowId: workFlow.workFlowId,
    });
  };
  useEffect(() => {
    getFields();
  }, []);

  // const addSignature = UseAddSig();
  // const addTextBox = UseAddTextField();
  // const updateQr = UseUpdateQr();

  const handleContextMenu = (page) => (event) => {
    event.preventDefault();
    // console.log("page: ", event);
    if (openResize) return;
    if (
      // checkSignerStatus(signer, signerToken) === 2 ||
      event.target.className !== "rpv-core__text-layer" &&
      event.target.className !== "rpv-core__text-layer-text"
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
    };
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
    setSignInFo(data);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const signatureField = async (value) => {
    for (const item of field.signature) {
      if (
        item.field_name.substring(0, item.field_name.length - 7) ===
        signerId + "_" + value
      ) {
        alert(t("signing.sig_warning"));
        return;
      }
    }
    const signatureField = generateFieldName(signerId, value);
    const newSignature = {
      type: value,

      field_name: signatureField.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 22,
        height: 5,
      },
      suffix: signatureField.suffix,
      visible_enabled: true,
      workFlowId: workFlow.workFlowId,
    };
    const response = await fpsService.addSignature(
      newSignature,
      newSignature.type.toLowerCase(),
      workFlow.documentId
    );
    console.log("response:", response);
    if (!response) return;

    await getFields();
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

  const textField = async (value) => {
    // console.log("value: ", value);
    const fieldName = generateFieldName(signerId, value);
    const newTextField = {
      type: value,
      field_name: fieldName.value,
      page: signInfo.page,
      value: handleValue(value),
      read_only: false,
      multiline: value === "TEXTAREA" ? true : false,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: value === "TEXTAREA" ? 24 : 15,
        height: value === "TEXTAREA" ? 11 : 2,
      },
      place_holder: value,
      suffix: fieldName.suffix,
    };

    const response = await fpsService.addTextBox(
      newTextField,
      "text",
      workFlow.documentId
    );

    if (!response) return;

    await getFields();
  };

  const addTextField = async (value) => {
    console.log("value: ", value);
    const fieldName = generateFieldName(signerId, "TEXTFIELD");
    const newTextField = {
      type: "TEXTFIELD",
      field_name: fieldName.value,
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
      suffix: fieldName.suffix,
    };
    const response = await fpsService.addTextBox(
      newTextField,
      "text",
      workFlow.documentId
    );

    if (!response) return;

    await getFields();
  };

  const initial = async (value) => {
    console.log("value: ", value);
    const fieldName = generateFieldName(signerId, value);
    const newInitField = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 6,
        height: 4,
      },
      suffix: fieldName.suffix,
      required: true,
    };
    const response = await fpsService.addTextBox(
      newInitField,
      "initial",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const qrCode = async (value) => {
    console.log("value: ", value);
    if (field?.qr?.length > 0) {
      alert(t("signing.qr_warning"));
      return;
    }
    const qrToken = uuidv4();
    const fieldName = generateFieldName("ADMIN_PROVIDER", value);
    const newInitField = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 13,
      },
      suffix: fieldName.suffix,
      qr_token: qrToken,
      value: `${window.location.origin}/view/documents/${qrToken}`,
      signing_token: signingToken,
    };
    const response = await fpsService.addTextBox(
      newInitField,
      "qrcode",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const QrQrypto = async (value) => {
    if (field?.qrypto?.length > 0) {
      alert(t("signing.qr_warning"));
      return;
    }
    const signerInfo = workFlow.participants.map((item) => {
      return {
        field: item.signerId,
        type: 8,
        value: [
          {
            column_1: item.lastName + " " + item.firstName,
            column_2: item.email,
            column_3: "Signing Time: ",
          },
          {
            column_1: "",
          },
        ],
        remark: "table",
      };
    });
    const fieldName = generateFieldName("ADMIN_PROVIDER", value);
    const newQrQrypto = {
      field_name: fieldName.value,
      page: signInfo.page,
      dimension: {
        x: signInfo.x,
        y: signInfo.y,
        width: 20,
        height: 13,
      },
      suffix: fieldName.suffix,
      items: [
        {
          field: "Workflow Name",
          type: 1,
          value: workFlow.documentName,
          remark: "text",
        },
        {
          field: "File Name",
          type: 1,
          value: workFlow.fileName,
          remark: "text",
        },
        ...signerInfo,
      ],
    };
    const response = await fpsService.addTextBox(
      newQrQrypto,
      "qrcode-qrypto",
      workFlow.documentId
    );
    if (!response) return;
    await getFields();
  };

  const handleClickMenu = (value) => () => {
    handleClose();
    switch (value) {
      case "SIGNATURE":
        signatureField(value);
        break;
      case "NAME":
      case "EMAIL":
      case "JOBTITLE":
      case "COMPANY":
      case "TEXTBOX":
      case "TEXTAREA":
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
      case "QRYPTO":
        QrQrypto(value);
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
          tabBar={tabBar}
          signerType={participantsType[0]?.signerType}
        />
        <Document
          props={props}
          workFlow={workFlow}
          signatures={field?.signature}
          textbox={field?.textbox?.filter((item) => item.type !== "TEXTFIELD")}
          initial={field?.initial}
          qr={field?.qr}
          qrypto={field?.qrypto}
          textField={field?.textField}
          addText={field?.textbox?.filter((item) => item.type === "TEXTFIELD")}
          openResize={openResize}
          setOpenResize={setOpenResize}
          getFields={getFields}
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

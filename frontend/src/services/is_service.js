import { api } from "@/utils/api";

export const isService = {
  getHash: (data) => {
    const request = {
      contactInfor: data.email,
      fieldName: data.fieldName,
      signerToken: data.signerToken,
      signingToken: data.signingToken,
      connectorName: data.connector,
      documentId: data.documentId,
      usbCertChain: data.certChain.value,
      signerId: data.signerId,
      signingPurpose: data.signingPurpose,
      country: data.country,
      countryRealtime: data.countryRealtime,
      imageBase64: data.imageBase64,
    };
    return api.post("/is/getHash", request);
  },

  packFile: (data) => {
    const request = {
      signerToken: data.signerToken,
      signingToken: data.signingToken,
      fieldName: data.fieldName,
      hashList: data.hashList,
      usbCertChain: data.certChain.value,
      usbCertId: data.certChain.id,
      signerId: data.signerId,
      signatures: data.signatures,
      documentId: data.documentId,
      fileName: data.fileName,
      lastFileId: data.lastFileId,
      codeNumber: data.certChain.subject.serialNumber,
      signingOption: data.signingOption,
      enterpriseId: data.enterpriseId,
      assurance: data.assurance,
      textField: data.textField,
    };
    return api.post("/is/packFile", request);
  },
};

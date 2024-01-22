import { api } from "@/utils/api";

export const apiService = {
  checkHeaderFooter: (signingToken) => {
    return api.post("/uiApi/checkHeader", {
      signingToken,
    });
  },
  getHeaderFooter: (enterpriseId) => {
    return api.post("/uiApi/headerFooter", {
      enterpriseId,
    });
  },
  checkWorkFlow: (data) => {
    return api.post("/uiApi/checkWorkFlow", data);
  },
  getSigningWorkFlow: (signingToken) => {
    return api.post("/uiApi/getSigningWorkFlow", {
      signingToken,
    });
  },
  getSignedInfo: async ({ firstFileId }) => {
    // return api.post("/uiApi/getSignedInfo", { fileId: firstFileId });
    const response = await api.post("/uiApi/getSignedInfo", {
      fileId: firstFileId,
    });
    return response.data;
  },

  getConnecterProvider(providerName) {
    return api.post("/uiApi/getConnecterProvider", {
      signingOptions: providerName,
    });
  },

  getPrefixList(lang) {
    return api.post("/uiApi/getPrefixList", {
      language: lang,
    });
  },
  getView: ({ qr }) => {
    return api.post("/uiApi/getFromQR", { qr });
  },
};

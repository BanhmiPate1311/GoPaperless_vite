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
  getSignedInfo: ({ firstFileId }) => {
    return api.post("/uiApi/getSignedInfo", { fileId: firstFileId });
  },
};

import { api } from "@/utils/api";

export const rsspService = {
  getCertificates: (data) => {
    return api.post("rssp/getCertificates", {
      language: data.language,
      codeNumber: data.codeNumber,
      connectorName: data.connector,
    });
  },

  signFile: (data, { signal }) => {
    return api.post("rssp/signFile", data, { signal });
  },

  getVc: ({ requestID }) => {
    return api.post("rssp/getVc", { requestID });
  },
};

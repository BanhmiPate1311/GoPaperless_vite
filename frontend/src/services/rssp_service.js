import { api } from "@/utils/api";

export const rsspService = {
  getCertificates: (data) => {
    return api.post("rssp/getCertificates", {
      language: data.language,
      codeNumber: data.codeNumber,
      connectorName: data.connectorName,
    });
  },
};

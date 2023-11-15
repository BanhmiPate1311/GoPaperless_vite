import { api } from "@/utils/api";

export const apiService = {
  checkHeaderFooter: (signingToken) => {
    return api.post("/checkHeader", {
      signingToken,
    });
  },
  getHeaderFooter: (signingToken) => {
    return api.post("/headerFooter", {
      signingToken,
    });
  },
};

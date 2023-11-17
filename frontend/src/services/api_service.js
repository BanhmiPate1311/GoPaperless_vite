import { api } from "@/utils/api";

export const apiService = {
  checkHeaderFooter: (signingToken) => {
    return api.post("/apigw/checkHeader", {
      signingToken,
    });
  },
  getHeaderFooter: (enterpriseId) => {
    return api.post("/apigw/headerFooter", {
      enterpriseId,
    });
  },
  getSigningWorkFlow: (signingToken) => {
    return api.post("/apigw/getSigningWorkFlow", {
      signingToken,
    });
  },
};

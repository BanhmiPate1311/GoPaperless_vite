import { api } from "@/utils/api";

export const validationService = {
  getView: ({ uploadToken }) => {
    console.log("uploadToken: ", uploadToken);
    return api.post("val/getView", { uploadToken });
  },
  postBack: (data) => {
    return api.post("val/postback", data);
  },
  checkStatus: (data) => {
    return api.post("val/checkStatus", data);
  },
};

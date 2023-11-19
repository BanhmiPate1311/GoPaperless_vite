import { api } from "@/utils/api";

export const fpsService = {
  getFields: ({ documentId }) => {
    return api.get(`/fps/${documentId}/getFields`);
  },

  getVerification: ({ documentId }) => {
    return api.get(`/fps/${documentId}/verification`);
  },

  addSignature: async ({ documentId }, data, field) => {
    return await api.post(`/fps/${documentId}/${field}/addSignature`, data);
  },

  putSignature: async ({ documentId }, data, field) => {
    return await api.put(`/fps/${documentId}/${field}/putSignature`, data);
  },

  removeSignature: async ({ documentId }, field_name) => {
    await api.delete(`/fps/${documentId}/${field_name}/deleteSignatue`);
  },
};

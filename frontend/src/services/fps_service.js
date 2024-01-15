import { api } from "@/utils/api";

export const fpsService = {
  getFields: async ({ documentId }) => {
    // return api.get(`/fps/${documentId}/getFields`);
    const response = await api.get(`/fps/${documentId}/getFields`);
    return response.data;
  },

  getVerification: ({ documentId }) => {
    return api.get(`/fps/${documentId}/verification`);
  },

  addSignature: async (data, field, documentId) => {
    return await api.post(`/fps/${documentId}/${field}/addSignature`, data);
  },

  putSignature: async (data, field, documentId) => {
    return await api.put(`/fps/${documentId}/${field}/putSignature`, data);
  },

  addTextBox: async (data, field, documentId) => {
    return await api.post(`/fps/${documentId}/${field}/addTextBox`, data);
  },

  removeSignature: async ({ documentId }, field_name) => {
    await api.delete(`/fps/${documentId}/${field_name}/deleteSignatue`);
  },
};

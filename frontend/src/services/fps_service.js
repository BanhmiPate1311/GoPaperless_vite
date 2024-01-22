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
    const response = await api.post(
      `/fps/${documentId}/${field}/addSignature`,
      data
    );
    return response.data;
  },

  putSignature: async (data, field, documentId) => {
    const response = await api.put(
      `/fps/${documentId}/${field}/putSignature`,
      data
    );
    return response.data;
  },

  addTextBox: async (data, field, documentId) => {
    const response = await api.post(
      `/fps/${documentId}/${field}/addTextBox`,
      data
    );
    return response.data;
  },

  fillInit: async (data, documentId) => {
    const response = await api.post(`/fps/${documentId}/fillInit`, data);
    return response.data;
  },

  removeSignature: async ({ documentId }, field_name) => {
    const response = await api.delete(
      `/fps/${documentId}/${field_name}/deleteSignatue`
    );
    return response.data;
  },
};

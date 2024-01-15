import { fpsService } from "@/services/fps_service";
import { useMutation } from "@tanstack/react-query";

export const UseAddSig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: async ({ body, field, documentId }) => {
      const response = await fpsService.addSignature(body, field, documentId);
      return response.data;
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseUpdateSig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: async ({ body, field, documentId }) => {
      const response = await fpsService.putSignature(body, field, documentId);
      return response.data;
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseAddTextField = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: async ({ body, field, documentId }) => {
      const response = await fpsService.addTextBox(body, field, documentId);
      return response.data;
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

import { fpsService } from "@/services/fps_service";
import { useMutation } from "@tanstack/react-query";

export const UseAddSig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.addSignature(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseUpdateSig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.putSignature(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseAddTextField = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.addTextBox(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseFillInit = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, documentId }) => {
      return fpsService.fillInit(body, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseFillForm = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, documentId }) => {
      return fpsService.fillForm(body, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

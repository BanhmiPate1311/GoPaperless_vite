import { isService } from "@/services/is_service";
import { useMutation } from "@tanstack/react-query";

export const useUsbHash = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.getHash(data);
      return response.data;
    },
    // onSuccess: () => {
    //   cbSuccess();
    // },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useUsbHash.propTypes = {};

export const useUsbPackFile = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.packFile(data);
      return response.data;
    },
    // onSuccess: () => {
    //   cbSuccess();
    // },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useUsbPackFile.propTypes = {};

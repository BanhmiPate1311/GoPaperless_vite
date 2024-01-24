import { apiService } from "@/services/api_service";
import { useMutation } from "@tanstack/react-query";

export const UseUpdateQr = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: async (body) => {
      const response = await apiService.updateQr(body);
      return response.data;
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseGetCertDetail = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: async (body) => {
      const response = await apiService.getCertDetail(body);
      return response.data;
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

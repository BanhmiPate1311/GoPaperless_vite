import { apiService } from "@/services/api_service";
import { useMutation } from "@tanstack/react-query";

export const UseUpdateQr = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.updateQr(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseGetCertDetail = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.getCertDetail(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

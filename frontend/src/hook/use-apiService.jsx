import { apiService } from "@/services/api_service";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const UseGetViewFromQr = () => {
  const { mutate, data, isLoading, isPending, error } = useQuery({
    mutationFn: (body) => {
      return apiService.getView(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

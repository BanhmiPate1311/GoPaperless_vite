import { apiService } from "@/services/api_service";
import { useQuery } from "@tanstack/react-query";

export const usePreFixList = (lang) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["prefixList"],
    queryFn: async () => {
      const response = await apiService.getPrefixList(lang);
      return response.data;
    },
  });
  return { data, isLoading, error };
};

usePreFixList.propTypes = {};

export default usePreFixList;

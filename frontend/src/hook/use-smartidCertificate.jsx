import { rsspService } from "@/services/rssp_service";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";

export const useSmartIdCertificate = (cbSuccess) => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await rsspService.getCertificates(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess();
    },
  });
  return { mutate, data, isLoading, error };
};

useSmartIdCertificate.propTypes = {
  data: PropTypes.object,
};

export default useSmartIdCertificate;

import { apiService } from "@/services/api_service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const MainLayout = () => {
  const { signing_token } = useParams();
  // const { batch_token } = useParams();

  // const [headerFooter, setHeaderFooter] = useState(null);
  // const [logo, setLogo] = useState(null);
  const checkHeaderFooter = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signing_token),
    select: (data) => data.data.visibleHeaderFooter,
    // queryFn: ({signal}) => apiService.checkHeaderFooter(signing_token, signal),  dùng khi muốn cancel request
    // refetchOnWindowFocus: false, // không refetch lại khi chuyển tab, đã set default
    // keepPreviousData: false, // dùng khi phân trang nhằm cải thiện UX
    // enabled: id !== undefined chỉ gọi api khi có giá trị id
  });

  console.log("checkHeaderFooter: ", checkHeaderFooter.data);

  const getHeaderFooter = useQuery({
    queryKey: ["headerFooter"],
    queryFn: () => apiService.getHeaderFooter(signing_token),
    enabled: checkHeaderFooter.data !== undefined,
  });

  console.log("getHeaderFooter: ", getHeaderFooter.data);

  return <div>MainLayout</div>;
};

export default MainLayout;

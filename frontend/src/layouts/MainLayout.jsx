import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { apiService } from "@/services/api_service";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router-dom";

export const MainLayout = () => {
  const { signing_token: signingToken } = useParams();

  // const { batch_token } = useParams();

  const { data: headerFooter } = useQuery({
    queryKey: ["checkHeader"],
    queryFn: () => apiService.checkHeaderFooter(signingToken),
    // select: (data) => {
    //   return Object.keys(data.data).reduce((result, key) => {
    //     // console.log("data: ", data.data[key]);
    //     // Kiểm tra nếu giá trị của key không phải là mảng rỗng thì thêm vào object kết quả
    //     if (data.data[key] !== "null") {
    //       result[key] = data.data[key];
    //     }
    //     return result;
    //   }, {});
    // },
    // initialData: {
    //   headerVisible: 1,
    // },

    // queryFn: ({signal}) => apiService.checkHeaderFooter(signing_token, signal),  dùng khi muốn cancel request
    // refetchOnWindowFocus: false, // không refetch lại khi chuyển tab, đã set default
    // keepPreviousData: true, // dùng khi phân trang nhằm cải thiện UX
    enabled: signingToken !== undefined, //chỉ gọi api khi có giá trị id
  });
  // console.log("checkHeader: ", headerFooter?.data);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "signingBackground.main",
        padding:
          headerFooter?.headerVisible !== 0
            ? (theme) =>
                `${theme.GoPaperless.headerHeight} 0 ${theme.GoPaperless.footerBarHeight}`
            : "0",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: (theme) =>
            `calc(100vh - ${theme.GoPaperless.headerHeight} - ${theme.GoPaperless.footerBarHeight})`,

          mx: "auto",
        }}
      >
        {headerFooter?.data.headerVisible !== 0 && (
          <Header headerFooter={headerFooter?.data} />
        )}
        <Outlet />
        {headerFooter?.data.headerVisible !== 0 && (
          <Footer headerFooter={headerFooter?.data} />
        )}
      </Container>
    </Box>
  );
};

export default MainLayout;

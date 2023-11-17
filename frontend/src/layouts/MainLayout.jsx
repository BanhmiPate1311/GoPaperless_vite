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
    // select: (data) => ({
    //   visibleHeaderFooter: data.data.visibleHeaderFooter,
    //   enterpriseId: data.data.enterpriseId,
    // }),
    // queryFn: ({signal}) => apiService.checkHeaderFooter(signing_token, signal),  dùng khi muốn cancel request
    // refetchOnWindowFocus: false, // không refetch lại khi chuyển tab, đã set default
    // keepPreviousData: false, // dùng khi phân trang nhằm cải thiện UX
    // enabled: id !== undefined chỉ gọi api khi có giá trị id
  });
  // console.log("headerFooter: ", headerFooter?.data);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#E8EBF0",
        padding: (theme) =>
          `${theme.GoPaperless.headerHeight} 0 ${theme.GoPaperless.footerBarHeight}`,
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          minHeight: "100%", // Ensure the inner container covers the height
          // Apply padding manually if needed
          mx: "auto",
        }}
      >
        <Header headerFooter={headerFooter?.data} />
        <Outlet />
        <Footer headerFooter={headerFooter?.data} />
      </Container>
    </Box>
  );
};

export default MainLayout;

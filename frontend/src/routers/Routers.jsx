import LemNhem from "@/components/LemNhem";
import { MainLayout } from "@/layouts";
import { Signing } from "@/pages";
import { useRoutes } from "react-router-dom";

const Routers = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/sktT1",
          element: <LemNhem />,
        },
        {
          path: "/view/signing/:signing_token",
          element: <Signing />,
        },
      ],
    },
  ]);
  return routing;
};

export default Routers;

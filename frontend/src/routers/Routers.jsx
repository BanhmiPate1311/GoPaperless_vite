import LemNhem from "@/components/LemNhem";
import { MainLayout } from "@/layouts";
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
          path: "/signing/:signing_token",
          element: <MainLayout />,
        },
      ],
    },
  ]);
  return routing;
};

export default Routers;

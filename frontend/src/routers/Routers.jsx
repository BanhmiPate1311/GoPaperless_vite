import { MainLayout } from "@/layouts";
import { NotFound, Signing, Validation } from "@/pages";
import { useRoutes } from "react-router-dom";

const Routers = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/view/signing/:signing_token",
          element: <Signing />,
        },
        {
          path: "/view/validation/:upload_token/show",
          element: <Validation />,
        },
        {
          path: "/view/*",
          element: <NotFound />,
        },
      ],
    },
  ]);
  return routing;
};

export default Routers;

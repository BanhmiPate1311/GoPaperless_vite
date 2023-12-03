import { useParams, useSearchParams } from "react-router-dom";

export const useCommonHook = () => {
  const { signing_token: signingToken } = useParams();
  const [search] = useSearchParams();
  const signerToken = search.get("access_token");
  return { signingToken, signerToken };
};

useCommonHook.propTypes = {};

export default useCommonHook;

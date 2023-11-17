// import React from 'react'
import { apiService } from "@/services/api_service";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

export const SigningContent = ({ workFlow }) => {
  // console.log("workFlow: ", workFlow);
  const { data: signedInfo } = useQuery({
    queryKey: ["getSignedInfo"],
    queryFn: () => apiService.getSignedInfo(workFlow),
    select: (data) => {
      const newData = [...data.data];
      const transformer = newData.map((item) => {
        const parsedValue = JSON.parse(item.value);
        return {
          ...item,
          value: parsedValue,
        };
      });
      return transformer;
    },
  });
  console.log("getSignedInfo: ", signedInfo);
  return <div>SigningContent</div>;
};

SigningContent.propTypes = {
  workFlow: PropTypes.shape({
    // Define the structure of the object if needed
    // For example:
    // key1: PropTypes.string,
    // key2: PropTypes.number,
    fileId: PropTypes.string,
  }),
};

export default SigningContent;

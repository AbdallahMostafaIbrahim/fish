import React from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  size?: number;
}

const Loader: React.FC<Props> = ({ size }) => {
  return <ClipLoader color="white" size={size || 24} />;
};

export default Loader;

import React from "react";
import { SiPorsche } from "react-icons/si";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <SiPorsche className="text-4xl animate-spin" />
  </div>
);

export default React.memo(LoadingSpinner);

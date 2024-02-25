import React from "react";
import { MdSearchOff } from "react-icons/md";

const NoProjectsFound = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <MdSearchOff className="mb-4 h-16 w-16 text-blue-500" />
      <h2 className="mb-2 text-xl font-bold text-gray-800">
        No Projects Found
      </h2>
      <p className="mb-4 text-base text-gray-600">
        We couldn't find any projects matching your criteria. Try adjusting your
        search or filter settings!
      </p>
    </div>
  );
};

export default NoProjectsFound;

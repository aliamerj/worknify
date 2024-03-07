import Link from "next/link";

import {
  IoAppsOutline,
  IoEyeOutline,
  IoLockOpenOutline,
} from "react-icons/io5";

export const ProjectTypeOptions = ({
  selectedOption,
}: {
  selectedOption: string;
}) => {
  const visibilityOptions = ["All", "Public", "Permission"];
  return (
    <div className="flex space-x-2 p-4">
      {visibilityOptions.map((option) => (
        <VisibilityOption
          key={option}
          option={option}
          selected={
            visibilityOptions.includes(selectedOption) ? selectedOption : ""
          }
        />
      ))}
    </div>
  );
};

const VisibilityOption = ({
  option,
  selected,
}: {
  option: string;
  selected: string;
}) => {
  const icons: { [key: string]: JSX.Element } = {
    All: <IoAppsOutline className="mr-2" />,
    Public: <IoEyeOutline className="mr-2" />,
    Permission: <IoLockOpenOutline className="mr-2" />,
  };

  return (
    <Link
      key={option}
      scroll={false}
      href={option !== "All" ? `?visibility=${option}` : "/"}
      className={`flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-sm focus:outline-none ${
        selected === option
          ? "border-transparent bg-primary text-white"
          : option === "All"
            ? "border-2 border-primary bg-white text-primary hover:bg-gray-50" // Special design for "All"
            : "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icons[option]}
      {option}
    </Link>
  );
};

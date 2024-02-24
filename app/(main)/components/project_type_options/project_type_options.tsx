import Link from "next/link";

import {
  IoEyeOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
} from "react-icons/io5";

export const ProjectTypeOptions = ({
  selectedOption,
}: {
  selectedOption: string;
}) => {
  const visibilityOptions = ["Public", "Permission", "Private"];
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
    Public: <IoEyeOutline className="mr-2" />,
    Permission: <IoLockOpenOutline className="mr-2" />,
    Private: <IoLockClosedOutline className="mr-2" />,
  };

  return (
    <Link
      scroll={false}
      href={option !== selected ? `?visibility=${option}` : ""}
      className={`flex items-center rounded-full border-2 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none ${
        selected === option
          ? "border-transparent bg-primary text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icons[option]}
      {option}
    </Link>
  );
};

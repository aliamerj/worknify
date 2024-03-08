"use client";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

export const ProjectSearch = () => {
  const router = useRouter();

  return (
    <div className="flex items-center rounded-lg border-2 bg-gray-100 md:w-1/2">
      <input
        className="flex-grow rounded-lg bg-transparent p-4 focus:outline-none"
        type="text"
        placeholder="Search for projects..."
        onChange={(e) => {
          e.preventDefault();
          if (e.target.value === "") {
            router.replace("?", { scroll: false });
            return;
          }
          router.replace(`?search=${e.target.value}`, { scroll: false });
        }}
      />
      <span className="p-4">
        <IoSearch className="h-5 w-5 text-gray-500" />
      </span>
    </div>
  );
};

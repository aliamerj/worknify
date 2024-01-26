"use client";
import { StarIcon } from "@/global-components/icon/star_icon";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { AiOutlineStar } from "react-icons/ai";
interface Props {
  projectLogo: string;
  projectName: string;
  projectGoal: string;
}

const ProjectHeader = ({ projectName, projectGoal, projectLogo }: Props) => {
  const handleGiveStar = () => {
    console.log("Star given to the project");
  };

  return (
    <div className="mx-2 mt-5 border border-gray-200 bg-white p-6 shadow-sm">
      <div className="container mx-auto flex flex-col items-center sm:h-52 sm:flex-row sm:justify-evenly">
        <div className="flex items-center">
          <div className="mr-4 rounded-md border border-gray-500">
            <Image
              src={projectLogo}
              alt={`${projectName} Logo`}
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center text-2xl font-bold text-gray-800">
              <h1>{projectName}</h1>
              <div className="flex items-center pl-5">
                <AiOutlineStar className="font-bold text-gray-600" />
                <h5 className="pl-1 text-xl text-gray-600">{10}</h5>
              </div>
            </div>
            <p className="text-sm text-gray-600">{projectGoal}</p>
          </div>
        </div>
        <Button
          size="md"
          color="primary"
          variant="ghost"
          startContent={<StarIcon isFilled={false} />}
          onClick={handleGiveStar}
        >
          Star
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;

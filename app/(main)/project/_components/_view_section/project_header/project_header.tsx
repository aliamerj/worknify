"use client";
import { StarIcon } from "@/global-components/icon/star_icon";
import { ApiRouter } from "@/utils/router/app_router";
import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { GoAlertFill } from "react-icons/go";
import { IoMdGitNetwork } from "react-icons/io";
interface Props {
  projectLogo: string;
  projectName: string;
  projectGoal: string;
  starsCount: number;
  stared: boolean;
  projectId: number;
  isJoined: boolean;
}

const ProjectHeader = ({
  projectName,
  projectGoal,
  projectLogo,
  starsCount,
  stared,
  projectId,
  isJoined,
}: Props) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isStared, setStar] = useState(stared);
  const [starCounter, setStarCount] = useState(starsCount);
  const handleJoin = () => {
    console.log("Join to the project");
  };

  const handleGivenStar = async () => {
    setLoading(true);
    try {
      if (isStared) {
        await axios.delete(ApiRouter.projectStar + projectId);
        setStarCount((current) => current - 1);
      } else {
        await axios.post(ApiRouter.projectStar + projectId);
        setStarCount((current) => current + 1);
      }
      setStar((current) => !current);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="mx-2 mt-5 border border-gray-200 bg-white p-6 shadow-sm">
      <div className="container mx-auto flex flex-col items-center sm:h-52 sm:flex-row sm:justify-evenly">
        <div className="flex items-center">
          <div className="relative h-16 w-20 flex-shrink-0 sm:h-36 sm:w-36 md:h-44 md:w-44">
            <Image
              src={projectLogo}
              alt={`${projectName} Logo`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg pr-3"
            />
          </div>{" "}
          <div>
            <div className="flex items-center text-2xl font-bold text-gray-800">
              <h1>{projectName}</h1>
              <div className="flex items-center pl-5">
                {loading ? (
                  <Spinner color="warning" />
                ) : (
                  <div
                    onClick={handleGivenStar}
                    className="hover:cursor-pointer"
                  >
                    <StarIcon isFilled={isStared} color="#FFE000" />
                  </div>
                )}
                <h5 className="pl-1 text-xl text-gray-600">{starCounter}</h5>
              </div>
            </div>
            <p className="text-sm text-gray-600">{projectGoal}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-3 sm:flex-col ">
          <Button
            size="md"
            color={isJoined ? "danger" : "primary"}
            variant="shadow"
            className="text-xl"
            startContent={<IoMdGitNetwork />}
            onClick={handleJoin}
          >
            {isJoined ? "Unjoin" : "Join"}
          </Button>
          <Button
            size="md"
            color="warning"
            variant="shadow"
            className="text-xl text-white"
            startContent={<RxDashboard />}
            onClick={handleJoin}
          >
            Dashboard
          </Button>
        </div>
        {error && (
          <div
            className="fixed bottom-0 left-0 mb-5 ml-5 flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm text-white shadow-lg"
            style={{ animation: "floatError 1.5s ease-in-out" }}
          >
            <GoAlertFill className="text-lg" />
            {error}
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default ProjectHeader;

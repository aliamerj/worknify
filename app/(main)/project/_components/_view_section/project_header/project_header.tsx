"use client";
import { StarIcon } from "@/global-components/icon/star_icon";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";
import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { GoAlertFill } from "react-icons/go";
import { IoMdGitNetwork } from "react-icons/io";
import { BsPencilFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { ProjectSchema } from "@/utils/validations/projectValidation";
import RequestPendingBox from "../../request_pending_box/request_pending_box";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import { NotificationSchema } from "@/utils/validations/notificationsValidation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
// it should be splitting the code into starGiving and Join
// TODO
interface Props {
  isAuth: boolean;
  projectLogo: string | null;
  projectName: string;
  projectGoal: string;
  starsCount: number;
  stared: boolean;
  projectId: number;
  isJoined: boolean;
  isCreater: boolean;
  owner: string;
  projectType: ProjectSchema["type"];
  isWaiting: boolean;
}
type Loading = {
  isLoading: boolean;
  on: "STAR" | "JOIN";
};
const ProjectHeader = ({
  projectName,
  projectGoal,
  projectLogo,
  starsCount,
  stared,
  projectId,
  isJoined,
  projectType,
  isCreater,
  owner,
  isWaiting,
  isAuth,
}: Props) => {
  const [iswaiting, setIsWaiting] = useState(isWaiting);

  const [loading, setLoading] = useState<Loading>({
    isLoading: false,
    on: "STAR",
  });
  const [isStared, setStar] = useState(stared);
  const [starCounter, setStarCount] = useState(starsCount);
  const joinBtnName = (isJoin: boolean) => {
    if (isCreater) return "Edit";
    if (projectType === "public") {
      if (isJoin) return "Unjoin";
      else return "Join";
    } else {
      if (isJoin) return "Unjoin";
      else return "Send Request";
    }
  };
  const [isJoin, setIsJoin] = useState(isJoined);
  const [joinBtn, setJoinBtn] = useState(joinBtnName(isJoined));

  const route = useRouter();

  const handleActionBtn = async () => {
    if (!isAuth) return route.push(AppRouter.signup);
    setLoading({ isLoading: true, on: "JOIN" });
    try {
      if (isCreater) return route.push(AppRouter.editProject + projectId);
      if (!isJoin) {
        const projectJoin: NotificationSchema = {
          projectType: projectType,
          senderId: owner,
          notificationType: "JOIN_REQUEST",
        };

        const res = await axios.post(
          ApiRouter.projectJoin + projectId,
          projectJoin,
        );
        if (res.data.requestStatus === "JOINED") setJoinBtn(joinBtnName(true));
        else setIsWaiting(true);
      } else {
        await axios.delete(ApiRouter.projectJoin + projectId);
        setJoinBtn(joinBtnName(false));
      }
      setIsJoin((current) => !current);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setLoading({ isLoading: false, on: "JOIN" });
  };

  const handleGivenStar = async () => {
    if (!isAuth) return route.push(AppRouter.signup);
    setLoading({ isLoading: true, on: "STAR" });
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
      toast.error(error.response.data.message);
    }
    setLoading({ isLoading: false, on: "STAR" });
  };

  return (
    <div className="mx-2 border border-gray-200 bg-white p-6 pb-14 shadow-sm">
      <div className="container mx-auto flex flex-col items-center  sm:h-52 sm:flex-row sm:justify-evenly">
        <div className="flex items-center">
          <div className="relative mr-3 h-16 w-20 flex-shrink-0 rounded-lg border border-gray-200 sm:h-36 sm:w-36 md:h-44 md:w-44">
            {projectLogo ? (
              <Image
                src={projectLogo}
                alt={`${projectName} Logo`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            ) : (
              <LiaLaptopCodeSolid className="h-full w-full rounded-lg" />
            )}
          </div>{" "}
          <div>
            <div className="flex items-center text-2xl font-bold text-gray-800">
              <h1>{projectName}</h1>
              <div className="flex items-center pl-5">
                {loading.isLoading && loading.on === "STAR" ? (
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
        <div className="flex sm:flex-col responsive-view-project-btns gap-3 pt-3">
          {!iswaiting || isCreater ? (
            <Button
              size="md"
              disabled={iswaiting}
              isLoading={loading.isLoading && loading.on === "JOIN"}
              color={isCreater ? "danger" : isJoin ? "danger" : "primary"}
              variant="shadow"
              className="text-xl"
              startContent={isCreater ? <BsPencilFill /> : <IoMdGitNetwork />}
              onClick={handleActionBtn}
            >
              {joinBtn}
            </Button>
          ) : (
            <RequestPendingBox />
          )}
          <Button
            as={Link}
            size="md"
            color="secondary"
            variant="shadow"
            className="text-xl text-white"
            startContent={<RxDashboard />}
            href={AppRouter.dashboardPage + projectId}
          >
            Dashboard
          </Button>
        </div>
        <ToastContainer position="bottom-left" className="z-50" />
      </div>
    </div>
  );
};

export default ProjectHeader;

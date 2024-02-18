import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useDashboardContext } from "../../context/context_dashboard";
import Image from "next/image";
import { MdOutlinePersonRemove } from "react-icons/md";
import { useApiCallContext } from "@/utils/context/api_call_context";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";

export const DevsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { contributors, project, isOwner, updateContributors } =
    useDashboardContext();
  const { setIsLoading, setMessageRes, isLoading } = useApiCallContext();
  const removeDev = async (devId: string) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(ApiRouter.projectJoin + project.id, {
        data: { devId },
      });
      updateContributors(contributors.filter((c) => c.id !== devId));
      setMessageRes({ isError: false, message: res.data.message });
    } catch (error: any) {
      setMessageRes({
        isError: true,
        message: error.response.data.message,
      });
    }
    setIsLoading(false);
  };
  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Contributors
              </ModalHeader>
              <ModalBody>
                {contributors.map(({ id, name, email, image }) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
                  >
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={image}
                          alt="Profile picture"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-medium text-gray-900">
                          {name}
                        </div>
                        <div className="text-sm text-gray-500">{email}</div>
                        <div className="text-sm text-indigo-600">
                          {" "}
                          {project.owner === id ? "Admin" : "Contributor"}
                        </div>
                      </div>
                    </div>
                    {isOwner && id !== project.owner && (
                      <Button
                        isIconOnly
                        isLoading={isLoading}
                        color="danger"
                        onClick={() => removeDev(id)}
                      >
                        <MdOutlinePersonRemove size="20px" />
                      </Button>
                    )}
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

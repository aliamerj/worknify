import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import { MdOutlinePersonRemove } from "react-icons/md";
import { useApiCallContext } from "@/utils/context/api_call_context";
import axios from "axios";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";
import Link from "next/link";
import {
  useContributorsInfo,
  useCurrentProject,
  useRemoveContributor,
} from "../../context/hooks";

export const DevsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { project, isOwner } = useCurrentProject();
  const removeContributor = useRemoveContributor();
  const contributors = useContributorsInfo();

  const { setIsLoading, setMessageRes, isLoading } = useApiCallContext();
  const removeDev = async (devId: string) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(ApiRouter.projectJoin + project.id, {
        data: { devId },
      });
      removeContributor(devId);
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
                    {" "}
                    <Link href={AppRouter.viewProfile + id}>
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                          <Avatar
                            src={image ?? undefined}
                            alt="Profile picture"
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
                    </Link>
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

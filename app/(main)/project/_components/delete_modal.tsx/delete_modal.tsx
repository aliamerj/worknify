"use client";
import { LoaderFullPage } from "@/global-components/loader/loader";
import { useApiCallContext } from "@/utils/context/api_call_context";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export const DeleteProjectBtn = ({
  projectName,
  projectId,
}: {
  projectName: string;
  projectId: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {isLoading,setIsLoading,setMessageRes} = useApiCallContext()

  const router = useRouter();
  const handleDeleteProject = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete("/api/project/", { data: { projectId } });
      router.refresh();
      setMessageRes({
        isError: false,
        message: res.data.message,
      }); 
    } catch (error: any) {
      setMessageRes({
        isError: true,
        message: error.response.data.message,
      }); 
    }
    setIsLoading(false);
  };
  return (
    <div>
      <div className="rounded bg-red-500 px-2 py-1 text-center text-sm text-white hover:bg-red-600">
        <button onClick={onOpen}>Delete</button>
      </div>
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        className="bg-white"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Project Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete the project{" "}
                  <b>{projectName}</b> ? This action cannot be undone. Deleting
                  this project will remove all associated data permanently.
                  Please confirm if you wish to proceed
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={onClose}
                  onClick={handleDeleteProject}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {isLoading && <LoaderFullPage />}
    </div>
  );
};

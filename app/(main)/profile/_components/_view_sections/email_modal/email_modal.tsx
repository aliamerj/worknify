import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
export const EmailModal = ({
  isOpen,
  onClose,
  fullName,
  emailUser,
}: {
  fullName: string;
  isOpen: boolean;
  onClose: () => void;
  emailUser: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      className="bg-background"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-gray-800">
                Send Email To {fullName}
              </h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-md text-gray-600">
                Please send your message to:
                <span className="mt-2 block rounded-md bg-gray-100 p-3 text-lg font-medium text-primary shadow-md shadow-black">
                  <strong>{emailUser}</strong>
                </span>
              </p>
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
  );
};

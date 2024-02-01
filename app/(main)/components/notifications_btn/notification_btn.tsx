import { ApiRouter } from "@/utils/router/app_router";
import { NotificationSchema } from "@/utils/validations/notificationsValidation";
import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { AllNotification } from "../notification_item/notification_item";
import { SideErrorMessage } from "@/global-components/side_error_message/side_error_message";

export const NotificationBtn = ({
  notific,
  handleNotific,
}: {
  notific: AllNotification;
  handleNotific: (notifId: number) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleRequest = ({ isAccept }: { isAccept: boolean }) => {
    setIsLoading(true);
    try {
      const notification: NotificationSchema = {
        senderId: notific.senderId,
        notificationType: isAccept ? "ACCEPT_REQUEST" : "REJECT_REQUEST",
      };
      axios.post(ApiRouter.projectJoin + notific.projectId, notification);
    } catch (err: any) {
      setIsError(true);
    }
    handleNotific(notific.id);
    setIsLoading(false);
  };
  const removeNotification = () => {
    setIsLoading(true);
    try {
      axios.delete(ApiRouter.notifications + notific.id);
    } catch (err: any) {
      setIsError(true);
    }
    handleNotific(notific.id);
    setIsLoading(false);
  };
  return (
    <div className="flex justify-end space-x-2">
      {notific.notificationType === "JOIN_REQUEST" ? (
        <>
          <Button
            isLoading={isLoading}
            variant="solid"
            color="success"
            className="text-white"
            onClick={() => handleRequest({ isAccept: true })}
          >
            Accept
          </Button>
          <Button
            isLoading={isLoading}
            variant="ghost"
            color="danger"
            onClick={() => handleRequest({ isAccept: false })}
          >
            Reject
          </Button>
        </>
      ) : isLoading ? (
        <Spinner color="danger" />
      ) : (
        <button
          onClick={removeNotification}
          className="rounded bg-red-400 p-2 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          <FaTimesCircle className="text-lg" />
        </button>
      )}
      {isError && (
        <SideErrorMessage errorMessage="Oops! Something went wrong. Please try again later." />
      )}
    </div>
  );
};

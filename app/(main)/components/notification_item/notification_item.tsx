"use client";
import { AppRouter } from "@/utils/router/app_router";
import Link from "next/link";
import { FaCheck, FaTimes, FaUserPlus } from "react-icons/fa";
import { NotificationBtn } from "../notifications_btn/notification_btn";
import { useState } from "react";
import { NotificationQuery } from "../../notifications/page";

export const NotificationItem = ({
  notifications,
}: {
  notifications: NotificationQuery[];
}) => {
  const [notific, setNotific] = useState(notifications);
  const handleClientNotific = (notifId: number) =>
    setNotific((current) => current.filter((n) => n.id !== notifId));

  const getMessage = (notification: NotificationQuery) => {
    let message;
    let icon;
    const { notificationType, senderId, sender, projectId, project } =
      notification;

    switch (notificationType) {
      case "JOIN_REQUEST":
        message = (
          <>
            <Link
              href={AppRouter.viewProfile + senderId}
              className="text-blue-500 hover:underline"
            >
              {sender.name}
            </Link>{" "}
            has requested to join the development team for your project{" "}
            <Link
              href={AppRouter.viewProject + projectId}
              className="text-blue-500 hover:underline"
            >
              {project.name}
            </Link>
            .
          </>
        );
        icon = <FaUserPlus className="text-3xl text-blue-500" />;
        break;
      case "ACCEPT_REQUEST":
        message = (
          <>
            Your request to join{" "}
            <Link
              href={AppRouter.viewProject + projectId}
              className="text-blue-500 hover:underline"
            >
              {project.name}
            </Link>{" "}
            has been accepted.
          </>
        );
        icon = <FaCheck className="text-3xl text-green-500" />;
        break;
      case "REJECT_REQUEST":
        message = (
          <>
            Your request to join{" "}
            <Link
              href={AppRouter.viewProject + projectId}
              className="text-blue-500 hover:underline"
            >
              {project.name}
            </Link>{" "}
            has been rejected.
          </>
        );
        icon = <FaTimes className="text-3xl text-red-500" />;
        break;
      default:
        message = "Unknown notification type.";
    }
    return { message, icon };
  };
  if (notific.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          No Notifications
        </h2>
        <p className="text-gray-600">You're all caught up!</p>
      </div>
    );
  }

  return notific.map((n) => {
    const { message, icon } = getMessage(n);
    return (
      <div
        key={n.id}
        className="m-5 mx-auto max-w-full rounded-lg bg-white p-4 shadow-md"
      >
        <div className="flex flex-col space-x-4 md:flex-row md:items-center">
          {icon}
          <div className="flex-grow p-1">
            <p className="text-lg text-gray-600">{message}</p>
          </div>
          <NotificationBtn notific={n} handleNotific={handleClientNotific} />
        </div>
      </div>
    );
  });
};

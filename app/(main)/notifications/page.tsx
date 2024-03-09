import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { NotificationItem } from "../components/notification_item/notification_item";
import { Metadata } from "next";
export type NotificationQuery = {
  project: {
    name: string;
  };
  sender: {
    name: string | null;
  };
  notificationType: string;
  id: number;
  senderId: string;
  projectId: number;
};
export const metadata: Metadata = {
  title: "Notifications - Worknify: Stay Updated on Your Projects",
  description:
    "Never miss an update with Worknify's notification page. Receive real-time alerts for project join requests, task updates, and more. Stay connected and responsive to your team's needs, ensuring seamless collaboration and project management.",
};
const NotificationsPage = async () => {
  const sesstion = await getServerSession(authOptions);
  const notifications = await databaseDrizzle.query.notification.findMany({
    where: (n, o) => o.eq(n.receiverId, sesstion?.user.id!),
  });
  if (notifications.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          No Notifications
        </h2>
        <p className="text-gray-600">You're all caught up!</p>
      </div>
    );
  }
  const processedNotifications: NotificationQuery[] =
    await databaseDrizzle.query.notification.findMany({
      where: (n, o) => o.eq(n.receiverId, sesstion?.user.id!),
      columns: {
        notificationType: true,
        id: true,
        senderId: true,
        projectId: true,
      },
      with: {
        sender: {
          columns: {
            name: true,
          },
        },
        project: {
          columns: {
            name: true,
          },
        },
      },
    });
  processedNotifications[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-3 text-2xl font-bold text-gray-800">Notifications</h2>
      <div>
        <NotificationItem notifications={processedNotifications} />
      </div>
    </div>
  );
};

export default NotificationsPage;

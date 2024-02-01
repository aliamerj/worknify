import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { databaseDrizzle } from "@/db/database";
import { getServerSession } from "next-auth";
import { NotificationItem } from "../components/notification_item/notification_item";

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

  const getAllNotifications = async () => {
    // Use Promise.all to wait for all promises to resolve
    const allNotifications = await Promise.all(
      notifications.map(async (n) => {
        const requester = await databaseDrizzle.query.profile.findFirst({
          where: (p, o) => o.eq(p.userId, n.senderId),
          columns: {
            fullName: true,
          },
        });
        const project = await databaseDrizzle.query.project.findFirst({
          where: (p, o) => o.eq(p.id, n.projectId),
          columns: {
            name: true,
          },
        });
        return {
          ...n,
          projectName: project?.name,
          requesterName: requester?.fullName,
        };
      }),
    );

    return allNotifications;
  };

  const processedNotifications = await getAllNotifications();

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

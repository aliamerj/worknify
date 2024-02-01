"use client";
import { AppRouter } from "@/utils/router/app_router";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface IUserAvatar {
  userImage: string | undefined;
  name: string;
  email: string;
  userId: string;
  notificationsCount: number;
}

export const UserAvatar = ({
  userImage,
  name,
  email,
  userId,
  notificationsCount,
}: IUserAvatar) => {
  const notifications = notificationsCount > 0 ?? null;

  return (
    <Badge
      content={notifications && notificationsCount}
      color="danger"
      shape="circle"
      showOutline={notifications}
    >
      <Dropdown placement="bottom-end" className="bg-gray-200">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={name}
            size="md"
            src={userImage}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="settings" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{email}</p>
          </DropdownItem>
          <DropdownItem
            key="profile"
            as={Link}
            href={AppRouter.viewProfile + userId}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            key="profile"
            as={Link}
            href={AppRouter.myProject + userId}
          >
            My Projects
          </DropdownItem>
          <DropdownItem
            key="notifications"
            as={Link}
            href={AppRouter.notification}
          >
            <div className="flex justify-between">
              <p>Notifications</p>
              {notifications && (
                <p className="rounded-full bg-red-600 px-2 font-bold text-white">
                  {notificationsCount}
                </p>
              )}
            </div>
          </DropdownItem>

          <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Badge>
  );
};

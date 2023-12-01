"use client";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";

interface IUserAvatar {
  userImage: string | undefined;
  name: string;
  email: string;
}

export const UserAvatar = ({ userImage, name, email }: IUserAvatar) => {
  return (
    <Badge content="5" color="danger" shape="circle" showOutline={false}>
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
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{email}</p>
          </DropdownItem>
          <DropdownItem key="notifications">
            <div className="flex justify-between">
              <p>Notifications</p>
              <p className="bg-red-600 rounded-full text-white px-1 text-sm font-bold">
                5
              </p>
            </div>
          </DropdownItem>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Badge>
  );
};

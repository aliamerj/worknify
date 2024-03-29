import Image from "next/image";
import styles from "./Navbar.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserAvatar } from "../userAvatar/userAvatar";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import Link from "next/link";
import { Button, Tooltip } from "@nextui-org/react";
import { MdLibraryAdd } from "react-icons/md";
import { AppRouter } from "@/utils/router/app_router";

import getTableCount from "@/utils/api_handler/get_table_count";

export const NavBar = async () => {
  const session = await getServerSession(authOptions);
  var notifications = 0;
  if (session?.user.id)
    notifications = await getTableCount(
      "notification",
      "receiver_id",
      `'${session.user.id}'`,
    );

  return (
    <Navbar className={styles.container}>
      <NavbarBrand as={Link} href="/">
        <Image
          className="h-auto w-auto cursor-pointer"
          src="/worknify_main_logo.svg"
          alt="Worknify"
          width={130}
          height={20}
          priority={true}
        />
      </NavbarBrand>

      <NavbarContent justify="end">
        {session?.user && (
          <Tooltip
            content={"Create New Project"}
            placement="bottom"
            color="secondary"
          >
            <Button
              as={Link}
              href={AppRouter.createProject}
              isIconOnly
              color="primary"
              size="lg"
              aria-label="Like"
            >
              <MdLibraryAdd className="text-2xl" />
            </Button>
          </Tooltip>
        )}
        {session?.user ? (
          <UserAvatar
            name={session.user.name!}
            email={session.user.email!}
            userImage={session.user.image!}
            userId={session.user.id!}
            notificationsCount={notifications}
          />
        ) : (
          <Button
            as={Link}
            color="primary"
            size="lg"
            variant="shadow"
            href="/api/auth/signin"
          >
            Get Started
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

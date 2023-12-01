import Image from "next/image";
import styles from "./Navbar.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserAvatar } from "../userAvatar/userAvatar";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import Link from "next/link";

export const NavBar = async () => {
  const sesstion = await getServerSession(authOptions);
  return (
    <Navbar className={styles.container}>
      <NavbarBrand as={Link} href="/">
        <Image
          className={styles.logo}
          src="/worknify_main_logo.svg"
          alt="Worknify"
          width={190}
          height={50}
        />
      </NavbarBrand>

      <NavbarContent justify="end">
        {sesstion?.user ? (
          <UserAvatar
            name={sesstion.user.name!}
            email={sesstion.user.email!}
            userImage={sesstion.user.image!}
          />
        ) : (
          <Link className={styles.getStartedBtn} href="/api/auth/signin">
            Get Started
          </Link>
        )}
      </NavbarContent>
    </Navbar>
  );
};

import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserAvatar } from "../userAvatar/userAvatar";

export const Navbar = async () => {
  const user = await getServerSession(authOptions);
  return (
    <nav className={styles.container} role="navigation">
      <Link href="/">
        <Image
          className={styles.logo}
          src="/worknify_main_logo.svg"
          alt="Worknify"
          width={300}
          height={60}
        />
      </Link>
      {user ? (
        <UserAvatar userImage={user.user?.image} />
      ) : (
        <Link className={styles.getStartedBtn} href="/api/auth/signin">
          Get Started
        </Link>
      )}
    </nav>
  );
};

"use client";

import { useRef, useState } from "react";
import styles from "./userAvatar.module.css";
import Image from "next/image";
import Link from "next/link";

interface IUserAvatar {
  userImage: string | null | undefined;
}

export const UserAvatar = ({ userImage }: IUserAvatar) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimer.current) {
      clearTimeout(dropdownTimer.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => {
      setShowDropdown(false);
    }, 500); // 500ms delay
  };
  return (
    <div
      className={styles.avatarWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {userImage ? (
        <Image
          src={userImage}
          alt="User Avatar"
          className={styles.avatar}
          width={40}
          height={40}
        />
      ) : (
        <div>logo</div>
      )}
      {showDropdown && (
        <div className={styles.dropdown}>
          <Link href="/api/auth/signout">Logout</Link>
        </div>
      )}
    </div>
  );
};

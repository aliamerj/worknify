"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type ScrollSmoothProps = {
  href: string;
  children: ReactNode;
  className?: string;
};
export const ScrollSmooth = ({
  children,
  href,
  className,
}: ScrollSmoothProps) => {
  const pathname = usePathname();
  const handleScroll = (e: any) => {
    e.preventDefault();

    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");

    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };
  if (pathname !== "/") {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} onClick={handleScroll} className={className}>
      {children}
    </Link>
  );
};

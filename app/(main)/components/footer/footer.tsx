import { AppRouter } from "@/utils/router/app_router";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-10 w-full bg-gray-50 p-4 text-gray-900 md:p-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-1 sm:col-span-2">
          <Image
            src="/worknify_main_logo.svg"
            alt="Worknify"
            className="h-auto w-auto"
            width={100}
            height={20}
            priority={true}
          />
          <p className="mt-2 text-xs sm:text-sm">
            Empowering your project management with unmatched collaboration and
            productivity tools.
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-4">
          <h3 className="text-xs uppercase text-gray-900 sm:text-sm">
            Explore
          </h3>
          <Link
            href={AppRouter.about}
            className="text-xs transition-colors duration-300 hover:text-primary sm:text-sm"
          >
            About Us
          </Link>
          <Link
            href={AppRouter.service}
            className="text-xs transition-colors duration-300 hover:text-primary sm:text-sm"
          >
            Services
          </Link>
          <Link
            href={AppRouter.privacyPolicy}
            className="text-xs transition-colors duration-300 hover:text-primary sm:text-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href={AppRouter.contact}
            className="text-xs transition-colors duration-300 hover:text-primary sm:text-sm"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-4">
          <h3 className="text-xs uppercase text-gray-900 sm:text-sm">
            Follow Me
          </h3>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a
              href="https://github.com/aliamerj"
              target="_blank"
              className="transition-colors duration-300 hover:text-primary"
            >
              <FaGithub size="20" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61550300066538"
              target="_blank"
              className="transition-colors duration-300 hover:text-primary"
            >
              <FaFacebookF size="20" />
            </a>
            <a
              href="https://linkedin.com/in/aliamer22"
              target="_blank"
              className="transition-colors duration-300 hover:text-primary"
            >
              <FaLinkedinIn size="20" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-800 pt-4 text-center text-xs sm:mt-8 sm:pt-6">
        <p>&copy; {new Date().getFullYear()} worknify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

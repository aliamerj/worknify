import { AppRouter } from "@/utils/router/app_router";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 bg-gray-50 p-10 text-gray-900">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2">
          <Image
            src="/worknify_main_logo.svg"
            alt="Worknify"
            className="h-auto w-auto  fill-current text-white"
            width={100}
            height={20}
            priority={true}
          />

          <p className="mt-2 text-sm">
            Empowering your project management with unmatched collaboration and
            productivity tools.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-sm uppercase text-gray-900">Explore</h3>
          <Link
            href={AppRouter.about}
            className="text-sm transition-colors duration-300 hover:text-primary"
          >
            About Us
          </Link>
          <Link
            href={AppRouter.service}
            className="text-sm transition-colors duration-300 hover:text-primary"
          >
            Services
          </Link>
          <Link
            href={AppRouter.privacyPolicy}
            className="text-sm transition-colors duration-300 hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href={AppRouter.contact}
            className="text-sm transition-colors duration-300 hover:text-primary"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-sm uppercase text-gray-900">Follow Me</h3>
          <div className="flex items-center space-x-4">
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
      <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} worknify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

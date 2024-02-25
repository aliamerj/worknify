import { AppRouter } from "@/utils/router/app_router";
import Link from "next/link";
import React from "react";
import {
  MdOutlineBuild,
  MdOutlineLightbulb,
  MdPeople,
  MdRocketLaunch,
} from "react-icons/md";

const CallToActionSection = () => {
  return (
    <div className="mt-10 transform rounded-t-lg bg-gradient-to-r from-primary to-teal-400 p-8 text-white shadow-xl">
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Ready to Elevate Your Project Game?
        </h2>
        <p className="text-md text-center md:px-20 md:text-lg lg:px-32">
          Embark on a journey of unparalleled productivity and collaboration
          with worknify. Discover the ultimate platform where creativity meets
          efficiency, transforming your ideas into success stories. It's time to
          streamline your workflow, connect with talented individuals, and bring
          your projects to life like never before.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <MdRocketLaunch className="h-10 w-10 md:h-12 md:w-12" />
          <MdPeople className="h-10 w-10 md:h-12 md:w-12" />
          <MdOutlineLightbulb className="h-10 w-10 md:h-12 md:w-12" />
          <MdOutlineBuild className="h-10 w-10 md:h-12 md:w-12" />
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href={AppRouter.signup}
            className="rounded-full bg-white px-6 py-2 font-bold text-blue-700 transition duration-300 hover:bg-gray-200"
          >
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;

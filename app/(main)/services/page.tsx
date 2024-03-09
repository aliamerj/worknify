import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppRouter } from "@/utils/router/app_router";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import {
  FaPencilRuler,
  FaProjectDiagram,
  FaTasks,
  FaCodeBranch,
  FaRocket,
  FaLightbulb,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Professional Services - Worknify: Enhance Your Career Journey",
  description:
    "Elevate your professional experience with Worknify's diverse services. Create a personalized portfolio, manage projects with dynamic tools, organize tasks efficiently, and join an innovative open-source community. Start your journey with Worknify to unlock new opportunities and achieve your career goals.",
};
const ServicesPage = async () => {
  const auth = await getServerSession(authOptions);
  return (
    <div className="services-page mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Empower Your Professional Journey with worknify
      </h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Personalized Portfolio Creation */}
        <div className="service-item rounded-lg bg-gray-100 p-6 shadow">
          <FaPencilRuler className="mx-auto text-4xl text-blue-500" />
          <h2 className="mt-4 text-2xl font-semibold">
            Personalized Portfolio Creation
          </h2>
          <h3 className="mt-2 text-xl">Showcase Your Professional Essence</h3>
          <p className="mt-2">
            Unlock the door to new opportunities with a dynamic portfolio that
            captures the full spectrum of your professional achievements.
            Increase visibility and establish a professional online presence
            that speaks volumes.
          </p>
        </div>

        {/* Dynamic Project Management */}
        <div className="service-item rounded-lg bg-gray-100 p-6 shadow">
          <FaProjectDiagram className="mx-auto text-4xl text-green-500" />
          <h2 className="mt-4 text-2xl font-semibold">
            Dynamic Project Management
          </h2>
          <h3 className="mt-2 text-xl">Streamline Your Success</h3>
          <p className="mt-2">
            Take control of your projects with precision. Enhance efficiency,
            improve team collaboration, and ensure project success with tailored
            management tools.
          </p>
        </div>

        {/* Customizable Task Dashboards */}
        <div className="service-item rounded-lg bg-gray-100 p-6 shadow">
          <FaTasks className="mx-auto text-4xl text-yellow-500" />
          <h2 className="mt-4 text-2xl font-semibold">
            Customizable Task Dashboards
          </h2>
          <h3 className="mt-2 text-xl">Organize, Track, and Achieve</h3>
          <p className="mt-2">
            Dive into the ultimate task management experience. Keep your
            projects on track and streamline workflows for maximum productivity.
          </p>
        </div>

        {/* Open Source Community */}
        <div className="service-item rounded-lg bg-gray-100 p-6 shadow">
          <FaCodeBranch className="mx-auto text-4xl text-purple-500" />
          <h2 className="mt-4 text-2xl font-semibold">Open Source Community</h2>
          <h3 className="mt-2 text-xl">Collaborate and Contribute</h3>
          <p className="mt-2">
            Join our vibrant open-source community. Be at the forefront of
            project management innovation and help shape the future of worknify.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      {!auth?.user && (
        <div className="cta-section mt-12 text-center">
          <p className="mb-4 text-xl">Ready to Transform Your Workflow?</p>
          <Link
            href={AppRouter.signup}
            className="mr-4 inline-block rounded-full bg-blue-500 px-6 py-2 font-bold text-white transition duration-300 hover:bg-blue-600"
          >
            <FaRocket className="mr-2 inline" /> Get Started with worknify
          </Link>
          <Link
            href={AppRouter.about}
            className="inline-block rounded-full bg-gray-500 px-6 py-2 font-bold text-white transition duration-300 hover:bg-gray-600"
          >
            <FaLightbulb className="mr-2 inline" /> Learn More About Our
            Features
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;

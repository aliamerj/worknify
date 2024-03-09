import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppRouter } from "@/utils/router/app_router";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import {
  FaRocket,
  FaUsers,
  FaCodeBranch,
  FaTasks,
  FaRegLightbulb,
  FaStar,
  FaClipboardList,
} from "react-icons/fa"; // Importing icons

export const metadata: Metadata = {
  title: "About Worknify - Empowering Collaboration and Innovation",
  description:
    "Learn about Worknify, your ultimate open-source platform for project management and team collaboration. Discover our mission, community-driven approach, and innovative features designed to elevate your professional journey. Join Worknify today and transform your project management experience.",
};

const AboutPage = async () => {
  const auth = await getServerSession(authOptions);
  return (
    <div className="about-page bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-6 text-center text-4xl font-bold">About Worknify</h1>
        <p className="text-md mb-10 text-center text-gray-600">
          Where Ideas Meet Execution - An Open-Source Revolution
        </p>

        <section className="mb-12">
          <div className="mb-8 text-center">
            <FaRocket className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold">Our Mission</h2>
          </div>
          <p className="mx-auto max-w-prose text-lg leading-relaxed">
            Worknify is not just another platform; it's a community-driven
            powerhouse designed to empower professionals, creators, and dreamers
            with innovative tools for project management and team collaboration.
            We believe in the power of connection, innovation, and open-source
            collaboration to transform the way we work, create, and share.
          </p>
        </section>

        <section className="mb-12">
          <div className="mb-8 text-center">
            <FaUsers className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold">Our Community</h2>
          </div>
          <p className="mx-auto max-w-prose text-lg leading-relaxed">
            Worknify is built with the vision of connecting like-minded
            individuals. Our platform fosters collaboration, allowing you to
            share ideas, achieve collective success, and contribute to the
            open-source movement.
          </p>
        </section>

        <section className="features mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FaRegLightbulb className="h-8 w-8 text-primary" />}
              title="Innovative Ideas"
              description="Capture and develop innovative ideas with our intuitive tools."
            />
            <FeatureCard
              icon={<FaTasks className="h-8 w-8 text-primary" />}
              title="Dynamic Project Management"
              description="Project management that adapts to your needs, with customizable visibility settings."
            />
            <FeatureCard
              icon={<FaCodeBranch className="h-8 w-8 text-primary" />}
              title="Collaborative Coding"
              description="Collaborate on code in real-time with integrated version control."
            />
            <FeatureCard
              icon={<FaStar className="h-8 w-8 text-primary" />}
              title="Personalized Portfolio Websites"
              description="Craft a stunning digital portfolio to showcase your professional journey."
            />
            <FeatureCard
              icon={<FaClipboardList className="h-8 w-8 text-primary" />}
              title="Task Management Redefined"
              description="Organize your tasks with ease using our intuitive Kanban system."
            />
          </div>
        </section>

        {!auth?.user && (
          <section className="join-us">
            <div className="text-center">
              <FaUsers className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-2xl font-semibold">
                Join Our Community
              </h2>
              <p className="mx-auto mb-3 mt-4 max-w-prose text-lg leading-relaxed">
                Ready to transform your workflow, connect with like-minded
                professionals, and bring your projects to life? Join Worknify
                today and be a part of this exciting journey of innovation and
                collaboration.
              </p>
              <Link
                href={AppRouter.signup}
                className="hover:bg-primary-dark mt-6 rounded-lg bg-primary px-6 py-2 font-semibold text-white shadow-md transition duration-200"
              >
                Get Started
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// FeatureCard component for reusability and cleaner code
const FeatureCard = ({ icon, title, description }: any) => (
  <div className="feature-card rounded-lg bg-white p-6 text-center shadow-lg">
    {icon}
    <h3 className="mb-2 mt-4 text-xl font-semibold">{title}</h3>
    <p className="text-md">{description}</p>
  </div>
);

export default AboutPage;

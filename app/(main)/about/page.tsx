import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AppRouter } from '@/utils/router/app_router';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { FaRocket, FaUsers, FaCodeBranch, FaTasks, FaRegLightbulb, FaStar, FaClipboardList } from 'react-icons/fa'; // Importing icons
const AboutPage =async () => {
  const auth =await getServerSession(authOptions)
  return (
    <div className="about-page bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">About Worknify</h1>
        <p className="text-md text-center text-gray-600 mb-10">Where Ideas Meet Execution - An Open-Source Revolution</p>
        
        <section className="mb-12">
          <div className="text-center mb-8">
            <FaRocket className="mx-auto text-primary h-12 w-12" />
            <h2 className="text-2xl font-semibold mt-4">Our Mission</h2>
          </div>
          <p className="text-lg mx-auto leading-relaxed max-w-prose">
            Worknify is not just another platform; it's a community-driven powerhouse designed to empower professionals, creators, and dreamers with innovative tools for project management and team collaboration. We believe in the power of connection, innovation, and open-source collaboration to transform the way we work, create, and share.
          </p>
        </section>

        <section className="mb-12">
          <div className="text-center mb-8">
            <FaUsers className="mx-auto text-primary h-12 w-12" />
            <h2 className="text-2xl font-semibold mt-4">Our Community</h2>
          </div>
          <p className="text-lg mx-auto leading-relaxed max-w-prose">
            Worknify is built with the vision of connecting like-minded individuals. Our platform fosters collaboration, allowing you to share ideas, achieve collective success, and contribute to the open-source movement.
          </p>
        </section>

        <section className="features mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaRegLightbulb className="text-primary h-8 w-8" />}
              title="Innovative Ideas"
              description="Capture and develop innovative ideas with our intuitive tools."
            />
            <FeatureCard
              icon={<FaTasks className="text-primary h-8 w-8" />}
              title="Dynamic Project Management"
              description="Project management that adapts to your needs, with customizable visibility settings."
            />
            <FeatureCard
              icon={<FaCodeBranch className="text-primary h-8 w-8" />}
              title="Collaborative Coding"
              description="Collaborate on code in real-time with integrated version control."
            />
            <FeatureCard
              icon={<FaStar className="text-primary h-8 w-8" />}
              title="Personalized Portfolio Websites"
              description="Craft a stunning digital portfolio to showcase your professional journey."
            />
            <FeatureCard
              icon={<FaClipboardList className="text-primary h-8 w-8" />}
              title="Task Management Redefined"
              description="Organize your tasks with ease using our intuitive Kanban system."
            />
          </div>
        </section>

        {!auth?.user &&<section className="join-us">
          <div className="text-center">
            <FaUsers className="mx-auto text-primary h-12 w-12" />
            <h2 className="text-2xl font-semibold mt-4">Join Our Community</h2>
            <p className="text-lg mx-auto leading-relaxed max-w-prose mt-4 mb-3">
              Ready to transform your workflow, connect with like-minded professionals, and bring your projects to life? Join Worknify today and be a part of this exciting journey of innovation and collaboration.
            </p>
            <Link href={AppRouter.signup} className="mt-6 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-200">
              Get Started
            </Link>
          </div>
        </section>}
      </div>
    </div>
  );
};

// FeatureCard component for reusability and cleaner code
const FeatureCard = ({ icon, title, description }:any) => (
  <div className="feature-card bg-white p-6 rounded-lg shadow-lg text-center">
    {icon}
    <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
    <p className="text-md">{description}</p>
  </div>
);

export default AboutPage;


import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AppRouter } from '@/utils/router/app_router';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { FaPencilRuler, FaProjectDiagram, FaTasks, FaCodeBranch, FaRocket, FaLightbulb } from 'react-icons/fa'; // Importing icons for services

const ServicesPage =async () => {
  const auth =await getServerSession(authOptions);
  return (
    <div className="services-page max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Empower Your Professional Journey with worknify</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Personalized Portfolio Creation */}
        <div className="service-item bg-gray-100 p-6 rounded-lg shadow">
          <FaPencilRuler className="text-4xl text-blue-500 mx-auto"/>
          <h2 className="text-2xl font-semibold mt-4">Personalized Portfolio Creation</h2>
          <h3 className="text-xl mt-2">Showcase Your Professional Essence</h3>
          <p className="mt-2">
            Unlock the door to new opportunities with a dynamic portfolio that captures the full spectrum of your professional achievements. Increase visibility and establish a professional online presence that speaks volumes.
          </p>
        </div>

        {/* Dynamic Project Management */}
        <div className="service-item bg-gray-100 p-6 rounded-lg shadow">
          <FaProjectDiagram className="text-4xl text-green-500 mx-auto"/>
          <h2 className="text-2xl font-semibold mt-4">Dynamic Project Management</h2>
          <h3 className="text-xl mt-2">Streamline Your Success</h3>
          <p className="mt-2">
            Take control of your projects with precision. Enhance efficiency, improve team collaboration, and ensure project success with tailored management tools.
          </p>
        </div>

        {/* Customizable Task Dashboards */}
        <div className="service-item bg-gray-100 p-6 rounded-lg shadow">
          <FaTasks className="text-4xl text-yellow-500 mx-auto"/>
          <h2 className="text-2xl font-semibold mt-4">Customizable Task Dashboards</h2>
          <h3 className="text-xl mt-2">Organize, Track, and Achieve</h3>
          <p className="mt-2">
            Dive into the ultimate task management experience. Keep your projects on track and streamline workflows for maximum productivity.
          </p>
        </div>

        {/* Open Source Community */}
        <div className="service-item bg-gray-100 p-6 rounded-lg shadow">
          <FaCodeBranch className="text-4xl text-purple-500 mx-auto"/>
          <h2 className="text-2xl font-semibold mt-4">Open Source Community</h2>
          <h3 className="text-xl mt-2">Collaborate and Contribute</h3>
          <p className="mt-2">
            Join our vibrant open-source community. Be at the forefront of project management innovation and help shape the future of worknify.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      {!auth?.user &&
      <div className="cta-section text-center mt-12">
        <p className="text-xl mb-4">Ready to Transform Your Workflow?</p>
        <Link href={AppRouter.signup} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 mr-4">
          <FaRocket className="inline mr-2"/> Get Started with worknify
        </Link>
        <Link href={AppRouter.about} className="inline-block bg-gray-500 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-600 transition duration-300">
          <FaLightbulb className="inline mr-2"/> Learn More About Our Features
        </Link>
      </div>
      }
    </div>
  );
};

export default ServicesPage;

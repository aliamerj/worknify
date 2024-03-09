import { Metadata } from "next";
import {
  FaUserSecret,
  FaLock,
  FaTasks,
  FaShieldAlt,
  FaDatabase,
  FaRegQuestionCircle,
  FaMailBulk,
  FaArrowRight,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Privacy Policy - Worknify: Your Data, Our Responsibility",
  description:
    "Read Worknify's Privacy Policy to understand how we prioritize your data's security and privacy. Learn about our practices for collecting, using, and protecting personal information, and discover your rights regarding data management. Trust Worknify with your information—transparency and control are at the core of our service.",
};
const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Privacy Policy for Worknify
      </h1>
      <p className="mb-12 text-center text-sm text-gray-600">
        Effective Date: February 27, 2024
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaUserSecret className="mr-2" /> Information Collection and Use
          </h2>
          <p>
            Personal Information: We collect personal information such as your
            name, email address, and additional profile information to
            personalize your experience and communicate with you.
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaLock className="mr-2" /> Project Management
          </h2>
          <p>
            Details Collection: When creating a project, we collect information
            to facilitate management and collaboration, respecting the privacy
            settings you choose.
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaTasks className="mr-2" /> Task Management
          </h2>
          <p>
            Task Dashboard: Our tools help organize and track progress on tasks,
            enhancing productivity and project tracking.
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaShieldAlt className="mr-2" /> Data Security
          </h2>
          <p>
            Protection Measures: We implement robust security measures,
            including encryption and access control, to protect your
            information.
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaDatabase className="mr-2" /> Third-party Services
          </h2>
          <p>
            Integrations: Worknify uses third-party services with their own
            privacy policies, which we advise you to review.
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaRegQuestionCircle className="mr-2" /> User Rights
          </h2>
          <p>
            Access and Control: You have the right to access, update, or delete
            your information stored by Worknify.
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaMailBulk className="mr-2" /> Contact Information
          </h2>
          <p>
            Feedback and Concerns: For any questions or feedback, please reach
            out to us at{" "}
            <a
              href="mailto:aliamer19ali@gmail.com"
              className="text-blue-500 transition duration-300 hover:text-blue-600"
            >
              aliamer19ali@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 flex items-center text-xl font-semibold">
            <FaArrowRight className="mr-2" /> Consent
          </h2>
          <p>
            By using Worknify, you consent to the collection, use, and sharing
            of your information as described in this Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import { FaUserSecret, FaLock, FaTasks, FaShieldAlt, FaDatabase, FaRegQuestionCircle, FaMailBulk, FaArrowRight } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy for Worknify</h1>
      <p className="text-sm text-gray-600 text-center mb-12">Effective Date: February 27, 2024</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaUserSecret className="mr-2"/> Information Collection and Use</h2>
          <p>Personal Information: We collect personal information such as your name, email address, and additional profile information to personalize your experience and communicate with you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaLock className="mr-2"/> Project Management</h2>
          <p>Details Collection: When creating a project, we collect information to facilitate management and collaboration, respecting the privacy settings you choose.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaTasks className="mr-2"/> Task Management</h2>
          <p>Task Dashboard: Our tools help organize and track progress on tasks, enhancing productivity and project tracking.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaShieldAlt className="mr-2"/> Data Security</h2>
          <p>Protection Measures: We implement robust security measures, including encryption and access control, to protect your information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaDatabase className="mr-2"/> Third-party Services</h2>
          <p>Integrations: Worknify uses third-party services with their own privacy policies, which we advise you to review.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaRegQuestionCircle className="mr-2"/> User Rights</h2>
          <p>Access and Control: You have the right to access, update, or delete your information stored by Worknify.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaMailBulk className="mr-2"/> Contact Information</h2>
          <p>Feedback and Concerns: For any questions or feedback, please reach out to us at <a href="mailto:aliamer19ali@gmail.com" className="text-blue-500 hover:text-blue-600 transition duration-300">aliamer19ali@gmail.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center mb-2"><FaArrowRight className="mr-2"/> Consent</h2>
          <p>By using Worknify, you consent to the collection, use, and sharing of your information as described in this Privacy Policy.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

"use client";
import Link from "next/link";
import { useProfileData } from "./profile_context";
import DOMPurify from "dompurify";

export const ProfileDisplay = ({ userId }: { userId: string }) => {
  // Sanitize the HTML content
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  //const { profileData } = useProfileData();
  console.log({ userId });
  const profileData = {
    name: "Jordan Smith",
    jobTitle: "Senior Full Stack Developer",
    email: "jordan.smith@example.com",
    phone: "+1234567890",
    address: "1234, Elm Street, Springfield, USA",
    gitHub: "jordan-smith",
    linkedin: "jordan-smith",
    intro:
      "Senior Full Stack Developer with over 10 years of experience in developing scalable web applications and working with cross-functional teams. Proficient in modern web technologies, agile methodologies, and leading project teams. Committed to writing clean, optimized, and maintainable code.",
    sections: [
      {
        title: "Professional Experience",
        description:
          "<p>Senior Software Developer at Tech Innovations, Jan 2020 - Present</p><ul><li>Lead the development of a high-traffic e-commerce platform, resulting in a 20% increase in sales</li><li>Implemented advanced features using React, Redux, and Node.js</li><li>Mentored junior developers and conducted code reviews to ensure best practices</li></ul><p>Software Developer at Tech Solutions, Jan 2010 - Dec 2019</p><ul><li>Developed and maintained multiple enterprise-level web applications</li><li>Collaborated with UI/UX designers to implement user-centric solutions</li><li>Optimized applications for maximum speed and scalability</li></ul>",
      },
      {
        title: "Education",
        description:
          "<p>Master of Science in Computer Science, University of Tech, 2008 - 2010</p><p>Bachelor of Science in Computer Science, University of Springfield, 2004 - 2008</p>",
      },
      {
        title: "Skills",
        description:
          "<ul><li>Programming Languages: JavaScript (ES6+), Python, Java, C#</li><li>Frameworks & Libraries: React, Angular, Node.js, .NET</li><li>Databases: MySQL, PostgreSQL, MongoDB</li><li>DevOps & Tools: Docker, Jenkins, AWS, Azure</li><li>Methodologies: Agile, Scrum, TDD</li></ul>",
      },
      {
        title: "Certifications",
        description:
          "<p>Full Stack Web Development, Code Academy, 2021</p><p>Azure Solutions Architect, Microsoft, 2019</p>",
      },
      {
        title: "Projects",
        description:
          "<p>Project Manager, Online Learning Platform, Tech Innovations, 2021 - Present</p><p>Key Developer, Mobile Banking App, Tech Solutions, 2016 - 2020</p>",
      },
      {
        title: "Languages",
        description:
          "<p>English (Native), Spanish (Professional Proficiency), German (Conversational)</p>",
      },
      {
        title: "Interests",
        description:
          "<p>Coding Challenges, Open Source Contribution, Blogging about Tech Trends, Mountain Biking, Photography</p>",
      },
    ],
  };

  const githubLink = `https//github.com/${profileData.gitHub}`;
  const linkedin = `https//linkedin.com/in/${profileData.linkedin}`;
  const workify = `/user/${userId}`;

  return (
    <div className="h-full rounded bg-white">
      <section
        className={`relative mx-2 p-2 pt-3 md:mx-4 ${
          profileData.jobTitle.trim().length === 0 && "pb-6"
        }`}
      >
        <h1 className="text-center text-lg font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
          {profileData.name}
        </h1>
        <h3 className="text-center text-base font-bold text-secondary sm:text-xl xl:text-3xl">
          {profileData.jobTitle}
        </h3>
        <div className="absolute right-0 top-2 flex flex-col text-sm text-blue-900 underline">
          {profileData.gitHub && (
            <Link href={githubLink} target="_blank" rel="noopener">
              My GitHub
            </Link>
          )}
          {profileData.linkedin && (
            <Link href={linkedin} target="_blank" rel="noopener">
              My Linkedin
            </Link>
          )}
          <Link href={workify} target="_blank">
            My Worknify
          </Link>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between  overflow-clip rounded bg-content3 p-2 text-xs text-background md:flex-nowrap md:text-sm lg:justify-between lg:gap-4">
        <p className="mb-2 md:mb-0">{profileData.email}</p>
        <p className="mb-2 md:mb-0">{profileData.phone}</p>
        <p className="mb-2 md:mb-0">{profileData.address}</p>
      </div>
      <p className="mx-3 overflow-clip pb-4 pt-2 text-center font-sans text-xs sm:text-medium ">
        {profileData.intro}
      </p>
      {profileData.sections.map((section, index) => (
        <div key={index} className="px-2 pb-3 md:pb-5">
          <h1 className="pl-1 text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
            {section.title}
          </h1>
          <hr className="border-black" />
          <div className="prose">
            <div
              className="ql-editor mb-[10px] px-3 text-xs sm:text-medium xl:text-medium"
              dangerouslySetInnerHTML={createMarkup(section.description)}
            />
          </div>
        </div>
      ))}{" "}
    </div>
  );
};

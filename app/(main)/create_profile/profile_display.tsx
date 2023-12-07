"use client";
import { useProfileData } from "./profile_context";
import DOMPurify from "dompurify";

export const ProfileDisplay = () => {
  // Sanitize the HTML content
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  const { profileData } = useProfileData();
  const githubLink = `https//github.com/${profileData.gitHub}`;
  const linkedin = `https//linkedin.com/in/${profileData.linkedin}`;
  const workify = `https//workify.io/user/${profileData.email}`;

  return (
    <div className="h-full rounded bg-white">
      <section
        className={`relative mx-2 p-2 pt-3 md:mx-4 ${
          profileData.jobTitle.trim().length === 0 && "pb-6"
        }`}
      >
        <h1 className="text-center text-2xl font-bold md:text-3xl">
          {profileData.name}
        </h1>
        <h3 className="text-center text-base font-bold text-secondary md:text-lg">
          {profileData.jobTitle}
        </h3>
        <div className="absolute right-0 top-2 flex flex-col text-sm text-blue-900 underline">
          {profileData.gitHub && <a href={githubLink}>My GitHub</a>}
          {profileData.linkedin && <a href={linkedin}>My Linkedin</a>}
          <a href={workify}>My Worknify</a>
        </div>
      </section>

      <div className="flex flex-wrap justify-between rounded bg-content3 p-2 text-xs text-background md:text-sm">
        <p>{profileData.email}</p>
        <p>{profileData.phone}</p>
        <p>{profileData.address}</p>
      </div>

      <p className="pb-5 text-center font-sans text-xs md:text-sm">
        {profileData.intro}
      </p>

      {profileData.sections.map((section, index) => (
        <div key={index} className="px-2 pb-3 md:pb-5">
          <h1 className="pl-1 text-base font-bold md:text-lg">
            {section.title}
          </h1>
          <hr className="border-black" />
          <div className="prose">
            <div
              className="ql-editor mb-[10px] px-3 text-xs md:text-sm"
              dangerouslySetInnerHTML={createMarkup(section.description)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

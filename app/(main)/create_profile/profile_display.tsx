"use client";
import { useProfileData } from "./profile_context";
import ReactMarkdown from "react-markdown";

export const ProfileDisplay = () => {
  const { profileData } = useProfileData();
  const githubLink = `https//github.com/${profileData.gitHub}`;
  const linkedin = `https//linkedin.com/in/${profileData.linkedin}`;
  const workify = `https//workify.io/user/${
    profileData.username ?? profileData.email
  }`;

  return (
    <div className="rounded bg-white">
      <section
        className={`relative mx-4 p-2 pt-3 ${
          profileData.jobTitle.trim().length === 0 && "pb-6"
        }`}
      >
        <h1 className="text-center text-3xl font-bold">{profileData.name}</h1>
        <h3 className="text-center text-lg font-bold text-secondary">
          {profileData.jobTitle}
        </h3>
        <div className="absolute right-0 top-2 flex flex-col text-sm text-blue-900 underline">
          {profileData.gitHub && <a href={githubLink}>My GitHub</a>}
          {profileData.linkedin && <a href={linkedin}>My Linkedin</a>}
          <a href={workify}>My Workify</a>
        </div>
      </section>
      <div className="flex justify-between rounded bg-content3 p-2 text-sm text-background">
        <p>{profileData.email}</p>
        <p>{profileData.phone}</p>
        <p>{profileData.address}</p>
      </div>
      <p className="pb-5 text-center font-sans text-sm">{profileData.intro}</p>

      <p>
        {profileData.sections.map((section, index) => (
          <div key={index} className="px-2 pb-5">
            <h1 className="pl-1 text-lg font-bold">{section.title}</h1>
            <hr className="border-black" />
            <div className="prose">
              <ReactMarkdown className="px-3 py-1 text-sm">
                {section.description}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </p>
    </div>
  );
};

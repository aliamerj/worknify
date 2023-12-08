"use client";
import Link from "next/link";
import { useProfileData } from "./profile_context";
import DOMPurify from "dompurify";

export const ProfileDisplay = ({ userId }: { userId: string }) => {
  // Sanitize the HTML content
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  const { profileData } = useProfileData();

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

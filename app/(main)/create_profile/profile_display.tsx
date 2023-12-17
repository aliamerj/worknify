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

  const githubLink = `https//github.com/${profileData.github}`;
  const linkedin = `https//linkedin.com/in/${profileData.linkedin}`;
  const workify = `/user/${userId}`;

  return (
    <div className="h-full rounded bg-white">
      <section
        className={`relative mx-2 p-2 pt-3 md:mx-4 ${
          profileData.jobTitle.trim().length === 0 && "pb-10"
        }`}
      >
        <h1 className="text-center text-lg font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
          {profileData.fullName}
        </h1>
        <h3 className="text-center text-base font-bold text-secondary sm:text-xl xl:text-3xl">
          {profileData.jobTitle}
        </h3>
        <div className="absolute right-0 top-2 flex flex-col text-sm text-blue-900 underline">
          {profileData.github && (
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
        <p className="mb-2 md:mb-0">{profileData.phoneNumber}</p>
        <p className="mb-2 md:mb-0">{profileData.address}</p>
      </div>
      <p className="mx-2 overflow-clip pb-4 pt-2 text-center font-sans text-xs sm:text-medium ">
        {profileData.background}
      </p>
      {profileData.experiences.length > 0 && (
        <>
          <h1 className="pl-1 text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
            WORK EXPERIENCE
          </h1>
          <hr className="border-black" />
        </>
      )}
      <div>
        {profileData.experiences.map((exp, index) => (
          <div className="p-2" key={index}>
            <h1 className="text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
              {" "}
              {exp.company}{" "}
              {exp.role ? (
                <span className="font-bold">
                  {" "}
                  -{" "}
                  <span className="overflow-clip font-serif font-normal">
                    {exp.role}
                  </span>
                </span>
              ) : (
                ""
              )}
            </h1>
            <h3 className="font-sans text-small text-gray-500">
              {exp.timePeriod.startDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}{" "}
              -
              {exp.timePeriod.endDate
                ? exp.timePeriod.endDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : " Current"}
            </h3>
            <div className="prose">
              <div
                className="ql-editor m-0 mb-[10px] p-0"
                dangerouslySetInnerHTML={createMarkup(exp.description ?? "")}
              />
            </div>
          </div>
        ))}
      </div>
      {profileData.educations.length > 0 && (
        <>
          <h1 className="pl-1 text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
            EDUCATION
          </h1>
          <hr className="border-black" />
        </>
      )}
      <div>
        {profileData.educations.map((ed, index) => (
          <div className="p-2" key={index}>
            <h1 className="text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
              {" "}
              {ed.university}{" "}
              {ed.degree ? (
                <span className="font-bold">
                  {" "}
                  -{" "}
                  <span className="overflow-clip font-serif font-normal">
                    {ed.degree}
                  </span>
                </span>
              ) : (
                ""
              )}
            </h1>
            <h3 className="font-sans text-small text-gray-500">
              {ed.timePeriod.startDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}{" "}
              -
              {ed.timePeriod.endDate
                ? ed.timePeriod.endDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : " Current"}
            </h3>
          </div>
        ))}
      </div>
      {profileData.skills.length > 0 && (
        <>
          <h1 className="pl-1 text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
            SKILLS
          </h1>
          <hr className="border-black" />
        </>
      )}
      <div className="flex flex-wrap justify-evenly gap-4 p-2">
        {profileData.skills.length > 0 &&
          profileData.skills.split(",").map((skill, index) => (
            <div
              key={index}
              className="my-1 flex-initial rounded bg-gray-200 p-2 text-center shadow"
            >
              {skill.trim()}
            </div>
          ))}
      </div>
      {profileData.sections?.map((section, index) => (
        <div key={index} className="px-2 pb-3 md:pb-5">
          <h1 className="pl-1 text-base font-bold sm:text-2xl md:text-lg xl:text-3xl">
            {section.title}
          </h1>
          <hr className="border-black" />
          <div className="prose">
            <div
              className="ql-editor  mb-[10px] px-3 text-xs sm:text-medium xl:text-medium"
              dangerouslySetInnerHTML={createMarkup(section.description)}
            />
          </div>
        </div>
      ))}{" "}
    </div>
  );
};

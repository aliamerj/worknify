"use client";
import Link from "next/link";

import DOMPurify from "dompurify";
import { useProfileData } from "../../context/hooks";
import { useFormContext, useWatch } from "react-hook-form";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import { useMemo } from "react";

export const ProfileDisplay = () => {
  const defaultValue = useProfileData();
  const { control } = useFormContext<ProfileSchema>();
  const profileData = useWatch({
    control,
    defaultValue,
  });

  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  useMemo(() => {
    localStorage.setItem("formData", JSON.stringify(profileData));
  }, [profileData]);

  const renderGitHubLink = () => {
    if (profileData.github) {
      const githubLink = `https://github.com/${profileData.github}`;
      return (
        <Link href={githubLink} target="_blank" rel="noopener">
          My GitHub
        </Link>
      );
    }
    return null;
  };

  const renderLinkedInLink = () => {
    if (profileData.linkedin) {
      const linkedinLink = `https://linkedin.com/in/${profileData.linkedin}`;
      return (
        <Link href={linkedinLink} target="_blank" rel="noopener">
          My LinkedIn
        </Link>
      );
    }
    return null;
  };

  const renderWorknifyLink = () => {
    const worknifyLink = `/user/${defaultValue.userId}`;
    return (
      <Link href={worknifyLink} target="_blank">
        My Worknify
      </Link>
    );
  };

  const renderContactInfo = () => {
    return (
      <div className="flex flex-wrap items-center justify-between bg-blue-100 p-2 text-xs md:flex-nowrap md:text-sm lg:justify-between lg:gap-4">
        <p>{profileData.email}</p>
        <p>{profileData.phoneNumber}</p>
        <p>{profileData.address}</p>
      </div>
    );
  };

  const renderBackground = () => {
    return (
      <p className="mx-2 pb-4 pt-2 text-center text-xs sm:text-medium">
        {profileData.background}
      </p>
    );
  };

  const renderWorkExperience = () => {
    if (profileData.experiences && profileData.experiences?.length > 0) {
      return (
        <>
          <h1 className="pl-1 text-base font-bold md:text-lg">
            WORK EXPERIENCE
          </h1>
          <hr className="border-black" />
          {profileData.experiences.map((exp, index) => (
            <div className="p-2" key={index}>
              <h1 className="text-base font-bold md:text-lg">
                {exp.company} - <span className="font-normal">{exp.role}</span>
              </h1>
              <h3 className="text-small text-gray-500">
                {exp.timePeriod?.startDate &&
                  new Date(exp.timePeriod.startDate).toLocaleDateString()}{" "}
                -{" "}
                {exp.timePeriod?.endDate
                  ? new Date(exp.timePeriod.endDate).toLocaleDateString()
                  : "Current"}
              </h3>
              <div
                className="ql-editor m-0 mb-2 p-0"
                dangerouslySetInnerHTML={createMarkup(exp.description ?? "")}
              />
            </div>
          ))}
        </>
      );
    }
    return null;
  };

  const renderEducation = () => {
    if (profileData.educations && profileData.educations.length > 0) {
      return (
        <>
          <h1 className="pl-1 text-base font-bold md:text-lg">EDUCATION</h1>
          <hr className="border-black" />
          {profileData.educations.map((ed, index) => (
            <div className="p-2" key={index}>
              <h1 className="text-base font-bold md:text-lg">
                {ed.school} - <span className="font-normal">{ed.degree}</span>
              </h1>
              <h3 className="text-small text-gray-500">
                {ed.timePeriod?.startDate &&
                  new Date(ed.timePeriod.startDate).toLocaleDateString()}{" "}
                -{" "}
                {ed.timePeriod?.endDate
                  ? new Date(ed.timePeriod.endDate).toLocaleDateString()
                  : "Current"}
              </h3>
            </div>
          ))}
        </>
      );
    }
    return null;
  };

  const renderSkills = () => {
    if (profileData.skills && profileData.skills.length > 0) {
      return (
        <>
          <h1 className="pl-1 text-base font-bold md:text-lg">SKILLS</h1>
          <hr className="border-black" />
          <div className="flex flex-wrap justify-evenly gap-4 p-2">
            {profileData.skills.split(",").map((skill, index) => (
              <div
                key={index}
                className="my-1 flex-initial rounded bg-gray-200 p-2 text-center shadow"
              >
                {skill.trim()}
              </div>
            ))}
          </div>
        </>
      );
    }
    return null;
  };

  const renderCustomSections = () => {
    if (profileData.sections && profileData.sections?.length > 0) {
      return profileData.sections.map((section, index) => (
        <div key={index} className="px-2 pb-3 md:pb-5">
          <h1 className="pl-1 text-base font-bold md:text-lg">
            {section.title}
          </h1>
          <hr className="border-black" />
          <div
            className="ql-editor m-0 mb-2 p-0"
            dangerouslySetInnerHTML={
              section.description
                ? createMarkup(section.description)
                : createMarkup("")
            }
          />
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-4xl bg-white py-3 shadow-lg">
      <section
        className={`relative mx-2 p-2 pt-3 md:mx-4 ${
          profileData.jobTitle?.trim().length === 0 ? "pb-10" : ""
        }`}
      >
        <h1 className="text-center text-lg font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
          {profileData.fullName}
        </h1>
        <h3 className="text-center text-base font-bold text-secondary sm:text-xl xl:text-3xl">
          {profileData.jobTitle}
        </h3>
        <div className="absolute right-0 top-2 flex flex-col text-sm text-blue-900 underline">
          {renderGitHubLink()}
          {renderLinkedInLink()}
          {renderWorknifyLink()}
        </div>
      </section>

      {renderContactInfo()}
      {renderBackground()}

      <main className="sticky top-0 bg-white px-3">
        {renderWorkExperience()}
        {renderEducation()}
        {renderSkills()}
        {renderCustomSections()}
      </main>
    </div>
  );
};

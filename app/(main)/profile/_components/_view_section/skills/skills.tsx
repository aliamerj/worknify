"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Slide } from "@/animation/Slide";
import { MdComputer } from "react-icons/md";

/**
 * Renders a list of skills with corresponding icons.
 * @param skills - A comma-separated string of skill names.
 * @returns The Skills component.
 */
const Skills = ({ skills }: { skills: string }) => {
  const mySkills = skills.split(",").map((skill) => {
    if (skill.includes(".")) {
      const [name, extension] = skill.split(".");
      return `${name}dot${extension}`;
    }
    return skill;
  });

  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  /**
   * Handles image loading errors for a skill.
   * @param skill - The skill name.
   */
  const handleImageError = (skill: string) => {
    setImageErrors((prev) => ({ ...prev, [skill]: true }));
  };

  return (
    <section className="mx-12 mt-32">
      <Slide delay={0.16}>
        <div className="mb-10">
          <h1 className="font-incognito mb-8 text-4xl font-bold leading-tight tracking-tighter text-gray-800 dark:text-white md:text-5xl">
            Skills
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-5 p-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
          {mySkills.map((skill) => {
            const iconURL = `https://simpleicons.org/icons/${skill.toLowerCase()}.svg`;

            return (
              <div
                key={skill}
                className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-5 shadow transition duration-300 ease-in-out hover:bg-gray-200 hover:shadow-lg"
              >
                {imageErrors[skill] ? (
                  <MdComputer className="mb-2 h-12 w-12" />
                ) : (
                  <Image
                    src={iconURL}
                    className="mb-2 h-12 w-12 object-contain"
                    alt={skill}
                    width={48}
                    height={48}
                    onError={() => handleImageError(skill)}
                  />
                )}
                <h2 className="text-sm font-medium text-gray-700">{skill}</h2>
              </div>
            );
          })}
        </div>
      </Slide>
    </section>
  );
};

export default Skills;
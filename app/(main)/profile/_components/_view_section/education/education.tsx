import { databaseDrizzle } from "@/db/database";
import { formatDate } from "@/utils/helper_function";
import { IoSchoolSharp } from "react-icons/io5";
export const Education = async ({ profileId }: { profileId: number }) => {
  const educations = await databaseDrizzle.query.education.findMany({
    where: (edu, o) => o.eq(edu.profileId, profileId),
  });
  return (
    <section className="mt-32 px-4 md:px-12">
      <h2 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-white">
        Education
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="mb-6 w-full rounded-lg bg-white p-5 shadow transition-shadow duration-300 ease-in-out hover:shadow-lg dark:bg-gray-800 md:w-1/3 lg:w-1/4 xl:w-1/5"
          >
            <div className="flex items-center">
              <IoSchoolSharp className="mr-4 text-4xl" />
              <div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {edu.school}
                </h3>
                <p className="text-md text-gray-600 dark:text-gray-400">
                  {edu.degree}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {formatDate(edu.startDate)} -{" "}
                  {edu.endDate ? formatDate(edu.endDate) : "Current"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

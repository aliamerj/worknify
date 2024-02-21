import { Slide } from "@/animation/Slide";
import { databaseDrizzle } from "@/db/database";
import { formatDate } from "@/utils/helper_function";
import DOMPurify from "isomorphic-dompurify";
import { MdWork } from "react-icons/md";

export const Experience = async ({ profileId }: { profileId: number }) => {
  const jobs = await databaseDrizzle.query.experience.findMany({
    where: (e, o) => o.eq(e.profileId, profileId),
  });
  if(!jobs || jobs.length === 0) return <div/>
  
  return (
    <section className="mx-12 mt-32">
      <Slide delay={0.16}>
        <div className="mb-16">
          <h1 className="font-incognito mb-8 text-4xl font-bold leading-tight tracking-tighter text-gray-800 dark:text-white md:text-5xl">
            Work Experience
          </h1>
        </div>
      </Slide>

      <Slide delay={0.18}>
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
          {jobs.map((data) => (
            <div
              key={data.id}
              className="relative flex max-w-2xl items-start gap-x-4 before:absolute before:bottom-0 before:left-9 before:top-[5rem] before:w-[1px] before:bg-secondary dark:before:bg-primary lg:gap-x-6"
            >
              <div className="dark:bg-primary-bg bg-secondary-bg relative grid min-h-[80px] min-w-[80px] place-items-center overflow-clip rounded-md border border-secondary p-2 dark:border-primary">
                <MdWork className="object-cover text-3xl duration-300" />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-bold">{data.company}</h3>
                <p>{data.role}</p>
                <time className="mt-2 text-sm uppercase tracking-widest text-zinc-500">
                  {formatDate(data.startDate)} -{" "}
                  {data.endDate ? (
                    formatDate(data.endDate)
                  ) : (
                    <span className="dark:text-primary-color text-tertiary-color">
                      Present
                    </span>
                  )}
                </time>
                {data.description && (
                  <div className="prose prose-lg mx-auto my-4 tracking-tight text-zinc-600 dark:text-zinc-400">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(data.description),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Slide>
    </section>
  );
};

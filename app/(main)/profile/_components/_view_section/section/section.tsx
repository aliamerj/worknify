import { SectionSelection } from "@/db/schemes/profileSchema";
import { FaPen } from "react-icons/fa";

const Sections = async ({ sections }: { sections: SectionSelection[] }) => {

  return (
    <section className="my-32 px-4 md:px-12">
      {sections.map((section) => (
        <div
          key={section.id}
          className="mb-10 rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center">
            <FaPen className="mr-3 text-4xl text-gray-800" />
            <h2 className="text-4xl font-bold text-gray-800">
              {section.title}
            </h2>
          </div>
          <div className="text-md border-t border-gray-200 pt-4 text-gray-700 dark:border-gray-700 dark:text-gray-300">
            <div
              dangerouslySetInnerHTML={{
                __html: section.description,
              }}
            ></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Sections;

"use client";
import { DevSelection, ProjectSelection } from "@/db/schemes/projectSchema";
import { Tab, Tabs } from "@nextui-org/react";
import DOMPurify from "dompurify";
import AboutProject from "../../about_project/about_project";

export const ProjectBody = ({
  project,
  devs,
}: {
  project: ProjectSelection;
  devs: DevSelection[];
}) => {
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  let tabs = [
    {
      id: "overview",
      label: "Overview",
      content: project.description,
    },
    {
      id: "about",
      label: "About",
      devs: devs,
      owner: project.owner,
    },
  ];
  return (
    <div className="flex w-full flex-col pt-5">
      <Tabs
        className="px-5"
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-8 w-full relative rounded-none p-0 border-b border-divider sm:pl-20 md:pl-32 lg:pl-40 font-bold",
          cursor: "w-full bg-[#164863]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#164863]",
        }}
        items={tabs}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.id === "overview" ? (
              <div className="mx-2 mt-6 rounded-lg bg-white p-6 shadow-sm md:mx-20">
                <div className="container mx-auto space-y-4">
                  <div
                    className="ql-editor m-0 mb-2 p-0"
                    dangerouslySetInnerHTML={createMarkup(item.content ?? "")}
                  />
                </div>
              </div>
            ) : (
              <AboutProject
                owner={project.owner}
                compilation={project.compilation}
                developersCount={devs.length}
                startDate={project.startDate}
                endDate={project.endDate}
                projectLink={project.link}
                projectType={project.type}
              />
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

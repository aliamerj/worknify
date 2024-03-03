"use client";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import _ from "lodash";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import {
  ProjectSchema,
  UpdateProjectSchema,
  projectSchema,
} from "@/utils/validations/projectValidation";
import axios from "axios";
import { LoaderFullPage } from "@/global-components/loader/loader";
import { useRouter } from "next/navigation";
import { AppRouter } from "@/utils/router/app_router";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { TechPicker } from "@/app/(main)/profile/_components/_create_section/input_Fields/tech_picker";
import { ProjectTypeSelection } from "./project_type_selection";
import { ProjectLogoSelection } from "./project_logo_selection";

const ProjectForm = ({ project }: { project?: ProjectSelection }) => {
  const initialData: UpdateProjectSchema = {
    id: project?.id ?? 0,
    name: project?.name,
    type: project?.type ?? "public",
    link: project?.link,
    description: project?.description,
    projectGoal: project?.projectGoal,
    techUsed: project?.techUsed,
    timePeriod: {
      startDate: project ? new Date(project?.startDate!).toISOString() : "",
      endDate: project ? new Date(project?.endDate!).toISOString() : "",
    },
  };
  const { control, handleSubmit } = useForm<ProjectSchema>({
    defaultValues: initialData,
    resolver: zodResolver(projectSchema),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const notify = (isError: boolean, message: string) => {
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  function findDifferences(newData: ProjectSchema, isLogo: boolean) {
    const differences: any = {};
    Object.keys(newData).forEach((key) => {
      const typedKey = key as keyof UpdateProjectSchema;
      if (!_.isEqual(initialData[typedKey], newData[typedKey])) {
        differences[typedKey] = newData[typedKey];
      }
      differences["id"] = project?.id!;

      if (isLogo && project?.logo) {
        const logoLink = project.logo.split("/") ?? "/";

        differences["logoKey"] = logoLink[logoLink.length - 1].split("%")[0];
      }
    });

    return differences;
  }

  const onSubmit: SubmitHandler<ProjectSchema> = async (data) => {
    var targetData = data;
    if (project) targetData = findDifferences(data, !!data.logo);
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.keys(targetData).forEach((key) => {
        if (
          Array.isArray(targetData[key as keyof ProjectSchema]) ||
          typeof targetData[key as keyof ProjectSchema] === "object"
        ) {
          formData.append(
            key,
            JSON.stringify(targetData[key as keyof ProjectSchema]),
          );
        } else {
          formData.append(key, targetData[key as keyof ProjectSchema]);
        }
      });
      if (targetData.logo && targetData.logo instanceof File)
        formData.append("logo", targetData.logo);

      if (!project) {
        const res = await axios.post("/api/project", formData);
        router.push(AppRouter.viewProject + res.data.projectId);
        router.refresh();
      } else {
        if (Object.keys(targetData).length > 1) {
          await axios.patch("/api/project", formData);
          router.push(AppRouter.viewProject + project.id!);
          router.refresh();
        } else {
          toast.warning("Looks like you haven't made any changes !");
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      notify(true, error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-4">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl space-y-6 rounded-2xl bg-white p-6 shadow-2xl md:p-8"
        >
          <div className="flex flex-wrap justify-between">
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ProjectTypeSelection
                  field={field}
                  errorMessage={error?.message}
                  currentType={project?.type}
                />
              )}
            />
          </div>

          <div className="flex flex-wrap items-start gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  size="lg"
                  maxLength={50}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  variant="underlined"
                  isRequired
                  type="text"
                  label="Project Name"
                  className="flex-1"
                  {...field}
                />
              )}
            />
            <div className="relative mt-5 w-full md:mt-0 md:w-36">
              <ProjectLogoSelection
                control={control}
                currentLogo={project?.logo}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="projectGoal"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  isRequired
                  variant="underlined"
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  type="text"
                  maxLength={100}
                  label="Problem Solving"
                  className="w-full"
                  {...field}
                />
              )}
            />
            <Controller
              name="link"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  isRequired
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  type="text"
                  variant="underlined"
                  label="Project Link"
                  className="w-full"
                  startContent={
                    <div className="pointer-events-none flex w-full items-center md:w-48">
                      <span className="text-sm text-default-400">
                        https://github.com/
                      </span>
                    </div>
                  }
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="techUsed"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TechPicker isProject field={{ ...field }} error={error} />
            )}
          />

          <div className="space-y-4">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  {error && (
                    <p className="text-xs italic text-red-500">
                      {error.message}
                    </p>
                  )}
                  <div className="h-full overflow-y-auto rounded-lg border border-gray-300 p-2">
                    <SimpleMDE
                      {...field}
                      className="h-full w-full"
                      placeholder="Describe the project with more details"
                    />
                  </div>
                </>
              )}
            />
          </div>
          <div className="flex justify-between gap-2">
            <Controller
              control={control}
              name="timePeriod.startDate"
              render={({ field, fieldState: { error } }) => (
                <div className="relative w-1/2 rounded-lg border border-gray-400 shadow-sm">
                  <DatePicker
                    showIcon
                    required
                    placeholderText="Start Date"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="timePeriod.endDate"
              render={({ field, fieldState: { error } }) => (
                <div className="relative w-1/2 rounded-lg border border-gray-400 shadow-sm">
                  <DatePicker
                    showIcon
                    required
                    placeholderText="End Date"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="flex w-full justify-center">
            {project ? (
              <Button
                variant="shadow"
                color="warning"
                type="submit"
                className="w-full rounded-lg px-4 py-3 font-bold text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              >
                Update
              </Button>
            ) : (
              <Button
                variant="shadow"
                color="primary"
                type="submit"
                className="w-full rounded-lg px-4 py-3 font-bold text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              >
                Save
              </Button>
            )}
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-10 backdrop-blur-md"></div>
          <LoaderFullPage />
        </div>
      )}
    </>
  );
};
export default ProjectForm;

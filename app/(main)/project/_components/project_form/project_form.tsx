"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import React, { Key, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import _ from "lodash";
import {
  Controller,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { RiImageAddFill } from "react-icons/ri";

import {
  ProjectSchema,
  UpdateProjectSchema,
  projectSchema,
} from "@/utils/validations/projectValidation";
import Image from "next/image";
import axios from "axios";
import { LoaderFullPage } from "@/global-components/loader/loader";
import { useRouter } from "next/navigation";
import { AppRouter } from "@/utils/router/app_router";
import { ProjectSelection } from "@/db/schemes/projectSchema";
import { TechPicker } from "@/app/(main)/profile/_components/_create_section/input_Fields/tech_picker";

const ProjectForm = ({
  project,
  userId,
}: {
  project?: ProjectSelection;
  userId: string;
}) => {
  const initialData: UpdateProjectSchema = {
    id: project?.id ?? 0,
    name: project?.name,
    type: project?.type ?? "public",
    link: project?.link,
    description: project?.description,
    compilation: project?.compilation,
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
  type Message = {
    isError?: boolean;
    iswarning?: boolean;
    message: string;
  };
  const router = useRouter();
  const [message, setMessage] = useState<Message>();
  const [image, setImage] = useState<string | null>(project?.logo ?? null);
  const [selectedType, setSelectedType] = useState<ProjectSelection["type"]>(
    project?.type ?? "public",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps,
  ) => {
    event.preventDefault();
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImage(URL.createObjectURL(file));
      field.onChange(file);
    } else {
      setMessage({ isError: false, message: "Invalid Image type" });
      setImage(null);
    }
  };

  const handleSelectType = (key: Key, field: ControllerRenderProps) => {
    field.onChange(key);
    if (key === "permission") setSelectedType(key);
    else if (key === "private") setSelectedType(key);
    else setSelectedType("public");
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
    console.log(data);
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
        router.push(AppRouter.myProject + userId);
        router.refresh();
      } else {
        if (Object.keys(targetData).length > 1) {
          await axios.patch("/api/project", formData);
          router.push(AppRouter.viewProject + project.id!);
          router.refresh();
        } else {
          setMessage({
            iswarning: true,
            message: "Looks like you haven't made any changes !",
          });
        }
      }
    } catch (error: any) {
      setMessage({ isError: true, message: error.message });
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-6xl rounded-2xl bg-white p-8 shadow-2xl"
        >
          {message && (
            <div
              role="alert"
              className={`mb-6 w-full rounded-lg p-5 text-base font-medium leading-6 text-white ${
                message.isError
                  ? "bg-red-500"
                  : message.iswarning
                    ? "bg-warning"
                    : "bg-green-500"
              }`}
            >
              {message.message}
            </div>
          )}
          <div className="pb-5">
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Tabs
                  variant="bordered"
                  defaultSelectedKey="public"
                  aria-label="Tabs variants"
                  selectedKey={selectedType}
                  onSelectionChange={(key) =>
                    handleSelectType(key, { ...field })
                  }
                  aria-errormessage={error?.message}
                >
                  <Tab key="public" title="Public" />
                  <Tab key="permission" title="Permission" />
                  <Tab key="private" title="Private" />
                </Tabs>
              )}
            />
          </div>

          <div className="flex">
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
                  className="w-full"
                  {...field}
                />
              )}
            />
            <div className="ml-10 mt-5 md:mt-0">
              <div className="relative">
                {image ? (
                  <div className="mb-4 h-28 w-28 overflow-hidden rounded-lg border-2 border-gray-300 shadow-md">
                    <Image
                      src={image}
                      layout="fill"
                      objectFit="cover"
                      alt="Project Logo"
                    />
                  </div>
                ) : (
                  <label className="mb-4 flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition duration-300 hover:border-blue-500 hover:bg-blue-50">
                    <RiImageAddFill className="text-4xl text-gray-400 hover:text-blue-500" />
                  </label>
                )}

                <Controller
                  name="logo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      {error && (
                        <p className="text-center text-xs italic text-red-500">
                          {error.message}
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, { ...field })}
                        className="absolute inset-0 h-full w-full opacity-0 hover:cursor-pointer"
                      />
                    </>
                  )}
                />
              </div>

              <h5 className="text-center font-semibold text-gray-700">
                Project Logo
              </h5>
            </div>{" "}
          </div>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  className="mb-5 max-w-full"
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
                  className="max-w-full"
                  startContent={
                    <div className="pointer-events-none flex w-48 items-center">
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

          <div className="mb-6 mt-10">
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
                  <div className="h-72 max-h-64 w-full overflow-y-auto">
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
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <Controller
                control={control}
                name="timePeriod.startDate"
                render={({ field, fieldState: { error } }) => (
                  <>
                    {error && (
                      <p className="mb-1 text-xs italic text-red-500">
                        {error.message}
                      </p>
                    )}
                    <div className="relative rounded-lg border border-gray-400 shadow-sm">
                      <DatePicker
                        showIcon
                        required
                        placeholderText="Start Date"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Controller
                control={control}
                name="timePeriod.endDate"
                render={({ field, fieldState: { error } }) => (
                  <>
                    {error && (
                      <p className="mb-1 text-xs italic text-red-500">
                        {error.message}
                      </p>
                    )}
                    <div className="relative rounded-lg border border-gray-400 shadow-sm">
                      <DatePicker
                        showIcon
                        placeholderText="End Date"
                        selected={field.value ? new Date(field.value) : null}
                        required
                        onChange={(date) => field.onChange(date?.toISOString())}
                        className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          {project ? (
            <Button
              variant="shadow"
              color="warning"
              type="submit"
              className="w-full rounded-lg px-4 py-3 font-bold text-white transition duration-300  focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              Update
            </Button>
          ) : (
            <Button
              variant="shadow"
              color="primary"
              type="submit"
              className="w-full rounded-lg px-4 py-3 font-bold text-white transition duration-300  focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              Save
            </Button>
          )}
        </form>
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-10 backdrop-grayscale backdrop-filter"></div>
          <LoaderFullPage />
        </div>
      )}
    </>
  );
};
export default ProjectForm;

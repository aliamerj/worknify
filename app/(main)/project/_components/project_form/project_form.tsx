"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useProjectData } from "../context/project_context";
import {
  ProjectSchema,
  projectSchema,
} from "@/utils/validations/projectValidation";
import ReactQuill from "react-quill";

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};
export const ProjectForm = () => {
  const router = useRouter();
  const { projectData, setIsLoading, updateProjectData } = useProjectData();
  const { control, handleSubmit, watch } = useForm<ProjectSchema>({
    defaultValues: projectData,
    resolver: zodResolver(projectSchema),
  });
  type Message = {
    isError: boolean;
    message: string;
  };

  const [message, setMessage] = useState<Message>();

  const onSubmit: SubmitHandler<ProjectSchema> = async (data) => {
    try {
      setIsLoading(true);
      if (!projectData.edit) {
        // await axios.post("/api/profile", data);
        router.push("/");
        router.refresh();
      } else {
        //  const differences = findDifferences();
        //    if (Object.keys(differences).length !== 0) {
        //     const res = await axios.patch("/api/profile", {
        //      ...differences,
        //      profileId,
        //    });
        //    if (res.status === 200) {
        //     setMessage({ isError: false, message: res.data.message });
        //   }
        //   }
      }
      setIsLoading(false);
      return;
    } catch (error: any) {
      setIsLoading(false);
      setMessage({ isError: true, message: error.message });
    }
  };

  useEffect(() => {
    const subscription = watch((value, _) => {
      updateProjectData(value as Partial<ProjectSchema>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProjectData]);

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-2 w-full rounded-xl bg-white p-5 drop-shadow-xl lg:max-w-lg"
      >
        {message && (
          <div
            role="alert"
            className={`font-regular relative mb-4 block w-full rounded-lg ${
              message.isError ? "bg-red-500" : "bg-green-500"
            } p-4 text-base leading-5 text-white opacity-100`}
          >
            {message.message}
          </div>
        )}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              maxLength={30}
              isInvalid={!!error}
              errorMessage={error?.message}
              isRequired
              type="text"
              label="Project Name"
              className="mb-5 max-w-full"
              {...field}
            />
          )}
        />

        <div className="mb-6 flex flex-wrap gap-4">
          <Controller
            name="projectGoal"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="Problem solving"
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
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                label="GitHub"
                className="max-w-full"
                startContent={
                  <div className="pointer-events-none flex items-center">
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

        <div className="mb-6 flex flex-wrap gap-4">
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                {error && <p className="text-red-500">{error.message}</p>}
                <ReactQuill theme="snow" modules={modules} {...field} />
              </>
            )}
          />

          <Controller
            name="logo"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isInvalid={!!error}
                errorMessage={error?.message}
                isRequired
                type="email"
                label="Email"
                className="mb-5 max-w-full"
                {...field}
              />
            )}
          />
        </div>
        <button type="submit" style={{ display: "none" }} />
      </form>
    </div>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import { Controller, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";
import { MessageRes } from "../../hooks/useMessage";
import { TaskSelection } from "@/db/schemes/taskSchema";
import {
  EditTaskShema,
  TaskSchema,
  taskSchema,
} from "@/utils/validations/taskValidation";
import { DevInfo } from "../../[projectId]/page";

export const AddTaskModal = ({
  isOpen,
  onOpenChange,
  currentNewTask,
  featureId,
  pushNewTask,
  setMessageRes,
  taskToEdit,
  updateFeature,
  devInfo,
}: {
  isOpen: boolean;
  featureId: number;
  onOpenChange: () => void;
  currentNewTask: TaskSelection[];
  pushNewTask: (task: TaskSelection) => void;
  setMessageRes: (res: MessageRes) => void;
  taskToEdit: TaskSchema | null;
  updateFeature: (feature: TaskSelection) => void;
  devInfo: DevInfo[];
}) => {
  const getHighestOrder = () =>
    currentNewTask.reduce((max, feature) => Math.max(max, feature.order), 0);

  const { control, handleSubmit, reset } = useForm<TaskSchema>({
    defaultValues: { status: "New" },
    resolver: zodResolver(taskSchema),
  });
  useEffect(() => {
    let formDefaultValues = taskToEdit ?? {
      order: getHighestOrder() + 1,
      featureId: featureId,
      featureName: "",
      description: "",
      startDate: "",
      endDate: "",
    };
    reset(formDefaultValues);
  }, [isOpen, taskToEdit, reset]);
  const [isLoading, setIsLoading] = useState(false);

  type TypeSubmit = {
    data: TaskSchema;
    onClose: () => void;
  };
  function findDifferences(newData: TaskSchema, initalValues: TaskSchema) {
    const differences: any = {};
    Object.keys(newData).forEach((key) => {
      const typedKey = key as keyof EditTaskShema;
      if (!_.isEqual(initalValues[typedKey], newData[typedKey])) {
        differences[typedKey] = newData[typedKey];
      }
      differences["id"] = initalValues.id!;
      differences["featureId"] = initalValues.featureId!;
    });
    return differences;
  }

  const onSubmit: SubmitHandler<TypeSubmit> = async ({ data, onClose }) => {
    try {
      let res;
      setIsLoading(true);
      if (taskToEdit) {
        const diff = findDifferences(data, taskToEdit);
        res = await axios.patch(ApiRouter.features, diff);
        console.log(res.data.data);
        updateFeature({ ...res.data.data });
      } else {
        res = await axios.post(ApiRouter.features, data);
        const newTask: TaskSelection = {
          id: res.data.featureId,
          AssignedTo: data.AssignedTo,
          featureId: data.featureId,
          order: data.order,
          name: data.name,
          description: data.description ?? "",
          status: "New",
          startDate: data.timePeriod.startDate ?? null,
          endDate: data.timePeriod.endDate ?? null,
        };
        pushNewTask(newTask);
      }
      setMessageRes({ isError: false, message: res.data.message });
      onClose();
    } catch (error: any) {
      setMessageRes({
        isError: true,
        message: error.response.data.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        className="bg-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        placement="top-center"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form
                onSubmit={handleSubmit((data) => onSubmit({ data, onClose }))}
                className="space-y-6"
              >
                <ModalHeader className="flex flex-col gap-1">
                  New Task
                </ModalHeader>
                <ModalBody>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        size="sm"
                        maxLength={30}
                        minLength={1}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        variant="bordered"
                        isRequired
                        type="text"
                        label="Feature Name"
                        className="w-full"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Textarea
                        variant="bordered"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        type="text"
                        maxLength={500}
                        label="Enter your description"
                        className="mb-5 w-full"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="AssignedTo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        defaultItems={devInfo}
                        variant="bordered"
                        label="Assigned to"
                        placeholder="Select a dev"
                        labelPlacement="inside"
                        className="w-full"
                        size="sm"
                      >
                        {(devInfo) => (
                          <AutocompleteItem
                            key={devInfo.id}
                            textValue={devInfo.name}
                            color="primary"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar
                                alt={devInfo.name}
                                className="flex-shrink-0"
                                size="sm"
                                src={devInfo.image}
                              />
                              <div className="flex flex-col">
                                <span className="text-small">
                                  {devInfo.name}
                                </span>
                                <span className="text-tiny">
                                  {devInfo.email}
                                </span>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />

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
                                placeholderText="Start Date"
                                selected={
                                  field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                  field.onChange(date?.toISOString())
                                }
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
                                selected={
                                  field.value ? new Date(field.value) : null
                                }
                                onChange={(date) =>
                                  field.onChange(date?.toISOString())
                                }
                                className="block w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 text-base hover:cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color={taskToEdit ? "warning" : "primary"}
                    type="submit"
                    isLoading={isLoading}
                  >
                    {taskToEdit ? "Update" : "Save"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

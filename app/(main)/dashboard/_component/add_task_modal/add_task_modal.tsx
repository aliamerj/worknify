import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect } from "react";
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
import { TaskSelection } from "@/db/schemes/taskSchema";
import {
  EditTaskShema,
  TaskSchema,
  taskSchema,
} from "@/utils/validations/taskValidation";
import { useApiCallContext } from "@/utils/context/api_call_context";
import {
  useContributorsInfo,
  useCurrentProject,
  usePushTask,
  useTasksInfo,
  useTasksToUpdate,
  useUpdateTask,
} from "../../context/hooks";

export const AddTaskModal = ({
  isOpen,
  onOpenChange,
  featureId,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  featureId: number;
}) => {
  const { setMessageRes, setIsLoading, isLoading } = useApiCallContext();
  const { isDev, isOwner } = useCurrentProject();
  const tasks = useTasksInfo();
  const selectedTaskToUpdate = useTasksToUpdate();
  const updateTask = useUpdateTask();
  const pushTask = usePushTask();
  const contributors = useContributorsInfo();
  const getHighestOrder = () =>
    Object.values(tasks)
      .flat()
      .reduce(
        (max, task) =>
          task.featureId === featureId ? Math.max(max, task.order) : max,
        0,
      );
  const { control, handleSubmit, reset } = useForm<TaskSchema>({
    defaultValues: {
      status: "New",
      assignedTo: null,
      featureId: featureId,
    },
    resolver: zodResolver(taskSchema),
  });
  useEffect(() => {
    let formDefaultValues: TaskSchema = selectedTaskToUpdate ?? {
      order: getHighestOrder() + 1,
      featureId: featureId,
      name: "",
      description: "",
      timePeriod: null,
      status: "New",
      assignedTo: null,
    };
    reset(formDefaultValues);
  }, [isOpen, selectedTaskToUpdate, reset]);

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
      if (selectedTaskToUpdate) {
        const diff = findDifferences(data, selectedTaskToUpdate);
        res = await axios.patch(ApiRouter.tasks, diff);
        updateTask({ ...res.data.data });
      } else {
        res = await axios.post(ApiRouter.tasks, data);
        const newTask: TaskSelection = {
          creatorId: isOwner ?? isDev ?? "",
          id: res.data.taskId,
          assignedTo: data.assignedTo,
          featureId: data.featureId,
          order: data.order,
          name: data.name,
          description: data.description ?? "",
          status: "New",
          startDate: data.timePeriod?.startDate ?? null,
          endDate: data.timePeriod?.endDate ?? null,
        };
        pushTask(newTask);
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
                    name="assignedTo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        {error && (
                          <p className="mb-1 text-xs italic text-red-500">
                            {error.message}
                          </p>
                        )}
                        <Autocomplete
                          defaultItems={contributors}
                          variant="bordered"
                          label="Assigned to"
                          placeholder="Select a dev"
                          labelPlacement="inside"
                          className="w-full"
                          size="sm"
                          selectedKey={field.value ?? ""}
                          onSelectionChange={(e) => field.onChange(e)}
                        >
                          {(devInfo) => (
                            <AutocompleteItem
                              key={devInfo.id}
                              textValue={devInfo.name ?? undefined}
                              color="primary"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar
                                  alt={devInfo.name ?? "contributor"}
                                  className="flex-shrink-0"
                                  size="sm"
                                  src={devInfo.image ?? undefined}
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
                      </>
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
                    color={selectedTaskToUpdate ? "warning" : "primary"}
                    type="submit"
                    isLoading={isLoading}
                  >
                    {selectedTaskToUpdate ? "Update" : "Save"}
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

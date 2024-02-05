import {
  FeaureSchema,
  featureSchema,
} from "@/utils/validations/featureValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  Textarea,
} from "@nextui-org/react";
import {
  Controller,
  ControllerRenderProps,
  SubmitHandler,
} from "react-hook-form";

export const AddFeatureModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { control, handleSubmit } = useForm<FeaureSchema>({
    resolver: zodResolver(featureSchema),
  });
  const [tags, setTags] = useState<string[]>([]);
  const onSettingTags = (myTags: string[], field: ControllerRenderProps) => {
    setTags(myTags);
    field.onChange(tags);
  };

  const onSubmit: SubmitHandler<FeaureSchema> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <Modal
        className="bg-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ModalHeader className="flex flex-col gap-1">
                  Add new Feature to your app
                </ModalHeader>
                <ModalBody>
                  <Controller
                    name="featureName"
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
                        isRequired
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
                    name="tag"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="w-full">
                        <TagsInput
                          tags={tags}
                          onSettingTags={(mytags) =>
                            onSettingTags(mytags, { ...field })
                          }
                        />
                        {error && (
                          <p className="mt-2 text-xs text-red-500">
                            {error?.message}
                          </p>
                        )}
                      </div>
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
                                required
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
                                required
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
                  <Button color="primary" type="submit">
                    Save
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

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TagsInput } from "../tag_input/tag_input";

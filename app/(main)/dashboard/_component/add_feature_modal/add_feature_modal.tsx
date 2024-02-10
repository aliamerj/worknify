import {
  EditFeatureShema,
  FeatureSchema,
  featureSchema,
} from "@/utils/validations/featureValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TagsInput } from "../tag_input/tag_input";
import { FeatureSelection } from "@/db/schemes/featureSchema";
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
} from "@nextui-org/react";
import {
  Controller,
  ControllerRenderProps,
  SubmitHandler,
} from "react-hook-form";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";
import { MessageRes } from "../left_slider/side_bar";

export const AddFeatureModal = ({
  isOpen,
  onOpenChange,
  currentFeatures,
  projectId,
  pushNewFeature,
  setMessageRes,
  featureToEdit,
  updateFeature,
}: {
  isOpen: boolean;
  projectId: number;
  onOpenChange: () => void;
  currentFeatures: FeatureSelection[];
  pushNewFeature: (feature: FeatureSelection) => void;
  setMessageRes: (res: MessageRes) => void;
  featureToEdit: FeatureSchema | null;
  updateFeature: (feature: FeatureSelection) => void;
}) => {
  const getHighestOrder = () =>
    currentFeatures.reduce((max, feature) => Math.max(max, feature.order), 0);
  const [tags, setTags] = useState<string[]>([]);

  const { control, handleSubmit, reset } = useForm<FeatureSchema>({
    resolver: zodResolver(featureSchema),
  });
  useEffect(() => {
    let formDefaultValues = featureToEdit
      ? { ...featureToEdit, tag: featureToEdit.tag ?? [] }
      : {
          order: getHighestOrder() + 1,
          projectId: projectId,
          featureName: "",
          description: "",
          startDate: "",
          endDate: "",
          tags: [],
        };
    featureToEdit ? setTags(featureToEdit.tag ?? []) : setTags([]);
    reset(formDefaultValues);
  }, [isOpen, featureToEdit, reset]);
  const [isLoading, setIsLoading] = useState(false);

  const onSettingTags = (myTags: string[], field: ControllerRenderProps) => {
    setTags(myTags);
    field.onChange(myTags);
  };
  type TypeSubmit = {
    data: FeatureSchema;
    onClose: () => void;
  };
  function findDifferences(
    newData: FeatureSchema,
    initalValues: FeatureSchema,
  ) {
    const differences: any = {};
    Object.keys(newData).forEach((key) => {
      const typedKey = key as keyof EditFeatureShema;
      if (!_.isEqual(initalValues[typedKey], newData[typedKey])) {
        differences[typedKey] = newData[typedKey];
      }
      differences["id"] = initalValues.id!;
      differences["projectId"] = initalValues.projectId!;
    });
    return differences;
  }

  const onSubmit: SubmitHandler<TypeSubmit> = async ({ data, onClose }) => {
    try {
      let res;
      setIsLoading(true);
      if (featureToEdit) {
        const diff = findDifferences(data, featureToEdit);
        res = await axios.patch(ApiRouter.features, diff);
        console.log(res.data.data);
        updateFeature({ ...res.data.data });
      } else {
        res = await axios.post(ApiRouter.features, data);
        const newFeature: FeatureSelection = {
          id: res.data.featureId,
          projectId: data.projectId,
          order: data.order,
          featureName: data.featureName,
          description: data.description ?? "",
          tags: data.tag?.join(";") ?? "",
          startDate: data.timePeriod.startDate ?? null,
          endDate: data.timePeriod.endDate ?? null,
        };
        pushNewFeature(newFeature);
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
        backdrop="blur"
        placement="top-center"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form
                onSubmit={handleSubmit((data) => onSubmit({ data, onClose }))}
                className="space-y-6"
              >
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
                          error={error}
                          onSettingTags={(mytags) =>
                            onSettingTags(mytags, { ...field })
                          }
                        />
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
                    color={featureToEdit ? "warning" : "primary"}
                    type="submit"
                    isLoading={isLoading}
                  >
                    {featureToEdit ? "Update" : "Save"}
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

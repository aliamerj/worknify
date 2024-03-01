import React, { useCallback } from "react";
import { useFieldArray } from "react-hook-form";
import ExperienceField from "../experience_field";
import { Button } from "@nextui-org/react";

export const Experiences = ({ control }: { control: any }) => {
  const {
    fields: experiences,
    append: appendExperiences,
    remove: removeExperiences,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const handleRemoveExperience = useCallback(
    (index: number) => () => {
      removeExperiences(index);
    },
    [removeExperiences],
  );

  const handleAddExperience = useCallback(() => {
    appendExperiences({
      role: "",
      company: "",
      timePeriod: {
        startDate: new Date().toISOString(),
        endDate: null,
      },
    });
  }, [appendExperiences]);

  return (
    <>
      {experiences.map((field, index) => (
        <React.Fragment key={field.id}>
          <ExperienceField control={control} index={index}>
            <button
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm text-gray-700 shadow-sm hover:bg-danger hover:text-white"
              onClick={handleRemoveExperience(index)}
            >
              X
            </button>
          </ExperienceField>
        </React.Fragment>
      ))}
      <Button
        color="primary"
        variant="shadow"
        type="button"
        size="md"
        onClick={handleAddExperience}
      >
        Add Experience
      </Button>
    </>
  );
};

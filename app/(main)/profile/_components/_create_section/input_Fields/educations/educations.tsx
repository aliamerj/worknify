import { useFieldArray } from "react-hook-form";
import { EducationField } from "../education_field";
import { Button } from "@nextui-org/react";
import { Fragment, useCallback } from "react";

export const Educations = ({ control }: { control: any }) => {
  const {
    fields: educations,
    append: appendEducations,
    remove: removeEducations,
  } = useFieldArray({
    control,
    name: "educations",
  });

  const handleRemoveEducation = useCallback(
    (index: number) => () => {
      removeEducations(index);
    },
    [removeEducations],
  );

  const handleAddEducation = useCallback(() => {
    appendEducations({
      degree: "",
      school: "",
      timePeriod: {
        startDate: new Date().toISOString(),
        endDate: null,
      },
    });
  }, [appendEducations]);

  return educations.map((field, index) => (
    <Fragment key={field.id}>
      <EducationField control={control} index={index}>
        <button
          className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm text-gray-700 shadow-sm hover:bg-danger hover:text-white"
          onClick={handleRemoveEducation(index)}
        >
          X
        </button>
      </EducationField>
      {index === educations.length - 1 && (
        <Button
          color="success"
          variant="shadow"
          type="button"
          size="md"
          onClick={handleAddEducation}
        >
          Add Education
        </Button>
      )}
    </Fragment>
  ));
};

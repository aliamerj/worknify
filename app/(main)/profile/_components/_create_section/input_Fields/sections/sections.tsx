import { useFieldArray } from "react-hook-form";
import { SectionField } from "../section_field";
import { Button } from "@nextui-org/react";
import { Fragment, useCallback } from "react";

export const Sections = ({ control }: { control: any }) => {
  const {
    fields: sections,
    append: appendSections,
    remove: removeSections,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const handleRemoveSection = useCallback(
    (index: number) => () => {
      removeSections(index);
    },
    [removeSections],
  );

  const handleAddSection = useCallback(() => {
    appendSections({
      title: "",
      description: "",
    });
  }, [appendSections]);

  return (
    <>
      {sections.map((field, index) => (
        <Fragment key={field.id}>
          <SectionField control={control} index={index}>
            <button
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm text-gray-700 shadow-sm hover:bg-danger hover:text-white"
              onClick={handleRemoveSection(index)}
            >
              X
            </button>
          </SectionField>
        </Fragment>
      ))}
      <Button
        color="secondary"
        variant="shadow"
        type="button"
        size="md"
        onClick={handleAddSection}
      >
        Add New Section
      </Button>
    </>
  );
};

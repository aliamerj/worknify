import { EducationField } from "@/app/(main)/components/input_Fields/education/educationField";
import ExperienceField from "@/app/(main)/components/input_Fields/experience/experienceField";
import { SectionField } from "@/app/(main)/components/input_Fields/section/sectionField";
import TagPicker from "@/app/(main)/components/input_Fields/tag_picker/TagPicker";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import { Button, Input, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Control, Controller, useFieldArray } from "react-hook-form";

type SecondStepProps = {
  diff: number;
  control: Control<ProfileSchema>;
};
export const SecondStep = ({ diff, control }: SecondStepProps) => {
  const {
    fields: experiences,
    append: appendExperiences,
    remove: removeExperiences,
  } = useFieldArray({
    control,
    name: "experiences",
  });
  const {
    fields: educations,
    append: appendEducations,
    remove: removeEducations,
  } = useFieldArray({
    control,
    name: "educations",
  });
  const {
    fields: sections,
    append: appendSections,
    remove: removeSections,
  } = useFieldArray({
    control,
    name: "sections",
  });

  return (
    <motion.div
      initial={{ x: diff >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Resume
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Complete Your Resume to proceed
      </p>

      <section className="mt-10 flex flex-col items-center gap-5">
        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="background"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                isInvalid={!!error}
                errorMessage={error?.message}
                maxLength={300}
                fullWidth
                label="Background"
                {...field}
              />
            )}
          />{" "}
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="github"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                value={field.value || ""}
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
              />
            )}
          />
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="linkedin"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                value={field.value || ""}
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                label="Linkedin"
                className="max-w-full"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">
                      https://linkedin.com/in/
                    </span>
                  </div>
                }
              />
            )}
          />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="skills"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TagPicker field={{ ...field }} error={error} />
            )}
          />{" "}
        </div>
        <div className="mx-auto w-full max-w-2xl">
          {experiences.map((field, index) => (
            <ExperienceField
              key={field.id}
              control={control}
              remove={removeExperiences}
              index={index}
            />
          ))}
          <Button
            color="primary"
            variant="shadow"
            type="button"
            onClick={() =>
              appendExperiences({
                role: "",
                company: "",
                timePeriod: {
                  startDate: new Date(),
                },
              })
            }
          >
            Add Experience
          </Button>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          {educations.map((field, index) => (
            <EducationField
              key={field.id}
              control={control}
              remove={removeEducations}
              index={index}
            />
          ))}
          <Button
            color="success"
            variant="shadow"
            type="button"
            onClick={() =>
              appendEducations({
                degree: "",
                university: "",
                timePeriod: {
                  startDate: new Date(),
                },
              })
            }
          >
            Add Education
          </Button>
        </div>
        <div className="mx-auto w-full max-w-2xl">
          {sections.map((field, index) => (
            <SectionField
              key={field.id}
              control={control}
              remove={removeSections}
              index={index}
            />
          ))}
          <Button
            color="secondary"
            variant="shadow"
            type="button"
            onClick={() =>
              appendSections({
                title: "",
                description: "",
              })
            }
          >
            Add New Section
          </Button>
        </div>
      </section>
    </motion.div>
  );
};

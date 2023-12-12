"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { Stepper } from "./stepper";
import { useProfile } from "../profile_context";
import {
  ProfileSchema,
  profileSchemaValidation,
} from "@/utils/validations/profileValidation";
import { Button, Textarea } from "@nextui-org/react";
import { FirstStep } from "./steps/first_step";
import ExperienceField from "../../components/input_Field/experience/experienceField";
import TagPicker from "../../components/input_Field/tag_picker/TagPicker";

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["jobTitle", "fullName", "address", "email", "phoneNumber"],
  },
  {
    id: "Step 2",
    name: "Resume",
    fields: [
      "background",
      "skills",
      "experiences",
      "github",
      "linkedin",
      "sections",
      "educations",
    ],
  },
  {
    id: "Step 3",
    name: "CV Review",
  },
];

export function ProfileForm() {
  const { profileData } = useProfile();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const diff = currentStep - previousStep;

  const { handleSubmit, control, reset, trigger } = useForm({
    defaultValues: profileData,
    resolver: zodResolver(profileSchemaValidation),
  });

  const processForm: SubmitHandler<any> = (data) => {
    console.log(data);
    reset();
  };

  const next = async () => {
    const fields = steps[currentStep].fields;
    const fieldNames = fields as Array<keyof ProfileSchema>;

    const output = await trigger(fieldNames, {
      shouldFocus: true,
    });
    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const {
    fields: experiences,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <section className="absolute inset-0 flex flex-col justify-between p-20">
      <Stepper currentStep={currentStep} steps={steps} />
      {/* Form */}
      <form className="mt-10 py-5" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && <FirstStep control={control} diff={diff} />}
        {currentStep === 1 && (
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

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
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

              <div className="sm:col-span-2">
                <Controller
                  name="skills"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TagPicker {...error} {...field} />
                  )}
                />{" "}
              </div>
              <div className="sm:col-span-2">
                {experiences.map((field, index) => (
                  <ExperienceField
                    key={field.id}
                    control={control}
                    remove={remove}
                    index={index}
                  />
                ))}
                <Button
                  color="primary"
                  variant="shadow"
                  type="button"
                  onClick={() =>
                    append({
                      role: "",
                      company: "",
                      timePeriod: {
                        startDate: new Date(),
                        endDate: new Date(),
                      },
                    })
                  }
                >
                  Add Experience
                </Button>
              </div>

              <div className="sm:col-span-2"></div>

              <div className="sm:col-span-2"></div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Complete
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Thank you for your submission.
            </p>
          </>
        )}
      </form>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

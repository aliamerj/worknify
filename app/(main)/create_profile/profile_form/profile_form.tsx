"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Stepper } from "./stepper";
import { useProfile } from "../profile_context";
import {
  ProfileSchema,
  profileSchemaValidation,
} from "@/utils/validations/profileValidation";
import { Button } from "@nextui-org/react";
import { FirstStep } from "./steps/first_step";
import { SecondStep } from "./steps/second_step";

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
      "github",
      "linkedin",
      "skills",
      "experiences",
      "educations",
      "sections",
    ],
  },
  {
    id: "Step 3",
    name: "CV Review",
    fields: ["submit"],
  },
];

export function ProfileForm() {
  const { profileData } = useProfile();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const diff = currentStep - previousStep;

  const { control, trigger } = useForm({
    defaultValues: profileData,
    resolver: zodResolver(profileSchemaValidation),
  });

  const next = async () => {
    const fields = steps[currentStep].fields;
    const fieldNames = fields as Array<keyof ProfileSchema>;

    const output = await trigger(fieldNames, {
      shouldFocus: true,
    });
    console.log(output);
    if (!output) return;

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <section className="absolute inset-0 flex flex-col justify-center p-20">
      <Stepper currentStep={currentStep} steps={steps} />
      {/* Form */}
      <form className="mt-10 py-5" onSubmit={(e) => console.log(e.target)}>
        {currentStep === 0 && <FirstStep control={control} diff={diff} />}
        {currentStep === 1 && <SecondStep control={control} diff={diff} />}

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
          <Button
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
          </Button>
          <Button
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
          </Button>
        </div>
      </div>
    </section>
  );
}

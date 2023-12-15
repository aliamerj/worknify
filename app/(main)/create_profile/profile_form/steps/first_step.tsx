import { ProfileSchema } from "@/utils/validations/profileValidation";
import { Input } from "@nextui-org/react";
import { motion } from "framer-motion";

import { Control, Controller } from "react-hook-form";

type FirstStepProps = {
  diff: number;
  control: Control<ProfileSchema>;
};

export const FirstStep = ({ diff, control }: FirstStepProps) => {
  return (
    <motion.div
      initial={{ x: diff >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Personal Information
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Provide your personal details.
      </p>
      <section className="mt-10 flex flex-col items-center">
        <div className="mx-auto w-full max-w-2xl">
          {" "}
          <Controller
            name="jobTitle"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="Current Position"
                placeholder="Senior Web Engineer"
                className="mb-3 max-w-lg text-gray-500"
                {...field}
              />
            )}
          />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="fullName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="Full Name"
                placeholder="Elliot Alderson"
                className="mb-3 max-w-lg text-gray-500"
                {...field}
              />
            )}
          />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="Email"
                placeholder="example@gmail.com"
                className="mb-3 max-w-lg text-gray-500"
                {...field}
              />
            )}
          />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="Phone Number"
                placeholder="+1234xxxxx"
                className="mb-3 max-w-lg text-gray-500"
                {...field}
              />
            )}
          />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                isRequired
                isInvalid={!!error}
                errorMessage={error?.message}
                type="text"
                maxLength={30}
                label="City, Country"
                placeholder="Elm Street, Springfield, USA"
                className="mb-3 max-w-lg text-gray-500"
                {...field}
              />
            )}
          />
        </div>
      </section>
    </motion.div>
  );
};

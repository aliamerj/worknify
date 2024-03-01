import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control, Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import { CustomCheckbox } from "./customs/custom_checkbox";

interface IEducationField {
  control: Control<ProfileSchema>;
  index: number;
  children: React.ReactNode;
}

export const EducationField = ({
  control,
  children,
  index,
}: IEducationField) => {
  return (
    <div key={index} className="relative mb-5 rounded-xl border bg-white  p-4">
      {children}
      <div className="flex flex-col gap-2">
        <Controller
          name={`educations.${index}.school`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              isRequired
              isInvalid={!!error}
              errorMessage={error?.message}
              type="text"
              maxLength={50}
              label="School"
              placeholder="Stanford University"
              className="mb-3 max-w-full text-gray-500"
              {...field}
            />
          )}
        />

        <Controller
          name={`educations.${index}.degree`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              isRequired
              isInvalid={!!error}
              errorMessage={error?.message}
              type="text"
              placeholder="Computer Science"
              className="mb-3 max-w-full text-gray-500"
              fullWidth
              label="Degree"
              maxLength={50}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={`educations.${index}.timePeriod.startDate`}
          render={({ field, fieldState: { error } }) => (
            <>
              {error && <p className="text-red-500">{error.message}</p>}
              <DatePicker
                showIcon
                placeholderText="Start Date"
                maxDate={new Date()}
                onChange={(date) => field.onChange(date?.toISOString())}
                selected={new Date(field.value)}
                calendarClassName="calendar"
                className="z-30  w-full rounded-lg border bg-divider p-2 outline-none"
              />
            </>
          )}
        />
        <Controller
          control={control}
          name={`educations.${index}.timePeriod.endDate`}
          render={({ field, fieldState: { error } }) => (
            <>
              {error && <p className="text-red-500">{error.message}</p>}
              <div className="flex justify-between gap-2">
                <CustomCheckbox field={field} />
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

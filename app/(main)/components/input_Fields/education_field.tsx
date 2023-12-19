import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Checkbox, Input } from "@nextui-org/react";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import { useState } from "react";

interface IEducationField {
  control: Control<ProfileSchema>;
  remove: UseFieldArrayRemove;
  index: number;
}

export const EducationField = ({ control, remove, index }: IEducationField) => {
  const [isCurrent, setIsCurrent] = useState(false);
  return (
    <div key={index} className="relative mb-5 rounded-xl border bg-white  p-4">
      <button
        className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm text-gray-700 shadow-sm hover:bg-danger hover:text-white"
        onClick={() => remove(index)}
      >
        X
      </button>
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
                onChange={(date) => field.onChange(date?.toString())}
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
                <DatePicker
                  disabled={isCurrent}
                  showIcon
                  placeholderText="End Date"
                  maxDate={new Date()}
                  onChange={(date) => field.onChange(date?.toString())}
                  selected={field.value ? new Date(field.value) : null}
                  className="z-30 w-full rounded-lg border bg-divider p-2 outline-none disabled:bg-gray-300 disabled:line-through"
                />
                <Checkbox
                  radius="sm"
                  onValueChange={(is) => {
                    setIsCurrent(is);
                    field.onChange(null);
                  }}
                >
                  Present
                </Checkbox>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

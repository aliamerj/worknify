import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Checkbox, Input } from "@nextui-org/react";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import { useState } from "react";
import ReactQuill from "react-quill";

interface IExperienceField {
  control: Control<ProfileSchema>;
  remove: UseFieldArrayRemove;
  index: number;
}
const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};
const ExperienceField = ({ control, remove, index }: IExperienceField) => {
  const [isCurrent, setIsCurrent] = useState(false);
  return (
    <div
      key={index}
      className="relative mb-5 w-full rounded-xl border bg-white  p-4"
    >
      <button
        className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white p-1 pl-2 pr-2 text-sm text-gray-700 shadow-sm hover:bg-danger hover:text-white"
        onClick={() => remove(index)}
      >
        X
      </button>
      <div className="flex flex-col gap-2">
        <Controller
          name={`experiences.${index}.company`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              isRequired
              type="text"
              placeholder="Canonical"
              className="mb-3 max-w-full text-gray-500"
              {...field}
              fullWidth
              isInvalid={!!error}
              errorMessage={error?.message}
              label="Company"
              maxLength={50}
              {...field}
            />
          )}
        />
        <Controller
          name={`experiences.${index}.role`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              isRequired
              isInvalid={!!error}
              errorMessage={error?.message}
              type="text"
              maxLength={50}
              label="Role"
              placeholder="Senior Web Engineer"
              className="mb-3 max-w-full text-gray-500"
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name={`experiences.${index}.timePeriod.startDate`}
          render={({ field }) => (
            <DatePicker
              showIcon
              placeholderText="Start Date"
              maxDate={new Date()}
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              calendarClassName="calendar"
              className="z-30  w-full rounded-lg border bg-divider p-2 outline-none"
            />
          )}
        />
        <Controller
          control={control}
          name={`experiences.${index}.timePeriod.endDate`}
          render={({ field }) => (
            <div className="flex justify-between gap-2">
              <DatePicker
                disabled={isCurrent}
                showIcon
                placeholderText="End Date"
                maxDate={new Date()}
                onChange={(date) => field.onChange(date)}
                selected={field.value}
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
          )}
        />
        <Controller
          name={`experiences.${index}.description`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              {error && <p className="text-red-500">{error.message}</p>}
              <ReactQuill theme="snow" modules={modules} {...field} />
            </>
          )}
        />
      </div>
    </div>
  );
};

export default ExperienceField;

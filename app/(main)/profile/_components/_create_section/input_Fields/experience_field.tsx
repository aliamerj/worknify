import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { ProfileSchema } from "@/utils/validations/profileValidation";
import ReactQuill from "react-quill";
import { CustomCheckbox } from "./customs/custom_checkbox";

interface IExperienceField {
  control: Control<ProfileSchema>;
  children: React.ReactNode;
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

const ExperienceField = ({ control, index, children }: IExperienceField) => {
  return (
    <div
      key={index}
      className="relative mb-5 w-full rounded-xl border bg-white  p-4"
    >
      {children}
      <div className="flex flex-col gap-2">
        <Controller
          name={`experiences.${index}.company`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              isRequired
              isInvalid={!!error}
              errorMessage={error?.message}
              type="text"
              placeholder="Canonical"
              className="mb-3 max-w-full text-gray-500"
              fullWidth
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
          name={`experiences.${index}.timePeriod.endDate`}
          render={({ field, fieldState: { error } }) => (
            <>
              {error && <p className="text-red-500">{error.message}</p>}
              <CustomCheckbox field={field} />
            </>
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

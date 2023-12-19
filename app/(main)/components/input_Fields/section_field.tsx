import { ProfileSchema } from "@/utils/validations/profileValidation";
import { Input } from "@nextui-org/react";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ISectionField {
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

export const SectionField = ({ control, remove, index }: ISectionField) => {
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
          name={`sections.${index}.title`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              fullWidth
              isInvalid={!!error}
              errorMessage={error?.message}
              label="Title"
              className="mb-3 max-w-full text-gray-500"
              maxLength={50}
              radius="none"
              {...field}
            />
          )}
        />
        <Controller
          name={`sections.${index}.description`}
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

import { ProfileSchema } from "@/utils/validations/profileValidation";
import { Input } from "@nextui-org/react";
import { Control, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ISectionField {
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

export const SectionField = ({ control, children, index }: ISectionField) => {
  return (
    <div key={index} className="relative mb-5 rounded-xl border bg-white  p-4">
      {children}
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

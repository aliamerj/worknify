import { ProjectSchema } from "@/utils/validations/projectValidation";
import Image from "next/image";
import { useState } from "react";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import { RiImageAddFill } from "react-icons/ri";
import { toast } from "react-toastify";

export const ProjectLogoSelection = ({
  currentLogo,
  control,
}: {
  currentLogo?: string | null;
  control: Control<ProjectSchema>;
}) => {
  const [image, setImage] = useState<string | null>(currentLogo ?? null);
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps,
  ) => {
    event.preventDefault();
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImage(URL.createObjectURL(file));
      field.onChange(file);
    } else {
      toast.error("Invalid Image Type");

      setImage(null);
    }
  };

  return (
    <div>
      {image ? (
        <div className="h-28 w-full overflow-hidden rounded-lg border-2 border-gray-300 shadow-md md:h-36 md:w-36">
          <Image
            src={image}
            layout="fill"
            objectFit="cover"
            alt="Project Logo"
          />
        </div>
      ) : (
        <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition duration-300 hover:border-blue-500 hover:bg-blue-50 md:h-36 md:w-36">
          <RiImageAddFill className="text-4xl text-gray-400 hover:text-blue-500" />
        </label>
      )}

      <Controller
        name="logo"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            {error && (
              <p className="text-center text-xs italic text-red-500">
                {error.message}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, { ...field })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </>
        )}
      />
      <h5 className="text-center font-semibold text-gray-700">Project Logo</h5>
    </div>
  );
};

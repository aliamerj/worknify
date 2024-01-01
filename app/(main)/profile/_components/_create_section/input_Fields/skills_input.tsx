import { ProfileSchema } from "@/utils/validations/profileValidation";
import React, { useState, useEffect } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import skillsJSON from "@/utils_files/skills.json";
interface Option {
  name: string;
}
interface ISkillsPicker {
  field: ControllerRenderProps<ProfileSchema>;
  error?: FieldError;
}
export const SkillsPicker = ({ field, error }: ISkillsPicker) => {
  const savedSkills =
    field.value?.toString().length != 0
      ? field.value?.toString().split(",")
      : null;
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    savedSkills ?? [],
  );
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setLoading(true);
    const filteredOptions = skillsJSON
      .filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((opt) => !selectedOptions.includes(opt.name))
      .slice(0, 3);

    setOptions(filteredOptions);
    setLoading(false);
  };

  const selectOption = (option: Option) => {
    if (!selectedOptions.find((opt) => opt === option.name)) {
      setSelectedOptions([...selectedOptions, option.name]);
    }
    setShowDropdown(false);
    setSearch("");
  };

  const removeOption = (skill: string) => {
    setSelectedOptions(selectedOptions.filter((opt) => opt !== skill));
  };

  useEffect(() => {
    if (search) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [search]);
  useEffect(() => {
    const mySkills = selectedOptions.map((opt) => opt).toString();
    field.onChange(mySkills);
  }, [selectedOptions]);

  return (
    <div className="relative w-full max-w-full text-sm">
      <div
        style={{
          borderStartStartRadius: "10px",
          borderStartEndRadius: "10px",
          borderEndEndRadius: showDropdown ? "0px" : "10px",
          borderEndStartRadius: showDropdown ? "0px" : "10px",
        }}
        className={`flex flex-wrap gap-1 rounded-t-2xl bg-divider p-2 ${
          !!error ? "bg-red-200" : ""
        } `}
      >
        {selectedOptions.map((opt, index) => (
          <div key={index} className="flex items-center rounded-md bg-white">
            <div className="p-2">{opt}</div>
            <div
              onClick={() => removeOption(opt)}
              className="cursor-pointer p-2"
            >
              &times;
            </div>
          </div>
        ))}

        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className={`flex-1  border-0 bg-transparent px-0 py-1 outline-none ${
            !!error ? "bg-red-200 placeholder:text-red-500" : ""
          }`}
          placeholder="Select skills"
        />
      </div>
      {!!error && <p className="m-1 pl-1 text-red-500">{error.message}</p>}
      {showDropdown && (
        <div className="absolute left-0 top-3/4 z-30 w-full rounded-b-xl bg-divider font-medium">
          {loading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-0.5 rounded-lg p-2">
              {options.map((opt, index) => (
                <div
                  key={index}
                  onClick={() => selectOption(opt)}
                  className="hover:bg-light-blue-500 cursor-pointer rounded-md bg-white p-2"
                >
                  {opt.name}
                </div>
              ))}
              {options.length === 0 && (
                <div className="text-gray-500">No result</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

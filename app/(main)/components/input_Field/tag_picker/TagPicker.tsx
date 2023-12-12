import { ProfileSchema } from "@/utils/validations/profileValidation";
import React, { useState, useEffect } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import skillsJSON from "@/utils_files/skills.json";
interface Option {
  id: number;
  name: string;
}

const TagPicker = (
  field: ControllerRenderProps<ProfileSchema>,
  error: FieldError | undefined,
) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setLoading(true);
    const filteredOptions = skillsJSON
      .filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((opt) => !selectedOptions.includes(opt))
      .slice(0, 3);

    setOptions(filteredOptions);
    setLoading(false);
  };

  const selectOption = (option: Option) => {
    if (!selectedOptions.find((opt) => opt.id === option.id)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setShowDropdown(false);
    setSearch("");
  };

  const removeOption = (id: number) => {
    setSelectedOptions(selectedOptions.filter((opt) => opt.id !== id));
  };

  useEffect(() => {
    if (search) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [search]);

  return (
    <div className="relative mx-auto max-w-sm text-sm">
      {!!error && <p className="m-10 pl-5 text-red-500">{error.message}</p>}
      <div
        style={{
          borderStartStartRadius: "10px",
          borderStartEndRadius: "10px",
          borderEndEndRadius: showDropdown ? "0px" : "10px",
          borderEndStartRadius: showDropdown ? "0px" : "10px",
        }}
        className="flex flex-wrap gap-1 rounded-t-2xl bg-divider p-2"
      >
        {selectedOptions.map((opt) => (
          <div key={opt.id} className="flex items-center rounded-md bg-white">
            <div className="p-2">{opt.name}</div>
            <div
              onClick={() => removeOption(opt.id)}
              className="cursor-pointer p-2"
            >
              &times;
            </div>
          </div>
        ))}

        <input
          {...field}
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1  border-0 bg-divider px-0 py-1 outline-none"
          placeholder="Select skills"
        />
      </div>
      {showDropdown && (
        <div className="absolute left-0 top-3/4 z-30 w-full rounded-b-xl bg-divider font-medium">
          {loading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-0.5 rounded-lg p-2">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => selectOption(opt)}
                  className="hover:bg-light-blue-500 cursor-pointer rounded-md bg-blue-200 p-2"
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

export default TagPicker;

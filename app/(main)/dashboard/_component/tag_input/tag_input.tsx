import React, { useState } from "react";
import { RiCloseCircleLine } from "react-icons/ri";

export const TagsInput = ({
  tags,
  onSettingTags,
  error,
}: {
  tags: string[];
  onSettingTags: (tags: string[]) => void;
  error: any;
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    if (event.key !== "Enter") return;
    if (input.trim() === "") return;
    if (tags.includes(input.trim())) return;
    onSettingTags([...tags, input.trim()]);
    setInput("");
  };

  const removeTag = (index: number) => {
    onSettingTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      {error &&
        error.map((err: any) => (
          <p className="mb-2 ml-2 text-xs text-red-500">{err.message}</p>
        ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add tags"
        className={`mb-2 w-full rounded-xl ${!!error ? "border-medium border-red-400" : "border border-gray-300"}  p-2 shadow`}
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
          >
            <span>{tag}</span>
            <button
              type="button"
              className="text-blue-800 hover:text-blue-600"
              onClick={() => removeTag(index)}
            >
              <RiCloseCircleLine />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

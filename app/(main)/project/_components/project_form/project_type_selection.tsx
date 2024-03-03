import { ProjectSelection } from "@/db/schemes/projectSchema";
import { Tab, Tabs } from "@nextui-org/react";
import { Key, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

export const ProjectTypeSelection = ({
  currentType,
  field,
  errorMessage,
}: {
  currentType?: string;
  field: any;
  errorMessage?: string;
}) => {
  const [selectedType, setSelectedType] = useState<ProjectSelection["type"]>(
    currentType ?? "public",
  );

  const handleSelectType = (key: Key, field: ControllerRenderProps) => {
    field.onChange(key);
    if (key === "permission") setSelectedType(key);
    else if (key === "private") setSelectedType(key);
    else setSelectedType("public");
  };

  return (
    <Tabs
      variant="bordered"
      defaultSelectedKey="public"
      aria-label="Tabs variants"
      selectedKey={selectedType}
      onSelectionChange={(key) => handleSelectType(key, { ...field })}
      aria-errormessage={errorMessage}
    >
      <Tab key="public" title="Public" />
      <Tab key="permission" title="Permission" />
      <Tab key="private" title="Private" />
    </Tabs>
  );
};

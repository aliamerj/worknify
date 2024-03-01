import { Checkbox } from "@nextui-org/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
export const CustomCheckbox = ({ field }: { field: any }) => {
  const [isCurrent, setIsCurrent] = useState(false);
  return (
    <div className="flex justify-between gap-2">
      <DatePicker
        disabled={isCurrent}
        showIcon
        placeholderText="End Date"
        maxDate={new Date()}
        onChange={(date) => field.onChange(date?.toISOString())}
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
  );
};

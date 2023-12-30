"use client";
import { StarIcon } from "@/global-components/icon/star_icon";
import { Button } from "@nextui-org/react";

export const ButtonHeader = () => {
  return (
    <div className="flex items-center gap-4">
      <Button
        radius="full"
        size="lg"
        className="bg-gradient-to-tr from-primary to-secondary text-white shadow-lg"
      >
        Contact
      </Button>
      <Button
        size="md"
        color="success"
        variant="bordered"
        startContent={<StarIcon isFilled={false} />}
      >
        Star
      </Button>
    </div>
  );
};
